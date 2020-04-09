var { PENDING, FULFILLED, REJECTED } = require('./const').States; 
var asap = require('./asap');
var all = require('./static/all');
var race = require('./static/race');
var resolvePromise = require('./static/resolve');
var rejectPromise = require('./static/reject');
var then = require('./proto/then');
var caught = require('./proto/catch');

function MyPromise(executor) {
  var promise = this;
  this._state = PENDING;
  this._value = void 0;
  this._onFulfilledCallback = [];
  this._onRejectedCallback = [];

  try {
    executor(function resolvePromise(value) {
      _resolve(promise, value);
    }, function rejectPromise(reason) {
      _reject(promise, reason);
    });
  } catch (e) {
    _reject(promise, e);
  }
}

module.exports = MyPromise;

// internal methods
function _resolve(promise, x) {
  var then, thenCalledOrThrow = false;
  if (x === promise) {
    _reject(promise, new TypeError('Chaining cycle detected for promise!'))
  } else if (x instanceof MyPromise) {
    if (x._state === FULFILLED) {
      _fulfill(promise, x._value);
    } else if (x._state === REJECTED) {
      _reject(promise, x._value);
    } else {
      x.then(function(v) {
        _fulfill(promise, v);
      }, function(r) {
        _reject(promise, r);
      });
    }
  } else if (!!x && (typeof x === 'object') || (typeof x === 'function')) {
    try {
      then = x.then;
      if (typeof then === 'function') {
        then.call(x, function(v) {
          if (thenCalledOrThrow) return
          thenCalledOrThrow = true
          _resolve(promise, v);
        }, function(r) {
          if (thenCalledOrThrow) return
          thenCalledOrThrow = true
          _reject(promise, r);
        })
      } else {
        _fulfill(promise, x);
      }
    } catch (e) {
      if (thenCalledOrThrow) return
      thenCalledOrThrow = true;
      _reject(promise, e)
    }
  } else {
    _fulfill(promise, x);
  }
}

function _fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._value = value;
  promise._state = FULFILLED;
  asap(function() {
    for(var i = 0; i < promise._onFulfilledCallback.length; i++) {
      promise._onFulfilledCallback[i](promise._value)
    }
  });
}

function _reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._value = reason;
  promise._state = REJECTED;
  asap(function() {
    for(var i = 0; i < promise._onRejectedCallback.length; i++) {
      promise._onRejectedCallback[i](promise._value)
    }
  });
}

MyPromise.prototype.then = then;
MyPromise.prototype.catch = caught;

MyPromise.all = all;
MyPromise.race = race;
MyPromise.resolve = resolvePromise;
MyPromise.reject = rejectPromise;