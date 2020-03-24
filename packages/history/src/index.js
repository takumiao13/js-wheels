
var History = function(options) {
  this.options = options || {};
  this.root = this.options.root || '/';
  this._useHash = this.options.mode === 'hash';
  this.listeners = [];

  this.location = window.location;
  this.history = window.history;

  this.handleChange = this.handleChange.bind(this);
}

History.prototype.subscribe = function(listener) {
  var self = this;
  
  this.listeners.push(listener);
  this._checkListener(1)
  return function unsubscribe() {
    self.listeners = self.listeners.filter(item => item !== listener);
    self._checkListener(-1);
  }
}

History.prototype._checkListener = function(delta) {
  if (this.listeners.length === 1 && delta === 1) {
    if (this._useHash) {
      window.addEventListener('hashchange', this.handleChange, false);
    } else {
      window.addEventListener('popstate', this.handleChange, false);
    }
  } else if (this.listeners.length === 0) {
    this.stop();
  }
}

History.prototype.stop = function() {
  if (this._useHash) {
    window.removeEventListener('hashchange', this.handleChange, false);
  } else {
    window.removeEventListener('popstate', this.handleChange, false);
  }
}

History.prototype.handleChange = function(e) {
  this.listeners.forEach(function(listener) {
    listener(e);
  });
}

History.prototype.getSearch = function() {
  return this.location.search.slice(1);
}

History.prototype.getHash = function() {
  return this.location.hash.slice(1);
}

History.prototype.getPath = function() {
  // trim root path
  var path = this.location.pathname.slice(this.root.length - 1) + this.getSearch()
  // trim head '/'
  return path.charAt(0) == '/' ? path.slice(1) : path;
}

History.prototype.getFragment = function() {
  var fragment;
  if (this._useHash) {
    fragment = this.getPath();
  } else {
    fragment = this.getHash();
  }
  return fragment;
}

History.prototype.push = function(fragment, options = {}) {
  var { replace = false } = options;
  var url = this.root + fragment;

  if (this._useHash) {
    if (replace) {
      location.replace(stripHash(location.href) + '#' + fragment);
    } else {
      this.location.hash = fragment;
    }
  } else {
    this.history[replace ? 'replaceState' : 'pushState']({}, document.title, url);
  }
}

History.prototype.go = function(n) {
  this.history.go(n)
}

History.prototype.back = function() {
  this.history.go(-1);
}

function stripHash(url) {
  const hashIndex = url.indexOf('#');
  return hashIndex === -1 ? url : url.slice(0, hashIndex);
}