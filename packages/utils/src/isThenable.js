/**
 * Checks if `value` is a thenable.
 * 
 * @static
 * @memberof module:utils/type
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a thenable, else `false`.
 */
function isThenable(value) {
  const then = !!value && 'then' in value && value.then;
  return !!then && typeof then === 'function';
}

module.exports = isThenable;