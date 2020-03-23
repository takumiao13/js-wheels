
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

// Subscriber
// ==

/**
 * 
 * @param {Function} next 
 * @param {Function} error 
 * @param {Function} complete 
 */
const Subscriber = function(next, error, complete) {
  Subscription.call(this);
  this.isStopped = false;
  this._next = next;
  this._error = error;
  this._complete = complete;
  this._super_ = Subscription.prototype;
};

Object.setPrototypeOf(Subscriber.prototype, Subscription.prototype);

Subscriber.prototype.next = function(value) {
  if (!this.isStopped) {
    this._next && this._next(value);
  }
}

Subscriber.prototype.error = function(err) {
  if (!this.isStopped) {
    this.isStopped = true;
    this._error && this._error(err);
  }
}

Subscriber.prototype.complete = function() {
  if (!this.isStopped) {
    this.isStopped = true;
    this._complete && this._complete();
  }
}

Subscriber.prototype.unsubscribe = function() {
  this.isStopped = true; // disable next later
  this._super_.unsubscribe.call(this);
}

module.exports = Subscriber;