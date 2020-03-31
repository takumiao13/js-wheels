const { match } = require('path-to-regexp');
const noop = function() {}

function Route(path, callback) {
  this.path = path;
  this._match = match(path);
  this._callback = callback || noop;
}

Route.prototype.match = function(path) {
  const matched = this._match(path);
  if (matched) {
    const { path, params } = matched;
    
    return {
      path,
      params,
      callback: this._callback
    }
  }

  return false;
}

module.exports = Route;