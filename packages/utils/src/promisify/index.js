
var CustomPromisifiedSymbol = Symbol('util.promisify.custom');
var CustomPromisifyArgsSymbol = Symbol('util.promisify.args');

/**
 * Converts an error-first callback to a version that returns promises.
 *
 * @static
 * @memberof module:utils/util
 * @param {Function} original The error-fisrt callback
 * @returns {Function} Returns a promisified function
 */
function promisify(original) {
  return function() {
    var args = [].slice.call(arguments);

    // create an object from in case the callback receives multiple
    var argNames = original[CustomPromisifyArgsSymbol];

    return new Promise(function(resolve, reject) {
      args.push(function(err) {
        var values = [].slice.call(arguments, 1);
        
        if (err) {
          return reject(err);
        }

        if (argNames !== undefined && values.length > 1) {
          var obj = {};
          
          for (var i = 0; i < argNames.length; i++) {
            obj[argNames[i]] = values[i];
          }
            
          resolve(obj);
        } else if (values.length > 1) {
          resolve(values);
        } else {
          resolve(values[0]);
        }
      });

      original.apply(this, args);
    });
  }
}

promisify.custom = CustomPromisifiedSymbol;
promisify.args = CustomPromisifyArgsSymbol;