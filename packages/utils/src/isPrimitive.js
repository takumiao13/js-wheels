/**
 * Checks if `value` is a primitive.
 * 
 * @static
 * @memberof module:utils/type
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a primitive, else `false`.
 */
function isPrimitive (value) {
  return value == null || value === true || value === false ||
      typeof value === "string" || typeof value === "number";
}

module.exports = isPrimitive;