
module.exports = function reject(reason) {
  var Ctor = this;
  return new Ctor(function(_, reject) {
    reject(reason);
  });
}