/**
 * Inherit the prototype methods from parent into child.
 *
 * @static
 * @memberof module:utils/util
 * @param {Function} child Constructor function which needs to inherit the prototype
 * @param {Function} parent Constructor function to inherit prototype from
 */
function inherits(child, parent) {
  child.__super__ = parent;
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;

  // or
  // Object.setPrototypeOf(child.prototype, parent.prototype);
}

module.exports = inherits;