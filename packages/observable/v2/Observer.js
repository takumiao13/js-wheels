const { isArray, arrayMethods } = require('./utils');
const { Watcher } = require('./Watcher');
const { Dep } = require('./Dep');

function Observer(data) {
  this.$data = data;
  this.$dep = new Dep();
  this.$$walk(data);
  Object.keys(data).forEach((key) => {
    this.$$proxy(key);
  });
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
      object.__ob__ = this;
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
    const dep = new Dep();
    const property = Object.getOwnPropertyDescriptor(target, key);
    if (property && property.configurable === false) {
      return;
    }

    const getter = property && property.get;
    const setter = property && property.set;

    if ((!getter || setter) && arguments.length === 2) {
      value = target[key]; // cache last value if not getter
    }

    // deep observe later

    Object.defineProperty(target, key, {
      enumerable: true,
      configurable: true,

      get() {
        const val = getter ? getter.call(target) : value;
        if (Dep.target) {
          // Dep.target.addDep(this)
          // - watcher.addDep(dep)
          // - dep.addSub(watcher)
          // dep and watcher will store each other
          dep.depend();
        }
        return val;
      },
      
      set(newValue) {
        const oldValue = getter ? getter.call(target) : value;
      
        if (newValue === oldValue) {
          return
        }

        if (setter) {
          setter.call(target, newValue)
        } else {
          value = newValue
        }

        dep.notify();
      }
    });
  },

  $watch: function(expOrFn, callback, options) {
    const watcher = new Watcher(this, expOrFn, callback, options);

    return function unwatchFn() {
      watcher.teardown()
    }
  },

  $toJSON: function() {
    return this.$data;
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

function observe(value) {
  let ob;
  // prevent observe multi times
  if ('__ob__' in value && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else {
    ob = new Observer(value)
  }
  return ob;
}

exports.Observer = Observer;
exports.observe =  observe;