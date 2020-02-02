(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    var dataCache = factory(root);
    module.exports = dataCache;
    module.exports.default = dataCache; // es6 umd support
  } else {
    root.dataCache = factory(root);
  }
}(this, function(root) {

  var rcamelCase = /-([a-z])/g,
      rmultiDash = /[A-Z]/g,
      rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;

  // Custom unique cache key
  var keyProp = '_data-key_' + randomString(10);

  // Utils
  function isEmptyObject(obj) {
    var name;
    for (name in obj) {
      return false;
    }
    return true;
  }

  function randomString(n) {
    return Math.random().toString(36)
      .substr(2, n)
      .split('')
      .map(c => Math.random() < 0.5 ? c.toUpperCase() : c)
      .join('');
  }

  function memoize(func) {
    var cache = Object.create(null);
    return function(str) {
      const result = cache[str];
      return result || (cache[str] = func(str))
    }
  }

  function camelize(str) {
    return str.replace(rcamelCase, (_, c) => c ? c.toUpperCase() : '');
  }

  function hyphenate(str) {
    return str.replace(rmultiDash, '-$&').toLowerCase();
  }

  camelize = memoize(camelize);
  hyphenate = memoize(hyphenate);

  // Data API
  function getCache(elem) {
    var value = elem[keyProp];

    if (!value) {
      value = Object.create(null);

      if (acceptData(elem)) {
        if (elem.nodeType) {
          elem[keyProp] = value;
        } else {
          Object.defineProperty(elem, keyProp, {
            value: value,
            configurable: true
          });
        }
      }
    }

    return value;
  }

  function acceptData(elem) {
    // - Node.ELEMENT_NODE
    // - Node.DOCUMENT_NODE
    // - Object
    return elem.nodeType === 1 || elem.nodeType === 9 || !(+elem.nodeType);
  }

  function setData(elem, key, value) {
    var cache = getCache(elem),
        data;

    // Handle: [owner, key, value] args
    if (typeof key === 'string' && value !== undefined) {
      (data = {})[key] = value;
    // Handle: [owner, { data }] args
    } else {
      data = key;
    }

    for (var prop in data) {
      cache[camelize(prop)] = data[prop];
    }

    return cache;
  }

  function getData(elem, key) {
    var cache = getCache(elem);

    if (elem.nodeType === 1) {
      var attrs = elem.attributes,
          i = attrs.length;

      // set data-* attributes
      while (i--) {
        if (attrs[i]) {
          name = attrs[i].name;
          if (name.indexOf('data-') === 0) {
            name = camelize(name.slice(5));
            dataAttr(elem, name, cache[name]);
          }
        }
      }
    }

    return key === undefined ? 
      cache : 
      elem[keyProp] && elem[keyProp][camelize(key)];
  }

  function dataAttr(elem, key, data) {
    var name;

    if (data === undefined && elem.nodeType === 1) {
      name = 'data-' + hyphenate(key);
      data = elem.getAttribute(name);

      try {
        data = parseData(data);
      } catch (e) {}

      setData(elem, key, data);
    }

    return data;
  }

  function parseData(data) {
    if (data === 'true') return true;
    if (data === 'false') return false;
    if (data === 'null') return null;
    // Only convert to a number if it doesn't change the string
    if (data === +data + '') return +data;
    if (rbrace.test(data)) return JSON.parse(data);
    return data;
  }

  function hasData(elem, key) {
    var cache = elem[keyProp];

    if (cache === undefined) return false;

    if (key === undefined) return !isEmptyObject(cache);
    
    return cache[camelize(key)] !== undefined;
  }

  function removeData(elem, key) {
    var cache = elem[keyProp],
        keys = [];

    if (cache === undefined) return;

    if (key !== undefined) {
      delete cache[camelize(key)];
    }

    // if (elem.nodeType == 1) {
    //   elem.removeAttribute('data-' + hyphenate(key));
    // }

    // Remove cache object if no more data
    if (key === undefined || isEmptyObject(cache)) {
      if (elem.nodeType) {
        elem[keyProp] = undefined;  
      } else {
        delete elem[keyProp];
      }
    }
  }

  function clearData(elem) {
    var cache = getData(elem);

    for (var prop in cache) {
      removeData(elem, prop);
    }
  }

  // expose methods
  return {
    set: setData,
    get: getData,
    has: hasData,
    remove: removeData,
    clear: clearData
  }
}));