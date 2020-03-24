
var defaults = {
  timeout: 60000,
  callback: 'callback',
  prefix: 'jsonp_'
};

function jsonp(url, options, fn) {
  if (typeof options === 'function') {
    fn = options;
    options = {}
  }

  options = Object.assign({}, defaults, options || {});

  var target = document.getElementsByTagName('script')[0] || document.head;
  var script = document.createElement('script');
  var timeout = options.timeout;

  if (timeout) {
    timer = setTimeout(function(){
      cleanup();
      // error-first callback
      if (fn) fn(new Error('Timeout'));
    }, timeout);
  }

  // define jsonp-callback and attach to window
  var prefix = options.prefix;
  var id = prefix + (+new Date);
  window[id] = function(data){
    cleanup();
    if (fn) fn(null, data);
  };

  // replace `?` to jsonp-callback name
  // and server can get callback name by `callback` queryParams
  var callbackName = options.callback;
  script.src = url.replace(callbackName + '=?', callbackName + '=' + id);
  target.parentNode.insertBefore(script, target);

  // caught if got 404/500
  script.onerror = function() {
    cleanup();
    if (fn) fn(new Error('JSONP request to ' + url + ' failed'));
  };

  // remove script and jsonp-callback
  function cleanup() {
    if (script.parentNode) script.parentNode.removeChild(script);

    try {
      delete window[id];
    } catch (e) {
      window[id] = undefined;
    }
    
    if (timer) clearTimeout(timer);
  }

  // cancel jsonp request
  function cancel(){
    if (window[id]) {
      cleanup();
    }
  }

  return cancel;
}

jsonp.defaults = defaults;