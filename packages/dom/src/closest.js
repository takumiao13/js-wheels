var matches = require('./matches');

module.exports = function closest(elem, selector) {
  if (elem.closest) {
    return elem.closest(selector);
  }
  
  do {
    if (matches(elem, selector)) return elem;
    elem = elem.parentElement || elem.parentNode;
  } while (elem !== null && elem.nodeType === 1)

  return null;
}