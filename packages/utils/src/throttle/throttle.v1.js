// Simple Version
function throttle(fn, wait) {
  var ctx, args;
  var timeout = null;
  var prev = 0; // last fun call timestap

  function later() {
    prev = +new Date // re-compute prev timestap
    timeout = null;
    fn.apply(ctx, args);
    ctx = args = null;
  }

  return function() {
    var now = +new Date;
    ctx = this;
    args = arguments;
    var remaining = wait - (now - prev);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      prev = now;
      fn.apply(ctx, args);
      ctx = args = null;
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
  }
}