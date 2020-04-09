var asap = require('../asap');
var { PENDING, FULFILLED, REJECTED } = require('../const').States;

module.exports = function then(onFulfilled, onRejected) {
  var promise = this;
  var Ctor = this.constructor;

  onFulfilled = typeof onFulfilled === 'function' ? 
    onFulfilled : function(v) { return v };
  
  onRejected = typeof onRejected === 'function' ? 
    onRejected : function(r) { throw r };
  
  return new Ctor(function(resolve, reject) {
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
};