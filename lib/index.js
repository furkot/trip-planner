import * as state from './state.js';
import style from './style.js';

const parseMap = {
  lat: Number.parseFloat,
  lon: Number.parseFloat,
  duration: parseInteger
};

const FURKOT_URL = 'https://trips.furkot.com';
const WIDGET_URL = '/widget/plan';
const TRIP_URL = '/trip';

const href = {};

let widget;
let iframe;
let ready;
let deferred;
let styles;
let uid;

function parseInteger(str) {
  return Number.parseInt(str, 10);
}

function parseValue(key, val) {
  const fn = parseMap[key];
  if (fn) {
    return fn(val);
  }
  return val;
}

function parseKey(key) {
  const seq = decodeURIComponent(key).split(/\[/);
  const val = this[key];
  if (seq.length > 1) {
    seq.reduce((obj, p, i, seq) => {
      if (i > 0) {
        p = p.slice(0, -1);
      }
      if (i === seq.length - 1) {
        obj[p] = parseValue(p, val);
      } else {
        obj[p] = obj[p] || (p === 'stops' ? [] : {});
      }
      return obj[p];
    }, this);
  }
  return this;
}

function parse(str) {
  const url = new URL(str);
  const query = Object.fromEntries(url.searchParams.entries());
  Object.keys(query).forEach(parseKey, query);
  return query;
}

function conformStop(stop) {
  stop.url = stop.url || window.location.href;
  if (uid && !stop.uid) {
    stop.uid = uid;
  }
}

function prepareStops(stops) {
  if (stops && (stops.stops || stops.stop)) {
    uid = uid || stops.uid;
    stops = stops.stops || [stops.stop];
    stops.forEach(conformStop);
    stops.prepared = true;
    return stops;
  }
}

function isFurkotAction(action) {
  return action?.startsWith(href.trip);
}

function isFurkotLink(link) {
  return isFurkotAction(link.getAttribute('href'));
}

function isFurkotForm(form) {
  let action = form.getAttribute('action');
  if (!action) {
    const node =
      form.querySelector('input[type="submit"]') || document.querySelector(`input[form="${form.getAttribute('id')}"]`);
    if (node) {
      action = node.getAttribute('formaction');
    }
  }
  return isFurkotAction(action);
}

function getStopsFromLink(link) {
  const action = link.getAttribute('href');
  if (isFurkotAction(action)) {
    return prepareStops(parse(action));
  }
}

function getStopsFromForm(form) {
  return prepareStops(
    Array.prototype.reduce.call(
      form.elements,
      (result, node) => {
        if (!node.disabled && node.name && node.value) {
          result[node.name] = node.value;
          parseKey.call(result, node.name);
        }
        return result;
      },
      {}
    )
  );
}

function postStops(stops) {
  if (stops) {
    if (ready) {
      if (!stops.prepared) {
        stops.forEach(conformStop);
      }
      iframe.contentWindow.postMessage(
        {
          furkot: true,
          stops,
          styles
        },
        iframe.getAttribute('src')
      );
      styles = undefined;
      state.activate();
    } else {
      deferred = stops;
    }
    return true;
  }
}

function initButtons(fn) {
  const wdgt = document.querySelector('.furkot-widget');
  const furkotUrl = wdgt?.dataset.furkotUrl || FURKOT_URL;
  href.widget = furkotUrl + WIDGET_URL;
  href.trip = furkotUrl + TRIP_URL;
  if (wdgt) {
    const src = wdgt.dataset.source;
    if (src && src.toLowerCase() === 'microdata') {
      return require('plan-microdata')(fn);
    }
  }
  fn();
}

export default function initWidget(buttons) {
  if (!widget) {
    // find Furkot widget; add hidden if not found
    Array.prototype.some.call(document.querySelectorAll('iframe'), node => {
      const src = node.getAttribute('src');
      if (src?.startsWith(href.widget)) {
        iframe = node;
        ready = true;
        if (node.parentElement?.clasList.contains('furkot-widget')) {
          widget = node.parentElement;
        }
        return true;
      }
    });
    if (!widget) {
      widget = document.querySelector('.furkot-widget');
    }

    if (!widget) {
      const id = `furkot${Date.now()}`;
      if (!iframe) {
        document.body.insertAdjacentHTML(
          `<div class="furkot-widget" id="${id}"><iframe frameborder="0"></iframe></div>`
        );
      } else {
        iframe.insertAdjacentHTML('beforebegin', `<div class="furkot-widget" id="${id}"></div>`);
      }
      widget = document.getElementById(id);
    } else if (!iframe) {
      widget.insertAdjacentHTML('beforeend', '<iframe frameborder="0"></iframe>');
    }
    if (!iframe) {
      iframe = widget.querySelector('iframe');
      window.addEventListener('message', function handler(ev) {
        if (!(ev.data?.furkot && ev.data.planner)) {
          return;
        }
        if (ev.data.planner) {
          window.removeEventListener('message', handler);
          ready = true;
          if (deferred) {
            postStops(deferred);
          }
        }
      });
      iframe.setAttribute('src', href.widget);
    }
    if (widget) {
      state.init(widget, Array.isArray(buttons) ? buttons : []);
      styles = style(widget);
    }
  } else if (buttons && !Array.isArray(buttons)) {
    // assume parameter is a container
    buttons = findButtons(buttons);
    if (buttons) {
      buttons.links = state.addButtons(buttons.links);
      buttons.submits = state.addButtons(buttons.submits);
      registerButtons(buttons);
    }
  }
  if (widget) {
    uid = widget.dataset.uid;
    return {
      plan: postStops
    };
  }
}

/**
 * find Furkot buttons
 */
function findButtons(container = document) {
  const links = Array.prototype.filter.call(container.querySelectorAll('a'), isFurkotLink);
  const forms = Array.prototype.filter.call(container.querySelectorAll('form'), isFurkotForm);
  if (links.length || forms.length) {
    return forms.reduce(
      (buttons, form) => {
        let submit = form.querySelector('input[type="submit"]');
        if (!submit && form.id) {
          submit = document.querySelector(`input[type="submit"][form="${form.id}"]`);
        }
        if (submit) {
          buttons.forms.push(form);
          buttons.submits.push(submit);
        }
        return buttons;
      },
      {
        links,
        forms: [],
        submits: []
      }
    );
  }
}

/**
 * register Furkot buttons
 */
function registerButtons(buttons) {
  buttons.links.forEach(link => {
    if (link) {
      link.addEventListener('click', e => {
        if (postStops(getStopsFromLink(link))) {
          e.preventDefault();
        }
      });
    }
  });
  buttons.forms.forEach((form, i) => {
    if (form && buttons.submits[i]) {
      form.addEventListener('submit', e => {
        if (postStops(getStopsFromForm(form))) {
          e.preventDefault();
        }
      });
    }
  });
}

initButtons(() => {
  const buttons = findButtons();

  if (buttons) {
    initWidget(buttons.links.concat(buttons.submits));

    if (widget) {
      registerButtons(buttons);
    }
  }
});
