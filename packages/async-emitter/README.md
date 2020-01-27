async-emitter
=============
asyncify `EventEmitter`

## Examples
```js
const EventEmitter = require('events');
const asyncEmitter = require('./index');
const ee = asyncEmitter(new EventEmitter());

let handler;

const fn = (x) => new Promise((resolve, reject) => {
  setTimeout(() => resolve(x+3), 1000);
});

ee.on('foo', ee.receiver((x) => x+1));
ee.once('foo', ee.receiver((x) => Promise.resolve(x+2)));
ee.prependListener('foo', ee.receiver(() => {}));
ee.addListener('foo', handler = ee.receiver(fn));

ee.emitAsync('foo', 0).then(console.log); // => [undefined,1,2,3]
ee.emitAsync('foo', 1).then(console.log); // => [undefined,2,4]

ee.removeListener('foo', handler);
ee.emitAsync('foo', 2).then(console.log); // => [undefined,3]

ee.removeAllListeners('foo');
ee.emitAsync('foo', 3).then(console.log); // => []
```

`emitAsync` method will return the results of the listeners that wrapped with `receiver` via `Promise.all`


## API
```js
asyncEmitter(target: EmitterLikeObject): target
```


## Reference
- [Promisify event emitter](https://glebbahmutov.com/blog/promisify-event-emitter/) - Convert NodeJS EventEmitter emit to a promise-returning method.
- [Promises as EventEmitters](https://gist.github.com/dmvaldman/12a7e46be6c3097aae31)
- [Promisify Javascript Events with Bluebird](https://tedkulp.com/2014/08/promisify-events-with-bluebird/)