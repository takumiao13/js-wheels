exports.subscribeToPromise = (promise) => (subscriber) => {
  promise.then(
    (value) => {
      subscriber.next(value);
      subscriber.complete();
    },
    (err) => subscriber.error(err)
  )
  // handle Error later
  //.then(null, hostReportError);
  return subscriber;
};
