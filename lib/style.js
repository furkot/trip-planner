module.exports = style;

const selectors = ['button', 'link'];

function style(widget) {
  if (widget) {
    const st = selectors.reduce(getData, {
      value: {}
    });
    st.value.theme = widget.dataset.theme;
    if (st.isSet || st.value.theme) {
      return st.value;
    }
  }

  function getData(result, prop) {
    const val = widget.getAttribute(`data-${prop}`);
    if (val != null) {
      result.isSet = true;
      result.value[prop] = getStyles(val);
    }
    return result;
  }
}

function getStyles(selector) {
  const node = document.querySelector(selector);
  if (node && window.getComputedStyle) {
    return copyStyles(window.getComputedStyle(node, null));
  }
}

const properties = [
  'background-attachment', 'background-clip', 'background-color', 'background-image', 'background-origin',
  'background-position', 'background-repeat', 'background-size', 'border-bottom-color', 'border-bottom-left-radius',
  'border-bottom-right-radius', 'border-bottom-style', 'border-bottom-width', 'border-collapse', 'border-image-outset',
  'border-image-repeat', 'border-image-slice', 'border-image-source', 'border-image-width', 'border-left-color',
  'border-left-style', 'border-left-width', 'border-right-color', 'border-right-style', 'border-right-width',
  'border-top-color', 'border-top-left-radius', 'border-top-right-radius', 'border-top-style', 'border-top-width',
  'box-shadow', 'color', 'font-family', 'font-style', 'letter-spacing', 'text-align', 'text-decoration', 'text-indent',
  'text-rendering', 'text-shadow', 'text-overflow', 'text-transform',
  'transition-delay', 'transition-duration', 'transition-property', 'transition-timing-function'
];

function copyStyles(compSt) {
  if (compSt) {
    return properties.map(function (prop) {
      return prop + ': ' + compSt.getPropertyValue(prop) + ';';
    }).join(' ');
  }
}
