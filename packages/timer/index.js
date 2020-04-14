(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    var timer = factory(root);
    module.exports = timer;
    module.exports.default = timer;
  } else {
    root.timer = factory(root);
  }
}(this, function(root) {
  return function timer(callback, period, delay) {
    let start, time;
    let count = 0;
    let timeout = null;
    let _canceled = false;
    
    setTimeout(run, delay || 0)
  
    function instance() {
      if (_canceled) {
        return
      }
  
      count++;
      callback(count);
      
      if (_canceled) {
        return
      }
  
      const now = +new Date;
      const diff = (now - start) - time;  
      const callTime = diff < 0 ? 0 : Math.max(0, period - diff);
      
      time += period;
      timeout = setTimeout(instance, callTime);
    }
  
    function run() {
      start = new Date().getTime();  
      time = 0;
      instance();
    }
  
    return function clear() {
      _canceled = true;
      clearTimeout(timeout);
      timeout = null;
    }
  }
}));
