const { AsyncQueue } = require('../../dist/async-queue-v2');

const delay = ms => new Promise((resolve, reject) => {
  setTimeout(resolve, ms);
})

const asyncQueue = new AsyncQueue({
  concurrency: 1,
  autoStart: false,
  onEmpty() {
    console.log('queue is empty');
  },
  onCompleted() {
    console.log('all tasks has done');
  }
});

asyncQueue.add(() => delay(1000))
  .then(() => 1)
  .then(console.log);

asyncQueue
  .add(() => {
    asyncQueue.pause();
    return delay(1000)
  })
  .then(() => 2)
  .then(console.log)
  .then(_ => {
    console.log('wait 3s <----------')
    setTimeout(_ => {
      asyncQueue.start();
    }, 3000);
  })

asyncQueue
  .add(() => delay(1000))
  .then(() => 3)
  .then(console.log);

asyncQueue
  .add(() => delay(1000))
  .then(() => 4)
  .then(console.log);

asyncQueue.start();