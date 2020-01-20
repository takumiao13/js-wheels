function jsonp(url, fn, timeout) {
  var target = document.getElementsByTagName('script')[0] || document.head;
  var script = document.createElement('script');
  var timeout = timeout || 60000;

  if (timeout) {
    timer = setTimeout(function(){
      cleanup();
      // error-first callback
      if (fn) fn(new Error('Timeout'));
    }, timeout);
  }

  // define jsonp-callback and attach to window
  var id = 'jsonp_' + (+new Date);
  window[id] = function(data){
    cleanup();
    if (fn) fn(null, data);
  };

  // replace `?` to jsonp-callback name
  // and server can get callback name by `callback` queryParams
  url = url.replace('callback=?', 'callback=' + id);
  script.src = url;
  target.parentNode.insertBefore(script, target);

  // remove script and jsonp-callback
  function cleanup() {
    if (script.parentNode) script.parentNode.removeChild(script);
    window[id] = function() {};
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