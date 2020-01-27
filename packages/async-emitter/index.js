module.exports = function asyncEmitter(target) {
  var _resQueue = [];
  var _emit = target.emit;

  function emitAsync() {
    var ctx = this,
        args = [].slice.call(arguments);
    
    _emit.apply(ctx, args);

    var pool = _resQueue.slice(); // clone pool
    _resQueue.length = 0;

    return Promise.all(pool);
  }

  function receiver(listener) {
    return function() {
      var args = [].slice.call(arguments);
      _resQueue.push(new Promise((resolve, reject) => {
        resolve(listener.apply(null, args));
      }));
    }
  }
 
  return Object.assign(target, {
    emitAsync: emitAsync,
    receiver: receiver
  })
}