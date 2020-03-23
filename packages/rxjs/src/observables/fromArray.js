
const { subscribeToArray } = require('../utils/subscribeToArray');
const { Observable } = require('../Observable');

exports.fromArray = (arr) => {
  return new Observable(subscribeToArray(arr))
}