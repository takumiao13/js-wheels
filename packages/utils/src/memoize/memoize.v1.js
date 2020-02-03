// Simple Version
function memoize(fn) {
  var cache = {};
  return function(key) {
    if (key in cache) {
      return cache[key]
    } else {
      return (cache[key] = fn.apply(ctx, arguments));
    }
  }
}

module.exports = memoize;


