function asap(fn) {
  setTimeout(fn, 0);
}

var PENDING = 'PENDING';
var FULFILLED = 'FULFILLED';
var REJECTED = 'REJECTED';

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

MyPromise.prototype.then = function(onFulfilled, onRejected) {
  var promise = this, promise2;
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function(v) { return v };
  onRejected = typeof onRejected === 'function' ? onRejected : function(r) { throw r };
  promise2 = new MyPromise(function(resolve, reject) {
    if (promise._state == PENDING) {
      promise._onFulfilledCallback.push(function() {
        try {
          var x = onFulfilled(promise._value);
          resolve(x);
        } catch (e) {
          reject(e);
        }
      })
      promise._onRejectedCallback.push(function() {     
        try {
          var x = onRejected(promise._value);
          resolve(x);
        } catch (e) {
          reject(e);
        }
      })
    } else {
      asap(function() {
        try {
          if (promise._state == FULFILLED) {
            var x = onFulfilled(promise._value);
          } else if (promise._state == REJECTED) {
            var x = onRejected(promise._value);
          }
          resolve(x);
        } catch (e) {
          reject(e);
        }
      });
    }
  });
  return promise2;
};

MyPromise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected);
};

MyPromise.prototype.spread = function(onFulfilled, onRejected) {
  return this.then(function(results) {
    return onFulfilled.apply(null, results);
  }, onRejected);
}

MyPromise.prototype.sleep = function(time) {
  return this.then(function(value) {
    return new MyPromise(function(resolve, reject) {
      setTimeout(function() { resolve(value) }, time);
    });
  }, function(err) {
    return new MyPromise(function(resolve, reject) {
      setTimeout(function() { reject(value) }, time);
    });
  })
};

MyPromise.race = function(entries) {
  return new MyPromise(function (resolve, reject) {
    var length = entries.length;
    for (var i = 0; i < length; i++) {
      MyPromise.resolve(entries[i]).then(resolve, reject);
    }
  });
};

MyPromise.all = function(entries) {
  return new MyPromise(function(resolve, reject) {
    var counter = 0
    var length = entries.length;
    var results = new Array(length)
    for (var i = 0; i < length; i++) {
      (function(i) {
        MyPromise.resolve(entries[i]).then(function(value) {
          counter++
          results[i] = value
          if (counter == length) {
            return resolve(results)
          }
        }, function(reason) {
          return reject(reason)
        })
      })(i)
    }
  })
};