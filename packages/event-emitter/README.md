EventEmitter
============

A simple event emitter

## Examples
```js
var EventEmitter = require('event-emitter');
var ee = new EventEmitter();
var listener = console.log;

ee.on('foo', listener);
ee.emit('foo', 'a', 'b', 'c');
// => a, b, c

ee.off('foo', listener);
ee.emit('foo', 'x', 'y');
// =>
```


## API
```js
// Register an event handler for the given type.
EventEmitter#on(type: string, listener: Function): this

EventEmitter#once(type: string, listener: Function): this

// Remove an event handler for the given type.
EventEmitter#off(type: string, listener: Function): this

// Invoke all handlers for the given type.
EventEmitter#emit(type: string, ...args: any[]): boolean
```


## Reference
- [node/events](https://nodejs.org/dist/latest-v10.x/docs/api/events.html) - Node.js events module.
- [Backbone.Events](https://github.com/jashkenas/backbone/blob/master/backbone.js#L84) - Backbone.Events
- [Olical/EventEmitter](https://github.com/Olical/EventEmitter) - Evented JavaScript for the browser.
- [EventEmitter2/EventEmitter2](https://github.com/EventEmitter2/EventEmitter2) - A nodejs event emitter implementation with namespaces, wildcards, TTL, works in the browser.
- [primus/eventemitter3](https://github.com/primus/eventemitter3) - EventEmitter3 - Because there's also a number 2. And we're faster.
- [mroderick/PubSubJS](https://github.com/mroderick/PubSubJS) - Dependency free publish/subscribe for JavaScript.
- [developit/mitt](https://github.com/developit/mitt) - Tiny 200 byte functional event emitter / pubsub.