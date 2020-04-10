const { AsyncQueue, Schedulers } = require('../../dist/async-queue-v2');

const delay = ms => new Promise((resolve, reject) => {
  setTimeout(resolve, ms);
})

const asyncQueue = new AsyncQueue({
  concurrency: 1,
  onCompleted() {
    queue.start();
  }
});

asyncQueue.add(() => { 
  console.log('start 1')
  return delay(1000)
}).then(() => 1).then(console.log);

asyncQueue.add(() => {
  console.log('start 2')
  return delay(1000) 
}).then(() => 2).then(console.log);

asyncQueue.add(() => {
  console.log('start 3')
  return delay(1000)
}).then(() => 3).then(console.log);



// Sync Queue
const queue = new AsyncQueue({
  concurrency: 1,
  scheduler: Schedulers.queue,
  autoStart: false
});


queue.add(() => { 
  console.log('start 1')
  return delay(1000)
}).then(() => 1).then(console.log);

queue.add(() => {
  console.log('start 2')
  return delay(1000) 
}).then(() => 2).then(console.log);

queue.add(() => {
  console.log('start 3')
  return delay(1000)
}).then(() => 3).then(console.log);
