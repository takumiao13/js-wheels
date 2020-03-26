const { isArray, isObject } = require('./utils');
const seen = new Set();

exports.traverse = function(value) {
  _traverse(value, seen);
  seen.clear();
}

function _traverse(value, seen) {
  let i, keys;
  const typeIsArray = isArray(value);

  if ((!typeIsArray && !isObject(value)) || Object.isFrozen(value)) {
    return
  }

  const ob = value.__ob__;
  if (ob) {
    const depId = ob.$dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }

  if (typeIsArray) {
    i = value.length;
    while (i--) _traverse(value[i], seen);
  } else {
    keys = Object.keys(value);
    i = keys.length;
    while (i--) _traverse(value[keys[i]], seen);
  }
}