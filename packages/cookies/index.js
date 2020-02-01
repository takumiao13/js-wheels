(function(root) {
  var cookies = {
    set: function(name, value, options) {
      var cookieText = encodeURIComponent(name) + "=" 
        + encodeURIComponent(JSON.stringify(value));
      var o = Object.assign({ path: '/' }, options || {});
      cookieText += '; path=' + o.path;

      if (o.expires) {
        var exp = +o.expires;
        var d = new Date();
        d.setDate(d.getDate() + exp);
        cookieText += '; expires=' + d.toGMTString(); 
      }
      if (o.domain) cookieText += '; domain=' + o.domain;
      if (o.secure) cookieText += '; secure';
      document.cookie = cookieText;
    },

    remove: function(name, options) {
      this.set(name, '', Object.assign(options || {}, {
        expires: -1
      }));
    },

    get: function(name) {
      var name = encodeURIComponent(name) + '=',
          start = document.cookie.indexOf(name),
          value = null;
      
      if (start > -1){
        var end = document.cookie.indexOf(';', start);
        if (end == -1) end = document.cookie.length;
        value = document.cookie.substring(start + name.length, end);
        value = JSON.parse(decodeURIComponent(value));
      }

      return value;
    }
  };

  root.cookies = cookies;
})(window);