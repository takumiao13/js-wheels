function debounce(fn, wait) {
  var timeout;
  return function() {
    var ctx = this;
    var args = [].slice.call(arguments);

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(function() {
      fn.apply(ctx, args);
    }, wait);
  }
}

module.exports = debounce;