function ajax(url, options) {
  return new Promise(function(resolve, reject) {
    var xhr,
        opts = Object.assign({
          method: 'GET',
          body: null,
          headers: {}
        }, options || {}) 

    if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
      xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // IE 6 and older
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseText)
        } else {
          reject(new Error(xhr.statusText));
        }
      }
    }

    xhr.open(opts.method, url);
    Object.keys(opts.headers).forEach(function(key) {
      xhr.setRequestHeader(key, opts.headers[key]); 
    });
    xhr.send(opts.body);
  })
}