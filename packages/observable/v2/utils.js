const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);

const methodsToPatch = [
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
  const original = arrayProto[method];
  Object.defineProperty(arrayMethods, method, {
    value: function mutator() {
      const ob = this.__ob__;
      const args = [].slice.call(arguments);
      const result = original.apply(this, args);
      let inserted;
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

exports.arrayMethods = arrayMethods;

exports.isArray = Array.isArray;

exports.isObject = (val) => !!val && typeof val === 'object' || typeof val === 'function'; 

const rePropName = /[^.\[\]]+/g;

function stringToPath(str) {
  var result = [];
  str.replace(rePropName, function(match) {
    result.push(match);
  });
  return result;
}

exports.parsePath = function(expr) {
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


exports.noop = function() {}