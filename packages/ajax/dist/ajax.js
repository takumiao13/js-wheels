(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.ajax = factory());
}(this, function () { 'use strict';

  function CancelToken(executor) {
    let token = this;
    let _resolvePromise;

    token.promise = new Promise((resolve) => {
      _resolvePromise = resolve;
    });

    function cancel(message) {
      // Cancellation has already been requested
      if (token.reason) {
        return;
      }

      const cancel = {
        message,
        __CANCEL__: true
      };
      token.reason = cancel; 
      _resolvePromise(token.reason);
    }

    executor(cancel);
  }

  CancelToken.prototype.throwIfRequested = function() {
    if (this.reason) {
      throw this.reason;
    }
  };

  CancelToken.source = function() {
    let cancel;
    // get cancel method synchronously
    const token = new CancelToken(c => cancel = c);
    return { token, cancel }
  };

  var cancelToken = CancelToken;

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
            resolve(xhr.responseText);
          } else {
            reject(new Error(xhr.statusText));
          }
        }
      };

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

  var src = ajax;

  ajax.CancelToken = cancelToken;

  return src;

}));
