/**
 * @example
 * fn(1, 2, console.log)
 * 
 * => convert to thunk function
 * 
 * var fnThunk = thunkify(fn)(1, 2)
 * fnThunk(console.log)
 */
function thunkify(fn) {
  // fn is the original function to convert
  return function() {
    var args = [].slice.apply(arguments);

    // should return a thunk function that pass callback as param
    return function(callback) {
 
     /**
      * wrap callback to prevent multiple called
      * 
      * function f(a, b, callback){
      *   var called = false;
      *   var wrappedCallback = function(){
      *     if (called) return;
      *     called = true;
      *     callback.apply(null, arguments);
      *   }
      *   var sum = a + b;
      *   callbackWrap(sum);
      *   callbackWrap(sum);
      * }
      */
      var called = false;
      function wrappedCallback() {
        if (!called) {
          called = true; // lock
          callback.apply(null, arguments); // invoke original callback
        }
      }
      
      args.push(wrappedCallback);

      try {
        fn.apply(null, args);
      } catch(err) {
        callback(err);
      }
    }
  }  
}

module.exports = thunkify;