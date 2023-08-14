module.exports = {
  init,
  addButtons,
  activate
};

let widget;
let buttons;
let done;

function init(wdgt, bttns = []) {
  widget = wdgt;
  buttons = bttns;
  doneButton(widget);
  activate(widget.classList.contains('furkot-widget-active'));
}

/**
 * Adds buttons to the state storage.
 *
 * Returns array of the same size and order with buttons that were newly added set
 * and buttons that were already present cleared
 */
function addButtons(bttns) {
  const newButtons = bttns.map(btn => {
    if (buttons.indexOf(btn) === -1) {
      buttons.push(btn);
      return btn;
    }
  });
  activate(widget.classList.contains('furkot-widget-active'));
  return newButtons;
}

function activate(ac = true) {
  setState(widget, ac);
  buttons.forEach(b => setState(b, ac));
  setState(done, ac);
}

function doneButton() {
  done = document.querySelector('.furkot-widget-done');
  if (!done) {
    widget.insertAdjacentHTML('beforeend', '<a class="furkot-widget-done">Done</a>');
    done = widget.querySelector('.furkot-widget-done');
  }
  done.addEventListener('click', () => activate(false));
}

function setState(el, active) {
  el.classList.toggle('furkot-widget-active', active);
  el.classList.toggle('furkot-widget-inactive', !active);
}
