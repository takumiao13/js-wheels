const { isArray } = require('./isArray');
const { isPromise } = require('./isPromise');
const { subscribeToArray } = require('./subscribeToArray');
const { subscribeToPromise } = require('./subscribeToPromise');

exports.subscribeTo = (result) => {
  if (isArray(result)) {
    return subscribeToArray(result);
  } else if (isPromise(result)) {
    return subscribeToPromise(result);
  } else {
    throw new TypeError();
  }
}