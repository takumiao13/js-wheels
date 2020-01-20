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
  n -= yield 1; // <-- 15 - 2 = 14 
  return n; // <-- 14
}

function* sum(n) {
  n += yield 1; // <-- 10 + 1 = 11
  n += yield 2; // <-- 11 + 2 = 13
  var s = yield [Promise.resolve(1), 2];
  n += (s[0] + s[1]); // <-- 13 + 1 + 2 = 16
  return (yield* subtract(n))*2; // <-- 14 * 2 = 28
}

run(sum, 10).then(console.log); // => 28
```

## Resources
- [co](https://github.com/tj/co)