const { Subscriber } = require('../Subscriber');

exports.map = (project) => {
  return function mapOperation(source) {
    const operator = new MapOperator(project);
    // return a new observable with map operator
    return source.lift(operator);
  }
}

var MapOperator = function(project) {
  // transfer method
  this.project = project;
}

/**
 * 
 * @param {Subscriber} subscriber 
 * @param {Observable} source
 */
MapOperator.prototype.call = function(subscriber, source) {
  // create a new subscriber with the given subscriber
  // subscriber is the dest subscriber
  const mapSubscriber = new MapSubscriber(subscriber, this.project);

  return source.subscribe(mapSubscriber)
}

const MapSubscriber = function(subscriber, project) {
  Subscriber.call(this, subscriber);
  this.project = project;
}

Object.setPrototypeOf(MapSubscriber.prototype, Subscriber.prototype);

MapSubscriber.prototype._next = function(value) {

  let result;
  try {
    result = this.project.call(this, value);
  } catch (err) {
    this.error(err);
    return;
  }

  // pass the converted value to the dest subscriber
  this.dest.next(result);
}