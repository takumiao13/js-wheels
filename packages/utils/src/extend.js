/**
 * Creates a child Class extend from parent Class
 *
 * @static
 * @memberof module:utils/util
 * @param {Function} parent The parent Class to extend
 * @param {Object} protoProps The prototype props for child Class
 * @param {Object} staticProps The static props for child Class
 * @returns {Function} Returns a child constructor
 */
function extend(parent, protoProps, staticProps) {
  var child;

  // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your `extend` definition), or defaulted
  // by us to simply call the parent constructor.
  if (protoProps && Object.prototype.hasOwnproperty.call(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = function(){ return parent.apply(this, arguments); };
  }

  // Add static properties to the constructor function, if supplied. 
  Object.assign(child, parent, staticProps);

  // Set the prototype chain to inherit from `parent`, without calling
  // `parent`'s constructor function and add the prototype properties.
  child.prototype = Object.create(parent.prototype);
  Object.assign(child.prototype, protoProps, {
    constructor: child
  });

  // Set a convenience property in case the parent's prototype is needed
  // later.
  child.__super__ = parent.prototype;

  return child;
}

module.exports = extend