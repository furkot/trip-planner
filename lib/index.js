var init = require('domready'),
  classes = require('classes'),
  dataset = require('dataset'),
  el = require('el'),
  event = require('event'),
  qs = require('querystring'),
  state = require('./state'),
  style = require('./style'),
  parseMap = {
    lat: parseFloat,
    lon: parseFloat,
    duration: parseInteger
  },
  href = {
    widget: 'https://trips.furkot.com/widget/plan',
    trip: 'https://trips.furkot.com/trip'
  },
  widget, iframe, ready, deferred, styles, uid;

module.exports = initWidget;

function parseInteger(str) {
  return parseInt(str, 10);
}

function parseValue(key, val) {
  var fn = parseMap[key];
  if (fn) {
    return fn(val);
  }
  return val;
}

function parseKey(key) {
  var query = this, seq, val;
  seq = decodeURIComponent(key).split(/\[/);
  val = query[key];
  if (seq.length > 1) {
    seq.reduce(function (obj, p, i, seq) {
      if (i > 0) {
        p = p.substr(0, p.length - 1);
      }
      if (i === seq.length - 1) {
        obj[p] = parseValue(p, val);
      }
      else {
        obj[p] = obj[p] || (p === 'stops' ? [] : {});
      }
      return obj[p];
    }, query);
  }
  return query;
}

function parse(str) {
  var query = qs.parse(str);
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
    stops = stops.stops || [ stops.stop ];
    stops.forEach(conformStop);
    stops.prepared = true;
    return stops;
  }
}

function isFurkotAction(action) {
  return action && action.indexOf(href.trip) === 0;
}

function isFurkotLink(link) {
  return isFurkotAction(link.getAttribute('href'));
}

function isFurkotForm(form) {
  var action, node;
  action = form.getAttribute('action');
  if (!action) {
    node = form.querySelector('input[type="submit"]') ||
      document.querySelector('input[form="' + form.getAttribute('id') + '"]');
    if (node) {
      action = node.getAttribute('formaction');
    }
  }
  return isFurkotAction(action);
}

function getStopsFromLink(link) {
  var action = link.getAttribute('href');
  if (isFurkotAction(action)) {
    return prepareStops(parse(action.split('?').pop()));
  }
}

function getStopsFromForm(form) {
  return prepareStops(Array.prototype.reduce.call(form.elements, function (result, node) {
    var name, value;
    if (!node.disabled && node.name && node.value) {
      result[node.name] = node.value;
      parseKey.call(result, node.name);
    }
    return result;
  }, {}));
}

function postStops(stops) {
  if (stops) {
    if (ready) {
      if (!stops.prepared) {
        stops.forEach(conformStop);
      }
      iframe.contentWindow.postMessage({
        furkot: true,
        stops: stops,
        styles: styles
      }, iframe.getAttribute('src'));
      styles = undefined;
      state.activate();
    }
    else {
      deferred = stops;
    }
    return true;
  }
}

function initButtons(fn) {
  var wdgt, src;
  wdgt = document.querySelector('.furkot-widget');
  if (wdgt) {
    src = dataset(wdgt, 'source');
    if (src && src.toLowerCase() === 'microdata') {
      return require('plan-microdata')(fn);
    }
  }
  fn();
}

function initWidget(buttons) {
  var id;
  if (!widget) {
    // find Furkot widget; add hidden if not found
    Array.prototype.some.call(document.querySelectorAll('iframe'), function (node) {
      var src = node.getAttribute('src');
      if (src && src.indexOf(href.widget) === 0) {
        iframe = node;
        ready = true;
        if (node.parentElement && classes(node.parentElement).has('furkot-widget')) {
          widget = node.parentElement;
        }
        return true;
      }
    });
    if (!widget) {
      widget = document.querySelector('.furkot-widget');
    }

    if (!widget) {
      id = 'furkot' + Date.now();
      if (!iframe) {
        document.body.insertAdjacentHTML('beforeend', el('div.furkot-widget', el('iframe', {
          frameborder: 0
        }), {
          id: id
        }));
      }
      else {
        node.insertAdjacentHTML('beforebegin', el('div.furkot-widget', {
          id: id
        }));
      }
      widget = document.getElementById(id);
    }
    else if (!iframe) {
      widget.insertAdjacentHTML('beforeend', el('iframe', {
        frameborder: 0
      }));
    }
    if (!iframe) {
      iframe = widget.querySelector('iframe');
      event.bind(window, 'message', function handler(ev) {
        if (!(ev.data && ev.data.furkot && ev.data.planner)) {
          return;
        }
        if (ev.data.planner) {
          event.unbind(window, 'message', handler);
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
  }
  else if (buttons && !Array.isArray(buttons)) {
    // assume parameter is a container
    buttons = findButtons(buttons);
    if (buttons) {
      buttons.links = state.addButtons(buttons.links);
      buttons.submits = state.addButtons(buttons.submits);
      registerButtons(buttons);
    }
  }
  if (widget) {
    uid = dataset(widget, 'uid');
    return {
      plan: postStops
    };
  }
}

/**
 * find Furkot buttons
 */
function findButtons(container) {
  var links, forms;
  container = container || document;
  links = container === document ? document.links : container.querySelectorAll('a');
  links = Array.prototype.reduce.call(links, function (links, link) {
    if (isFurkotLink(link)) {
      links.push(link);
    }
    return links;
  }, []);
  forms = container === document ? document.forms : container.querySelectorAll('form');
  forms = Array.prototype.reduce.call(forms, function (forms, form) {
    if (isFurkotForm(form)) {
      forms.push(form);
    }
    return forms;
  }, []);
  if (links.length || forms.length) {
    return forms.reduce(function (buttons, form) {
      var submit = form.querySelector('input[type="submit"]');
      if (!submit && form.id) {
        submit = document.querySelector('input[type="submit"][form="' + form.id + '"]');
      }
      if (submit) {
        buttons.forms.push(form);
        buttons.submits.push(submit);
      }
      return buttons;
    }, {
      links: links,
      forms: [],
      submits: []
    });
  }
}

/**
 * register Furkot buttons
 */
function registerButtons(buttons) {
  buttons.links.forEach(function (link) {
    if (link) {
      event.bind(link, 'click', function (e) {
        if (postStops(getStopsFromLink(link))) {
          e.preventDefault();
        }
      });
    }
  });
  buttons.forms.forEach(function (form, i) {
    if (form && buttons.submits[i]) {
      event.bind(form, 'submit', function (e) {
        if (postStops(getStopsFromForm(form))) {
          e.preventDefault();
        }
      });
    }
  });
}

init(function () {

  initButtons(function () {
    var buttons = findButtons();

    if (buttons) {
      initWidget(buttons.links.concat(buttons.submits));

      if (widget) {
        registerButtons(buttons);
      }
    }
  });
});
