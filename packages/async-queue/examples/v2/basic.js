const { AsyncQueue } = require('../../dist/async-queue-v2');

const asyncQueue = new AsyncQueue({
  concurrency: 2
})

const delay = ms => new Promise((resolve, reject) => {
  setTimeout(resolve, ms);
})

const delayCatch = ms => new Promise((resolve, reject) => {
  setTimeout(reject, ms);
})

asyncQueue.add(() => delay(1000))
  .then(() => console.log('done 1'))

asyncQueue.add(() => delayCatch(1000))
  .catch(() => console.log('done 2'))

asyncQueue.add(() => delay(1000))
  .then(() => console.log('done 3'))
  
asyncQueue.add(() => delayCatch(1000))
  .catch(() => console.log('done 4'))