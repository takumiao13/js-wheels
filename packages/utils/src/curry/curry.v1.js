function curry(fn) {
  var length = fn.length;
  var combine = [];

  return function curried() {
    var ctx = this;
    var args = [].slice.call(arguments);
    [].push.apply(combine, args);

    if (combine.length >= length) {
      var ret = fn.apply(ctx, combine);
      combine.length = 0; // reset combine;
      return ret;
    } else {
      return curried;
    }
  }
}

module.exports = curry;