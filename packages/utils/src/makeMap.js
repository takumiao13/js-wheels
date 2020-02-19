/**
 * Make a map and return a function for checking if a key
 * is in the map.
 *
 * @static
 * @memberof module:utils/util
 * @param {string} str
 * @param {boolean} expectsLowerCase
 * @returns {Function}
 */
function makeMap (str, expectsLowerCase) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

module.exports = makeMap;