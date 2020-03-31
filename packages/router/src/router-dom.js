const Router = require('./router');

const createHistory = require('../../history/dist/history');

function RouterDOM(options) {
  Router.call(this, options);
  this.history = createHistory({ mode: options.mode });
}

Object.setPrototypeOf(RouterDOM.prototype, Router.prototype);

RouterDOM.prototype.start = function() {
  return this.history.subscribe((location) => {
    const { pathname } = location;
    this.update(pathname, location);
  });
};

module.exports = RouterDOM;