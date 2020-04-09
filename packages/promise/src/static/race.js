
var resolvePromise = require('./resolve');

module.exports = function race(entries) {
  var Ctor = this;
  return new Ctor(function (resolve, reject) {
    var length = entries.length;
    for (var i = 0; i < length; i++) {
      resolvePromise.call(Ctor, entries[i])
        .then(resolve, reject);
    }
  });
};