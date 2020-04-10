const { AsyncQueue } = require('../../dist/async-queue-v2');

const delay = ms => new Promise((resolve, reject) => {
  setTimeout(resolve, ms);
})

const asyncQueue = new AsyncQueue({
  concurrency: 1,
  autoStart: false
});

asyncQueue.add(() => delay(1000)).then(() => 1).then(console.log);
asyncQueue.add(() => delay(1000)).then(() => 2).then(console.log);
asyncQueue.add(() => delay(1000)).then(() => 3).then(console.log);

setTimeout(_ => {
  asyncQueue.start();
}, 2000);

console.log('wait 2s <--------------')