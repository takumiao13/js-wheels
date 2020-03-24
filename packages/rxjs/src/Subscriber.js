
// Subscription
// ==

let uuid = 0;
const Subscription = function() {
  this._subscriptions = [];
  this._uuid = ++uuid;
}

Subscription.prototype.add = function(subscription) {
  if (!subscription) {
    return Subscription.EMPTY;
  }

  const subscriptions = this._subscriptions;
  if (subscriptions === null) {
    this._subscriptions = [subscription];
  } else {
    subscriptions.push(subscription);
  }

  return subscription;
}

Subscription.prototype.remove = function(subscription) {
  const subscriptions = this._subscriptions;
  if (subscriptions) {
    const subscriptionIndex = subscriptions.indexOf(subscription);
    if (subscriptionIndex !== -1) {
      subscriptions.splice(subscriptionIndex, 1);
    }
  }
}

Subscription.prototype.unsubscribe = function() {
  const subscriptions = this._subscriptions;
  let index = -1;
  let len = subscriptions.length;

  while (++index < len) {
    const sub = subscriptions[index];
    console.log(sub);
    debugger;
    sub.unsubscribe();
  }
}

Subscription.EMPTY = (function(empty) {
  empty.closed = true;
  return empty;
}(new Subscription()))


/**
 * Subscriber
 * 
 * @example
 * new Subscriber(next, error, complete)
 * // or
 * new Subscriber({
 *  next: () => {},
 *  error: () => {},
 *  complete: () => {}
 * })
 * 
 * @param {Function} next 
 * @param {Function} error 
 * @param {Function} complete 
 */
const Subscriber = function(destOrNext, error, complete) {
  Subscription.call(this);
  this.dest = null;
  this.isStopped = false;

  if (typeof destOrNext === 'object') {
    if (destOrNext instanceof Subscriber) {
      this.dest = destOrNext;
    } else {
      // create a safe subscriber
      this.dest = new SafeSubscriber(destOrNext);
    }
  } else if (typeof destOrNext === 'function') {
    this.dest = new SafeSubscriber(destOrNext, error, complete);
  }

  this._super_ = Subscription.prototype;
};

Object.setPrototypeOf(Subscriber.prototype, Subscription.prototype);

Subscriber.prototype.next = function(value) {
  if (!this.isStopped) {
    this._next(value);
  }
}

Subscriber.prototype.error = function(err) {
  if (!this.isStopped) {
    this.isStopped = true;
    this._error(value);
  }
}

Subscriber.prototype.complete = function() {
  if (!this.isStopped) {
    this.isStopped = true;
    this._complete();
  }
}

Subscriber.prototype._next = function(value) {
  this.dest.next(value);
}

Subscriber.prototype._error = function(err) {
  this.dest.error(err);
}

Subscriber.prototype._complete = function() {
  this.dest.complete();
}

Subscriber.prototype.unsubscribe = function() {
  this.isStopped = true; // disable next later
  this._super_.unsubscribe.call(this);
}

exports.Subscriber = Subscriber;


// SafeSubscriber
// ==
const SafeSubscriber = function(observerOrNext, error, complete) {
  let next;
  if (typeof observerOrNext === 'function') {
    next = observerOrNext;
  } else {
    next = observerOrNext.next;
    error = observerOrNext.error;
    complete = observerOrNext.complete;
  }

  this._next = next;
  this._error = error;
  this._complete = complete;
  
  this._super_ = Subscription.prototype;
};

Object.setPrototypeOf(SafeSubscriber.prototype, Subscriber.prototype);

SafeSubscriber.prototype.next = function(value) {
  if (!this.isStopped) {
    this._next && this._next(value);
  }
}

SafeSubscriber.prototype.error = function(err) {
  if (!this.isStopped) {
    this.isStopped = true;
    this._error && this._error(err);
  }
}

SafeSubscriber.prototype.complete = function() {
  if (!this.isStopped) {
    this.isStopped = true;
    this._complete && this._complete();
  }
}