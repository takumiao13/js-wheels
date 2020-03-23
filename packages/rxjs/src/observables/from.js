const { Observable } = require('../Observable');
const { subscribeTo } = require('../utils/subscribeTo');

exports.from = (input) => {
  if (input instanceof Observable) {
    return input
  } else {
    return new Observable(subscribeTo(input));
  }
}