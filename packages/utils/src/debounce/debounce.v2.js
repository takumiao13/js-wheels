function debounce(fn, wait = 0) {
  var timeout, ctx, args, prev;

  function later() {
    var now = +new Date;
    var diff = now - prev;

    if (diff < 0 || diff >= wait) {
      timeout = null;
      fn.apply(ctx, args);
      args = prev = null;
    } else {
      timeout = setTimeout(later, wait - diff);
    }
  }

  return function() {
    ctx = this;
    args = arguments;
    prev = +new Date;
  
    if (!timeout) {
      timeout = setTimeout(later, wait);
    }
  }
}

module.exports = debounce;


var log = debounce(console.log, 1000);

log(1);
log(2);
log(3);