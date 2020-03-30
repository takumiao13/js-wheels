var CancelToken = require('../../cancel-token');

function ajax(url, options) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    var opts = Object.assign({
        method: 'GET',
        body: null,
        headers: {},
        token:null
      }, options || {});

    xhr.onreadystatechange = function() {
      if (!xhr || xhr.status === 0) return;
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseText)
        } else {
          reject(new Error(xhr.statusText));
        }
      }
    }

    xhr.open(opts.method, url);

    // set headers
    Object.keys(opts.headers).forEach(function(key) {
      xhr.setRequestHeader(key, opts.headers[key]); 
    });

    // support cancel-token
    var token = opts.token;
    if (token && token.promise && typeof token.promise.then === 'function') {
      token.promise.then(function(reason) {
        xhr.abort();
        reject(reason);
        xhr = null;
      });
    }

    // send the request
    xhr.send(opts.body || null);
  })
}

module.exports = ajax;

ajax.CancelToken = CancelToken;