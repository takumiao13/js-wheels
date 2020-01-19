gen-runner
==========

A generator runner

## API
```js
run(fn*: GeneratorFunction): Promise<any>
```

## Examples
```js
const run = require('gen-runner');

function* subtract(n) {
  n -= yield 1; // <-- 16 - 1 = 15
  n -= yield 2; // <-- 15 - 2 = 13 
  return n; // <-- 13
}

function* sum(n) {
  n += yield 1; // <-- 10 + 1 = 11
  n += yield 2; // <-- 11 + 2 = 13
  var s = yield [Promise.resolve(1), 2];
  n += (s[0] + s[1]); // <-- 13 + 1 + 2 = 16
  n = yield run(subtract, n); // <-- 13
  return n; // <-- 13
}

run(sum, 10).then(console.log); // => 13
```

## Resources
- [co](https://github.com/tj/co)