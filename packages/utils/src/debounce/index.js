function debounce(fn, options = {}) {
  var timeout, ctx, args, prev, result;
  var immediate = options.immediate || false;
  var wait = options.wait || 0;

  function later() {
    var now = +new Date;
    var diff = now - prev;

    if (diff < 0 || diff >= wait) {
      timeout = null;
      
      if (!immediate) {
        fn.apply(ctx, args);
        if (!timeout) ctx = args = null;
      }
    } else {
      timeout = setTimeout(later, wait - diff);
    }
  }

  return function() {
    ctx = this;
    args = arguments;
    prev = + new Date;

    var callNow = !timeout && immediate;
    if (!timeout) {
      timeout = setTimeout(later, wait);
    }
    
    if (callNow) {
      result = fn.apply(ctx, args);
      ctx = args = null;
    }

    return result;
  }
}

module.exports = debounce;


var log = debounce(console.log, { immediate: true, wait: 1000 });

log(1);
log(2);
log(3);