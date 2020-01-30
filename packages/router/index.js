var namedParam = /:\w+/g;
var splatParam = /\*\w+/g;

function pathToRegExp(path) {
  path = path
    .replace(namedParam, '([^/]+)')
    .replace(splatParam, '(.*?)');

  return new RegExp('^' + path + '$');
}

function extractParams(path, fragment) {
  var params = path.exec(fragment).slice(1);
  return params;
}

var Router = function Router() {
  this.routes = [];
  this.update = this.update.bind(this);
  this.start();
};

Object.assign(Router.prototype, {
  route: function(path, callback) {
    path = pathToRegExp(path);
    this.routes.push({ 
      path: path, 
      callback: callback || function () {}
    });
  },

  update: function() {
    var context = this;
    var fragment = location.hash.slice(1);
    
    this.routes.forEach(function(route) {
      if (route.path.test(fragment)) {
        var params = extractParams(route.path, fragment);
        route.callback.apply(context, params);
      }
    });
  },

  start: function() {
    window.addEventListener('hashchange', this.update, false);
    window.addEventListener('load', this.update, false);
  },

  stop: function() {
    window.removeEventListener('hashchange', this.update, false);
    window.removeEventListener('load', this.update, false);
  }
});