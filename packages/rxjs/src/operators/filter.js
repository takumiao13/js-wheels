const { Subscriber } = require('../Subscriber');

exports.filter = (predicate) => {
  return function filterOperator(source) {
    return source.lift(new FilterOperator(predicate));
  }
}

const FilterOperator = function(predicate) {
  this.predicate = predicate;
}

FilterOperator.prototype.call = function(subscriber, source) {
  const filterSubscriber = new FilterSubscriber(subscriber, this.predicate);

  return source.subscribe(filterSubscriber)
}

const FilterSubscriber = function(subscriber, predicate) {
  Subscriber.call(this, subscriber);
  this.predicate = predicate;
}

Object.setPrototypeOf(FilterSubscriber.prototype, Subscriber.prototype);

FilterSubscriber.prototype._next = function(value) {
  let result;
  try {
    result = this.predicate.call(this, value);
  } catch (err) {
    this.dest.error(err);
    return;
  }
  if (result) {
    this.dest.next(value);
  }
}