var classes = require('classes'),
  el = require('el'),
  event = require('event'),
  widget, buttons, done, active;

module.exports = {
  init: init,
  activate: activate,
	addButtons: addButtons
};

function init(wdgt) {
  widget = wdgt;
  buttons = [];
  doneButton(widget);
  active = classes(widget).has('furkot-widget-active');
  processState();
}

/**
 * Adds buttons to the state storage.
 *
 * Returns the buttons that were not present.
 */
function addButtons(bttns) {
  var newButtons = bttns.filter(function(bttn) {
    return buttons.indexOf(bttn) === -1;
  });
  if (newButtons.length) {
    buttons = buttons.concat(newButtons);
    processState();
  }
  return newButtons;
}

function activate(ac) {
  active = ac !== false;
  processState();
}

function processState() {
  if (active === false) {
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
