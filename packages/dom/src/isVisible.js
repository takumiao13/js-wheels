module.exports = function isVisible(elem) {
  if (!elem) {
    return false;
  }

  if (elem.style && elem.parentNode && elem.parentNode.style) {
    var elementStyle = getComputedStyle(elem);
    var parentNodeStyle = getComputedStyle(elem.parentNode);

    return elementStyle.display !== 'none' &&
      parentNodeStyle.display !== 'none' &&
      elementStyle.visibility !== 'hidden';
  }

  return false;
}