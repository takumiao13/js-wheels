(function(root) {
  if (!window.localStorage){ throw new Error('dont support localstorage') }
  
  var NAMESPACE = '__storage__';

  function Storage(options) {
    var o = Object.assign({}, DEFAULTS, options || {});
    var localstorage = window.localStorage;
    var keyMap = recycleKeys();
    
    return {
      set: function(key, value, maxAge) {
        keyMap[key] = 1;
        key = makeKey(key);

        var expires = maxAge ?
          new Date().getTime() + maxAge * 1000 :
          null;
        
        var record = {
          value: JSON.stringify(value), 
          expires: expires
        };

        try {
          localstorage.setItem(key, JSON.stringify(record));
          return true;
        } catch (ex) {
          return false;
        }
      },

      get: function(key) {
        var _key = key;
        key = makeKey(key);
        var record = localstorage.getItem(key);
        if (!record){
          return null;
        }

        record = JSON.parse(record);

        if (record.expires && +new Date() >= record.expires) {
          this.remove(_key);
          return null;  
        }
        
        return JSON.parse(record.value);
      },

      has: function(key) {
        return !!keyMap[key];
      },

      remove(key) {
        delete keyMap[key];

        key = makeKey(key);
        return localstorage.removeItem(key);
      },

      clear() {
        var self = this;
        this.keys().forEach(function(key) {
          self.remove(key);
        });
      },

      keys: function() {
        return Object.keys(keyMap);
      },

      size: function() {
        return this.keys().length;
      }
    };
    
    function recycleKeys() {
      var map = {};
      var i, l = localstorage.length;
      for (i = 0; i < l; i++) {
        var key = localstorage.key(i);
        if (key.indexOf(NAMESPACE) > -1) {
          var parts = key.split('/');
          var prefix = parts.length === 3 ? parts[1] : '';
          key = parts.length === 3 ? parts[2] : parts[1];

          if (o.prefix === prefix) {
            map[key] = 1;
          }
        }
      }
      return map;
    }

    function makeKey(key) {
      if (o.prefix) {
        key = o.prefix + '/' + key;
      }

      key = NAMESPACE + '/' + key;
      return key;
    }
  }

  var DEFAULTS = {
    prefix: ''
  };

  Storage.defaults = DEFAULTS;
  root.Storage = Storage;
}(window));