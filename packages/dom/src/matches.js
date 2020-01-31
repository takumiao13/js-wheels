module.exports = function matches(elem, selector) {
	if (typeof selector === 'function') {
    return selector(elem);
  }

  if (!selector || typeof selector !== 'string' || !elem || elem.nodeType !== 1) {
    return false
  }

  var matchesSelector = elem.matches || elem.webkitMatchesSelector ||
                        elem.mozMatchesSelector || elem.oMatchesSelector ||
                        elem.matchesSelector;
  return matchesSelector.call(elem, selector);
}