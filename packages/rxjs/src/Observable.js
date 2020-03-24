const { Subscriber } = require('./Subscriber');
const { pipe } = require('./utils/pipe');

const Observable = function(subscribe) {

  this.source = void 0;
  this.operator = void 0;

  if (subscribe) {
    this._subscribe = subscribe;
  }
}

Observable.prototype.subscribe = function(next, error, complete) {
  const sink = new Subscriber(next, error, complete);

  // user can get `sink` from subscribe method
  // var obs$ = Observable.create(function(sink) {
  //   sink.next(1);
  //   sink.next(2);
  // })
  //
  // obs$.subscribe(next, error, complete); 

  let subscription
  if (this.operator) {
    subscription = this.operator.call(sink, this.source)
  } else {
    subscription = this._subscribe(sink);
  }

  sink.add(subscription);
  return sink;
}

/**
 * Creates a new Observable, with this Observable as the source, and the passed
 * operator defined as the new observable's operator.
 * @method lift
 * @param {Operator} operator the operator defining the operation to take on the observable
 * @return {Observable} a new observable with the Operator applied
 */
Observable.prototype.lift = function(operator) {
  const observable = new Observable();
  observable.source = this; // source is the original observable
  observable.operator = operator;
  return observable;
}


Observable.prototype.pipe = function(...operations) {
  if (operations.length === 0) return this;
  // return a piped observable
  return pipe(...operations)(this);
}

Observable.create = function(subscribe) {
  return new Observable(subscribe);
}

exports.Observable = Observable;