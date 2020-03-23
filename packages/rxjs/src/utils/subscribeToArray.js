exports.subscribeToArray = (array) => (subscriber) => {
  let i, len = array.length;
  for (i = 0; i < len; i++) {
    subscriber.next(array[i]);
  }
  subscriber.complete();
}