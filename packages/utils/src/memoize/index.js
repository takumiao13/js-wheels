/**
 * 
 * @static
 * @memberof module:utils/function
 * @param {Function} fn 
 * @param {Function} [resolver] 
 */
function memoize(fn, resolver) {
  var memoized = function() {
    var ctx = this;
    var cache = memoized.cache;
    var key = '' + (resolver ? resolver.apply(ctx, arguments) : arguments[0])
    if (key in cache) {
      return cache[key];
    } else {
      return (cache[key] = fn.apply(ctx, arguments));
    }
  }
  memoized.cache = {};
  return memoized;
}

module.exports = memoize;