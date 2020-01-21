function thunkify(fn) {
  return function() {
    var args = [].slice.apply(arguments);
    var defer = {};
    var p = new Promise(function(resolve, reject) {
      defer.resolve = resolve;
      defer.reject = reject;
    });

    /**
     * replace original callback with `resolve`
     * to prevent multiple called
     * 
     * function sum(a, b, callback) {
     *   var x = a + b;
     *   callback(x); // => resolve(x)
     *   callback(x); // => resolve(x)
     * }
     */
    args.push(defer.resolve);

    try {
      fn.apply(null, args); 
    } catch (ex) {
      defer.reject(ex);
    }

    return function(callback) {
      // provide error-first callback
      p.then(function() {
        var args = [].slice.apply(arguments);
        args.unshift(null);
        callback.apply(null, args);
      }, function(err) {
        callback.call(null, err);
      })
    }
  }
}

module.exports = thunkify;


function sum(a, b, callback) {
  var x = a + b;
  callback(x);
  callback(x);
}

var sumThunk = thunkify(sum)(1,1);
sumThunk(console.log); // => 2