var EventEmitter = require('.');
var ee = new EventEmitter();
var listener = console.log;

ee.on('foo', listener);
ee.once('bar', listener);

ee.emit('foo', 'a', 'b', 'c'); // => a, b, c
ee.emit('bar', 'a', 'b', 'c'); // => a, b, c


ee.emit('foo', 'x', 'y'); // => x, y
ee.emit('bar', 'x', 'y');

ee.off('foo', listener);

ee.emit('foo', 'z');
ee.emit('bar', 'z');