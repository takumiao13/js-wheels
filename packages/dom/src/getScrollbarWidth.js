// Extract from bootstrap modal.js
var cssText = require('./cssText');

var MEASURE_STYLE = {
  position: 'absolute',
  top: '-9999px',
  width: '50px',
  height: '50px',
  overflow: 'scroll';
}

module.exports = function getScrollbarWidth() {
  var scrollDiv = document.createElement('div');
  scrollDiv.style.cssText = cssText(MEASURE_STYLE);
  document.body.appendChild(scrollDiv);
  var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
}