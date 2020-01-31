/**
 * Converts an async function (or a Promise returning function) to a error-first callback.
 * 
 * @static
 * @memberof module:utils/util
 * @param {Function} fn The async function
 * @returns {Function} Returns a callback style function
 * @example
 * 
 * async function say(message) {
 *   return 'hello ' + message;
 * }
 *
 * callbackify(say)('world', function(err, data) {
 *   if (err !== null) return
 *   console.log(data); // => 'hello world'
 * });
 */
function callbackify(fn) {
  return function() {
    var ctx = this;
    var args = [].slice.call(arguments);
    var maybeCb = args.pop();

    function callback() {
      var args = [].slice.call(arguments);
      maybeCb.apply(ctx, args);
    }
  
    fn.apply(ctx, args)
      .then(
        function(value) {
          callback(null, value);
        },
        function(error) {
          callback(error);
        }
      )
  }
}

module.exports = callbackify;