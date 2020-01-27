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