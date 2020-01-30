var asap = require('../asap');

// CONSTANTS
// ==
var rePropName = /[^.\[\]]+/g;
var LAST_VALUE = function() {};

// UTILS
// ==
function isObject(value) {
  return !!value && typeof value === 'object';
}

var isArray = Array.isArray;

function isIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function cloneDeep(source) {
  var target = isArray(source) ? [] : {};
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      if (isObject(source[key])) {
        target[key] = cloneDeep(source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}

function stringToPath(string) {
  var result = [];
  string.replace(rePropName, function(match) {
    result.push(match);
  });
  return result;
}

function noop() {}

// patch array
var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

methodsToPatch.forEach(function(method) {
  // cache original method
  var original = arrayProto[method];
  Object.defineProperty(arrayMethods, method, {
    value: function mutator() {
      var ob = this.__ob__;
      var args = [].slice.call(arguments);
      var result = original.apply(this, args);
      var inserted;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break
        case 'splice':
          inserted = args.slice(2);
          break
      }

      if (inserted) { 
        ob.$$walk(inserted); 
      }

      // notify change
      ob.$$notify();
      return result
    },
    enumerable: false,
    writable: true,
    configurable: true
  });
});

// CLASS Observer
// ==
function Observer(data) {
  var self = this;
  this.$data = data;
  this.$watchers = [];
  this.$$walk(data);
  Object.keys(data).forEach(function(key) {
    self.$$proxy(key);
  })
}

Object.assign(Observer.prototype, {
  $$proxy: function(key) {
    var self = this;
    Object.defineProperty(this, key, {
      configurable: true,
      enumerable: true,
      get: function proxyGet() {
        return self.$data[key];
      },
      set: function proxySet(value) {
        self.$data[key] = value;
      }
    });
  },

  $$walk: function(object) {
    var i;
    // walk array
    if (isArray(object)) {
      
      Object.defineProperty(object, '__ob__', {
        value: this
      });

      // patch array
      Object.setPrototypeOf(object, arrayMethods);
      
      for (i = 0; i < object.length; i++) {
        this.$$walk(object[i]);
      }

    // walk object
    } else {
      var keys = Object.keys(object);
      for (i = 0; i < keys.length; i++) {
        this.$$defineReactive(object, keys[i]);
      }
    }
  },

  $$defineReactive: function(target, key, value) {
    var self = this;
    var property = Object.getOwnPropertyDescriptor(target, key);
    if (property && property.configurable === false) {
      return;
    }

    var getter = property && property.get;
    var setter = property && property.set;

    // use clourse to store last value
    var last = LAST_VALUE;
    if (!getter) {
      last = target[key];
    }

    // dfs walk to def sub object
    if (isObject(last)) {
      this.$$walk(last); 
    }

    Object.defineProperty(target, key, {
      configurable: true,

      get: function() {
        return getter ? getter.call(target) : last;
      },
      
      set: function(value) {
        if (value === last) return;

        if (setter) {
          setter.call(target, value);
        } else {
          last = value;
        }

        if (isObject(last)) {
          self.$$walk(last);
        }

        self.$$notify();
      }
    });
  },

  $$notify: function() {
    var i;
    var $watchers = this.$watchers.slice(); // stab watchers
    for (i = 0; i < $watchers.length; i++) {
      $watchers[i].update();
    }
  },

  $toJSON: function() {
    return this.$data;
  },

  $watch: function(expr, callback, deep) {
    // add watcher
    var watchers = this.$watchers;
    var watcher = new Watcher(this, expr, callback, deep);
    watchers.push(watcher);

    // provide method to unwatch
    return function unwatch() {
      var index = watchers.indexOf(watcher);
      if (index > -1) {
        watchers.splice(index, 1);
      }
    }
  },

  $set: function(key, value) {
    var target = this.$data;
    if (isArray(target) && isIndex(key)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, value);
      return value
    }
  
    if (target.hasOwnProperty(key)) {
      target[key] = value;
      return value
    }

    this.$$proxy(key);
    this.$$defineReactive(target, key);
    this[key] = value;
    
    return value;
  },

  $unset: function(key) {
    var target = this.$data;
    if (isArray(target) && isIndex(key)) {
      target.splice(key, 1);
      return
    }
      
    if (!target.hasOwnProperty(key)) {
      return
    }
  
    // delete proxy key
    delete this[key];
    delete target[key];
    this.$$notify();
  }
});


// CLASS Watcher
// ==
var uid = 0;

function Watcher(ctx, expr, callback, deep) {
  this.id = ++uid;
  this.ctx = ctx;
  this.callback = callback || noop;
  this.deep = deep;

  if (typeof expr === 'function') {
    this.watchFn = expr;
  } else {
    this.watchFn = this.parsePath(expr);
  }

  this.last = this.getValue(); 
}

Object.assign(Watcher.prototype, {
  getValue: function() {
    var value = this.watchFn.call(this.ctx, this.ctx);
    return isObject(value) && this.deep ? 
      cloneDeep(value) : value;
  },

  update: function() {
    // @todo: support immediate later
    watcherQueue.push(this);
  },

  run: function() {
    var newValue = this.getValue(),
        oldValue = this.last;

    if (!this.isEqual(newValue, oldValue, this.deep)) {
      this.last = newValue;
      this.callback.call(this.ctx, newValue, oldValue);
    }
  },

  isEqual: function(newValue, oldValue, deep) {
    if (deep) {
      return JSON.stringify(newValue) === JSON.stringify(oldValue); 
    } else {
      return newValue === oldValue || a !== a && b !== b;
    }
  },

  parsePath: function(expr) {
    var path = stringToPath(expr);

    return function(object) {
      var i, length = path.length;
      for (i = 0; i < length; i++) {
        if (object == null) return void 0;
        object = object[path[i]];
      }

      return length ? object : void 0;
    }
  }
});

var watcherQueue = {
  has: {},
  push: function(watcher) {
    var self = this;
    var id = watcher.id;

    if (this.has[id] == null) {
      this.has[id] = true;
      asap(function() {
        self.has[id] = null;
        watcher.run();
      });
    }
  }
};

// EXPORTS
// ==
function observable(data) {
  return new Observer(data);
}