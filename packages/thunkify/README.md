thunkify
========

A thunkify implementation

## API
```js
thunkify(fn: Function)(...any): Function
```


## Examples
```js
function sum(a, b, callback) {
  var x = a + b;
  callback(x);
  callback(x);
}

var sumThunk = thunkify(sum)(1,1);
sumThunk(console.log); // => 2
```

## Problem

the callback pass to thunk function will be called only once
```js
const thunkify = require('./thunkify-v1');
const sum = (a, b, callback) => callback(a + b);
const sumThunk = thunkify(sum)(1,1);

const callback = console.log;
sumThunk(callback); // => 2
sumThunk(callback);
```

use v2 version to fix (base on promise)
```js
const thunkify = require('./thunkify-v2');
// error-first callback
sumThunk((err, data) => callback(data));
sumThunk((err, data) => callback(data));
console.log('start');

// => start
// => 2
// => 2
```
**Note:** this approach is async

## Reference
- [tj/node-thunkify](https://github.com/tj/node-thunkify) - Turn a regular node function into one which returns a thunk.
- [hprose.thunkify](https://github.com/hprose/hprose-nodejs/blob/master/lib/common/Future.js#L262) - Hprose is a cross-language RPC. This project is Hprose 2.0 for Node.js.