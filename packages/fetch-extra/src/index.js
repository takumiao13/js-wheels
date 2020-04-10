
(function(root) {
  const isObject = (val) => {
    return val !== null && typeof val === 'object';
  };
  
  const buildURL = (url, params) => {
    if (!params) return url;
  
    let serializedParams = '';
    const parts = [];
  
    for (let [key, val] of Object.entries(params)) {
      if (val === null || typeof val === 'undefined') continue;
      parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
    }
  
    if (parts.length) {
      serializedParams = parts.join('&');
      url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }
  
    return url;
  };
  
  const httpMethods = ['HEAD', 'OPTIONS', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  
  const normailzeMethod = (method) => {
    const upcased = method.toUpperCase();
    return httpMethods.indexOf(upcased) > -1 ? upcased : method;
  };
  
  const validateStatus = (status) => {
    return status >= 200 && status < 300;
  };
  
  const defaults = {
    ignoreBody: true,
    timeout: 0,
    responseType: 'json',
    validateStatus
  };
  
  
  // Extend global `Request` object
  // ==
  const Headers = root.Headers;
  const Request = root.Request;
  
  function Request_(input, options = {}) {
    // check input required
    if (!arguments.length) {
      throw new TypeError('Failed to construct \'Request\': 1 argument required, but only 0 present.')
    }
  
    if (input instanceof Request_) return input;
  
    const opts = Object.assign({}, defaults, options);
    let { 
      ignoreBody, body, params, timeout, validateStatus,
      method = 'GET', 
      headers: _headers,
    } = opts;
  
    // should ignore body
    method = normailzeMethod(method);
    if (ignoreBody && body && (method === 'GET' || method === 'HEAD')) {
      body = null;
    }
  
    // should stringify body
    const headers = new Headers(_headers);
    if (isObject(body)) {
      const contentType = 'content-type';
      if (headers.get(contentType) === null) {
        headers.set(contentType, 'application/json;charset=utf-8');
      }
      body = JSON.stringify(body);
    }
  
    // assign options
    Object.assign(opts, { body, headers });
  
    // create request instance  
    if (params) input = buildURL(input, params);
  
    const req = new Request(input, opts);
    
    // inject prototype chain
    Object.setPrototypeOf(req, Request_.prototype);
  
    Object.defineProperty(req, 'params', {
      value: params,
      enumerable: true,
      configurable: false,
      writable: false
    });
  
    Object.defineProperty(req, 'timeout', {
      value: timeout,
      enumerable: true,
      configurable: false,
      writable: false
    });
  
    Object.defineProperty(req, 'validateStatus', {
      value: validateStatus,
      configurable: false,
      writable: false
    });
  
    return req;
  }
  
  Request_.prototype.__proto__ = Request.prototype;
  
  // Extend global `fetch` method
  // ==
  const fetch = root.fetch;
  
  const fetch_ = (input, options) => {
    return new Promise((resolve, reject) => {

      // handle timeout
      let timer = null;
  
      const request = new Request_(input, options);
      const { timeout } = request;
  
      if (timeout > 0) {
        timer = setTimeout(() => {
          reject(new Error('timeout'));
        }, timeout);
      }
  
      return fetch(request).then(resp => {
        if (timer) clearTimeout(timer);
        if (!request.validateStatus || request.validateStatus(resp.status)) {
          resolve(resp);  
        } else {
          const error = new Error(resp.statusText);
          error.resp = resp;
          reject(error);
        }
      })
    });
  };
  
  fetch_.defaults = defaults;
  
  root.fetch = fetch_;
  root.Request = Request_;
}(window));