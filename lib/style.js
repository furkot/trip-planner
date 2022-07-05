var dataset = require('dataset');

module.exports = style;

var selectors = [ 'button', 'link' ];

function style(widget) {
  var st;
  if (widget) {
    st = selectors.reduce(getData, {
      value: {},
      ds: dataset(widget)
    });
    st.value.theme = st.ds.get('theme');
    if (st.isSet || st.value.theme) {
      return st.value;
    }
  }
}

function getData(result, prop) {
  var val = result.ds.get(prop);
  if (val !== undefined) {
    result.isSet = true;
    result.value[prop] = getStyles(val);
  }
  return result;
}

function getStyles(selector) {
  var node = document.querySelector(selector);
  if (node && window.getComputedStyle) {
    return copyStyles(window.getComputedStyle(node, null));
  }
}

var properties = [
  'background-attachment', 'background-clip', 'background-color', 'background-image', 'background-origin',
  'background-position', 'background-repeat', 'background-size', 'border-bottom-color', 'border-bottom-left-radius',
  'border-bottom-right-radius', 'border-bottom-style', 'border-bottom-width', 'border-collapse', 'border-image-outset',
  'border-image-repeat', 'border-image-slice', 'border-image-source', 'border-image-width', 'border-left-color',
  'border-left-style', 'border-left-width', 'border-right-color', 'border-right-style', 'border-right-width',
  'border-top-color', 'border-top-left-radius', 'border-top-right-radius', 'border-top-style', 'border-top-width',
  'box-shadow', 'color', 'font-family', 'font-style', 'letter-spacing', 'text-align', 'text-decoration', 'text-indent',
  'text-rendering', 'text-shadow', 'text-overflow', 'text-transform', '-webkit-transform', '-webkit-transform-origin-x',
  '-webkit-transform-origin-y', '-webkit-transform-origin-z', '-webkit-transform-style', '-webkit-transition-delay',
  'transition-delay', '-webkit-transition-duration', 'transition-duration', '-webkit-transition-property',
  'transition-property', '-webkit-transition-timing-function', 'transition-timing-function' ];

function copyStyles(compSt) {
  if (compSt) {
    return properties.map(function (prop) {
      return prop + ': '  + compSt.getPropertyValue(prop) + ';';
    }).join(' ');
  }
}
