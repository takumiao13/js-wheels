
// Simple Version
function curry(fn) {
  return _curryN(fn.length, [], fn);
}

function curryN(length, fn) {
  return _curryN(length, [], fn);
}

function _curryN(length, received, fn) {
  return function() { 
    var ctx = this;
    var args = [].slice.call(arguments);
    var combined = received.slice();
    [].push.apply(combined, args);

    if (combined.length === length) {
      return fn.apply(ctx, combined);
    } else {
      return _curryN(length, combined, fn);
    }
  }
}

module.exports = {
  curry,
  curryN
}