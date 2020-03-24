const { Subscriber } = require('../Subscriber');

exports.take = (count) => {
  return function takeOperator(source) {
    const operator = new TakeOperator(count);
    return source.lift(operator);
  }
}

const TakeOperator = function(count) {
  this.count = count;
}

TakeOperator.prototype.call = function(subscriber, source) {
  const takeSubscriber = new TakeSubscriber(subscriber, this.count);
  return source.subscribe(takeSubscriber);
}

const TakeSubscriber = function(subscriber, total) {
  Subscriber.call(this, subscriber);
  this.total = total;
  this.count = 0;
}

Object.setPrototypeOf(TakeSubscriber.prototype, Subscriber.prototype);

TakeSubscriber.prototype._next = function(value) {
  const total = this.total;
  const count = ++this.count;
  if (count <= total) {
    this.dest.next(value);
    if (count === total) {
      this.dest.complete();
      this.unsubscribe();
    }
  }
}