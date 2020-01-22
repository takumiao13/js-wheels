module.exports = function createError(name, init) {
 
  function E(message) {
    if (!Error.captureStackTrace) {
      this.stack = Error().stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

    this.message = message;
    init && init.apply(this, arguments);
  }

  E.prototype = Object.create(Error.prototype);
  E.prototype.constructor = E;
  E.prototype.name = name;
  return E;

}