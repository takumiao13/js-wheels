// simple version
module.exports = function promisify(fn) {
  return function() {
    var args = [].slice.call(arguments);   
    return new Promise(function(resolve, reject) {
      args.push(function(err) {
        var values = [].slice.call(arguments, 1);
        if (err) {
          return reject(err);
        }

        if (values.length > 1) {
          resolve(values);
        } else {
          resolve(values[0]);
        }
      });

      fn.apply(this, args);
    });
  }
}