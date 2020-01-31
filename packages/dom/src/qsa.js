/*
 * Original code by zepto
 * https://github.com/madrobby/zepto/blob/master/src/selector.js#L57-L77
 */

var simpleSelectorRE = /^[\w-]*$/;

module.exports = function qsa(node, selector) {
  var found,
      maybeID = selector[0] == '#',
      maybeClass = !maybeID && selector[0] == '.',
      nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
      isSimple = simpleSelectorRE.test(nameOnly);

  return (node.getElementById && isSimple && maybeID) ? // Safari DocumentFragment doesn't have getElementById
    ( (found = node.getElementById(nameOnly)) ? [found] : [] ) :
    (node.nodeType !== 1 && node.nodeType !== 9 && node.nodeType !== 11) ? [] :
    [].slice.call(
      isSimple && !maybeID && node.getElementsByClassName ? // DocumentFragment doesn't have getElementsByClassName/TagName
        maybeClass ? node.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
        node.getElementsByTagName(selector) : // Or a tag
        node.querySelectorAll(selector) // Or it's not simple, and we need to query all
    )
}