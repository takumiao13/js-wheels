
module.exports = function resolve(value) {
  var Ctor = this;
  return new Ctor(function(resolve) {
    resolve(value);
  });
}