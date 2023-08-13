const classes = require('classes');
const el = require('el');
const events = require('event');
let widget;
let buttons;
let done;

module.exports = {
  init,
  addButtons,
  activate
};

function init(wdgt, bttns) {
  widget = wdgt;
  buttons = bttns || [];
  doneButton(widget);
  activate(classes(widget).has('furkot-widget-active'));
}

/**
 * Adds buttons to the state storage.
 *
 * Returns array of the same size and order with buttons that were newly added set
 * and buttons that were already present cleared
 */
function addButtons(bttns) {
  const newButtons = bttns.map(function (btn) {
    if (buttons.indexOf(btn) === -1) {
      buttons.push(btn);
      return btn;
    }
  });
  activate(classes(widget).has('furkot-widget-active'));
  return newButtons;
}

function activate(ac) {
  const fn = ac === false ? setInactive : setActive;
  fn(widget);
  buttons.forEach(fn);
  fn(done);
}

function doneButton() {
  done = document.querySelector('.furkot-widget-done');
  if (!done) {
    widget.insertAdjacentHTML('beforeend', el('a.furkot-widget-done', 'Done'));
    done = widget.querySelector('.furkot-widget-done');
  }
  events.bind(done, 'click', function () {
    activate(false);
  });
}

function setActive(el) {
  classes(el).remove('furkot-widget-inactive').add('furkot-widget-active');
}

function setInactive(el) {
  classes(el).remove('furkot-widget-active').add('furkot-widget-inactive');
}
