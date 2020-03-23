const Subscriber = require('./Subscriber');

const Observable = function(subscribe) {
  if (subscribe) {
    this._subscribe = subscribe;
  }
}

Observable.prototype.subscribe = function(next, error, complete) {
  
  const sink = new Subscriber(next, error, complete);

  // user can get `sink` from subscribe method
  // Observable.create(function(sink) {
  //   sink.next(1);
  //   sink.next(2);
  // })

  const subscription = this._subscribe(sink);
  sink.add(subscription);

  return sink;
}


Observable.create = function(subscribe) {
  return new Observable(subscribe);
}

exports.Observable = Observable;