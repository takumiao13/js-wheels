var EventEmitter = require('.');
var ee = new EventEmitter();
var listener = console.log;

ee.on('foo', listener);
ee.emit('foo', 'a', 'b', 'c');
// => a, b, c

ee.off('foo', listener);
ee.emit('foo', 'x', 'y');