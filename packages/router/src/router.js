const Route = require('./route');

function Router() {
  this.stack = [];
}

Router.prototype.route = function(path, callback) {
  const route = new Route(path, callback || noop);
  this.stack.push(route);
  return this;
};

Router.prototype.match = function(path) {
  let i, route, matched = false; 
  const stack = this.stack, len = stack.length;
  for (i = 0; i < len; i++) {
    route = stack[i];
    if (matched = route.match(path)) {
      break;
    }
  }
  return matched;
};

Router.prototype.update = function(path, location) {
  const matched = this.match(path);
  if (matched) {
    const { path, params, callback } = matched;
    const { search, hash } = location;
    callback({ path, params, search, hash });
  }
};

module.exports = Router;