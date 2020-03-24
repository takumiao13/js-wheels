// A simple AMD implementation for all bundled js

var amd = {},
    defined = {}, // defined modules
    waiting = {}, // waiting modules
    hasOwn = Object.prototype.hasOwnProperty;

function hasProp(obj, prop) {
  return hasOwn.call(obj, prop);
}

function callDep(name) {
  if (hasProp(waiting, name)) {
    // delete module from waiting modules
    var args = waiting[name];
    delete waiting[name];

    // call main function to put module to defined modules
    // args => [name, deps, callback]
    main.apply(undefined, args);
  }

  // if the module exists in defined modules
  // just return it
  return defined[name];
}

function main(name, deps, callback) {
  var depName, i, ret, args = [];

  for (i = 0; i < deps.length; i += 1) {
    // get dep module name;
    depName = deps[i];

    // dfs to get sub deps.
    // in `callDep` func will continue to call `main` to get sub deps
    // until the module has no deps
    if (hasProp(defined, depName) || hasProp(waiting, depName)) {
      args[i] = callDep(depName);
    }
  }

  // get module exports
  ret = callback ? 
    callback.apply(defined[name], args) : 
    undefined;
  
  // set exports to defined modules
  if (name) {
    defined[name] = ret;
  }
}

amd.require = function(deps, callback) {
  callback = callback || function () {};

  // async invoke callback
  setTimeout(function () {
    main(undefined, deps, callback);
  }, 4);
};

amd.define = function(name, deps, callback) {
  if (!hasProp(defined, name) && !hasProp(waiting, name)) {
    waiting[name] = [name, deps, callback];
  }
};

module.exports = amd;