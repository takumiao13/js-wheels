(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.mobx = {}));
}(this, (function (exports) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function once(func) {
    var called = false;
    return function () {
      if (called) {
        return;
      }

      called = true;
      return func.apply(this, arguments);
    };
  }

  function registerListener(listenable, handler) {
    var listeners = listenable.changeListeners;
    listeners.push(handler);
    return once(function () {
      unregisterListener(listenable, handler);
    });
  }

  function unregisterListener(listenable, handler) {
    var listeners = listenable.changeListeners;
    var idx = listeners.indexOf(handler);
    if (idx > -1) listeners.splice(idx, 1);
  }

  function notifyListeners(listenable, change) {
    var listeners = listenable.changeListeners;
    if (!listeners) return;
    listeners = listeners.slice();
    var i,
        len = listeners.length;

    for (i = 0; i < len; i++) {
      listeners[i](change);
    }
  }

  function defaultComparer(a, b) {
    return Object.is(a, b);
  }

  function identityComparer(a, b) {
    return a === b;
  }

  var comparer = {
    identity: identityComparer,
    "default": defaultComparer
  };

  var globalState = {
    UNCHANGED: function UNCHANGED() {}
  };

  var ObservableValue = /*#__PURE__*/function () {
    function ObservableValue(value) {
      _classCallCheck(this, ObservableValue);

      this.value = value;
      this.equals = comparer["default"]; // should implement Listener interface

      this.changeListeners = [];
    }

    _createClass(ObservableValue, [{
      key: "set",
      value: function set(newValue) {
        // compare newValue and oldValue
        newValue = this._prepareNewValue(newValue); // if changed then set new value

        if (newValue !== globalState.UNCHANGED) {
          this.setNewValue(newValue);
        }
      }
    }, {
      key: "_prepareNewValue",
      value: function _prepareNewValue(newValue) {
        return this.equals(this.value, newValue) ? globalState.UNCHANGED : newValue;
      }
    }, {
      key: "setNewValue",
      value: function setNewValue(newValue) {
        // set new value and notify changed
        var oldValue = this.value;
        this.value = newValue;
        notifyListeners(this, {
          type: 'update',
          object: this,
          newValue: newValue,
          oldValue: oldValue
        });
      }
    }, {
      key: "get",
      value: function get() {
        return this.value;
      }
    }, {
      key: "observe",
      value: function observe(listener, immediately) {
        debugger;

        if (immediately) {
          listener({
            object: this,
            type: 'update',
            newValue: this.value,
            oldvalue: void 0
          });
        }

        return registerListener(this, listener);
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return this.get();
      }
    }]);

    return ObservableValue;
  }();

  var observableFactories = {
    box: function box(value) {
      return new ObservableValue(value);
    }
  };
  var observable = {};
  Object.keys(observableFactories).forEach(function (name) {
    observable[name] = observableFactories[name];
  });

  exports.observable = observable;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
