
module.exports = function caught(onRejected) {
  return this.then(null, onRejected);
}