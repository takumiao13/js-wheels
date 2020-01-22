
function EventEmitter() {
  this._events = {};
}

module.exports = EventEmitter;

EventEmitter.prototype.on = function(type, listener) {
  this._events[type] || (this._events[type] = []);
  this._events[type].push(listener);
  return this;
}

EventEmitter.prototype.emit = function(type) {
  var args = [].slice.call(arguments, 1);
  var handler = this._events[type];

  if (!handler) return false;

  // copy handler prevent infinity loop
  var listeners = handler.slice();
  // loop listeners and invoke listener with given args
  for (var i in listeners) {
    listeners[i].apply(null, args);
  }

  return true;
}

EventEmitter.prototype.off = function(type, listener) {
  var handler = this._events[type];

  if (handler) {
    var index = handler.indexOf(listener)
  
    if (index >= -1) {
      handler.splice(index, 1);
    }
  }

  return this;
}