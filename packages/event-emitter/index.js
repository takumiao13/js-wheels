
function EventEmitter() {
  this._events = {};
}

module.exports = EventEmitter;

EventEmitter.prototype.on = function(type, listener) {
  this._events[type] || (this._events[type] = []);
  this._events[type].push(listener);
  return this;
}

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  return this.on(type, function onceWrapper() {
    var args = [].slice.call(arguments);
    listener.apply(null, args);
    self.off(type, onceWrapper);
  });
}

EventEmitter.prototype.emit = function(type) {
  var args = [].slice.call(arguments, 1);
  var handler = this._events[type];

  if (!handler) return false;

  // loop listeners and invoke listener with given args
  var i, len = handler.length;
  for (i = 0; i < len; i++) {
    handler[i].apply(null, args);
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