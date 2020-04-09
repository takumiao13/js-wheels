
var resolvePromise = require('./resolve');

module.exports = function all(entries) {
  var Ctor = this;
  return new Ctor(function(resolve, reject) {
    var count = 0;
    var length = entries.length;
    var results = new Array(length)
    for (var i = 0; i < length; i++) {
      (function(i) {
        resolvePromise.call(Ctor, entries[i])
          .then(function(value) {
            results[i] = value
            if (++count == length) {
              return resolve(results)
            }
          }, reject)
      })(i)
    }
  })
}; 