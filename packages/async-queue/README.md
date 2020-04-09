async-queue
===========
Promise based async queue.


## Example
```js
const { AsyncQueue } = require('../dist/async-queue');

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
  .catch(() => console.log('fail 2'))

asyncQueue.add(() => delay(1000))
  .then(() => console.log('done 3'))
  
asyncQueue.add(() => delayCatch(1000))
  .catch(() => console.log('fail 4'))
```

output
```
done 1
fail 2

-- wait 1s

done 3
fail 4
```

## API
```js
new AsyncQueue({
  concurrency = Infinity: Number
})

AsyncQueue.prototype.add(() => Promise<any>): Promise<any>
```


## Reference
- [asynchronous-javascript-queue](https://medium.com/@griffinmichl/asynchronous-javascript-queue-920828f6327)
- [sindresorhus/p-queue](https://github.com/sindresorhus/p-queue/blob/master/source/index.ts)
- [promise-queue/promise-queue](https://github.com/promise-queue/promise-queue/blob/master/lib/index.js)
- [easy-promise-queue](https://github.com/chenzhihao/easy-promise-queue/blob/master/src/PromiseQueue.ts)
- [async.queue](http://caolan.github.io/async/docs.html#queue)