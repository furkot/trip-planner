var classes = require('classes'),
  el = require('el'),
  event = require('event'),
  widget, buttons, done;

module.exports = {
    init: init,
    activate: activate
};

function init(wdgt, bttns) {
  widget = wdgt;
  buttons = bttns;
  doneButton(widget);
  if (classes(widget).has('furkot-widget-active')) {
    setActive(done);
  }
  else {
    setInactive(widget);
    buttons.forEach(setInactive);
    setInactive(done);
  }
}

function activate(ac) {
  if (ac === false) {
    setInactive(widget);
    buttons.forEach(setInactive);
    setInactive(done);
  }
  else {
    setActive(widget);
    buttons.forEach(setActive);
    setActive(done);
  }
}

function doneButton() {
  done = document.querySelector('.furkot-widget-done');
  if (!done) {
    widget.insertAdjacentHTML('beforeend', el('a.furkot-widget-done', 'Done'));
    done = widget.querySelector('.furkot-widget-done');
  }
  event.bind(done, 'click', function () {
    activate(false);
  });
}

function setActive(el) {
  classes(el).remove('furkot-widget-inactive').add('furkot-widget-active');    
}

function setInactive(el) {
  classes(el).remove('furkot-widget-active').add('furkot-widget-inactive');    
}
