ASAP
====

executes a task asynchronously as soon as possible (microtask)

## API
```js
asap(task: Function): void
```

## Examples

infinite loop
```js
function loop() {
  asap(loop)
}

loop();

setTimeout(_ => {
  console.log('never called');
});

// => CALL_AND_RETRY_LAST Allocation failed 
// - JavaScript heap out of memory
```

collect value before next event loop
```js
const arr = [];

[1,2,3,4].forEach(v => asap(_ => arr.push(v*v)));
setTimeout(() => console.log(x));
// => [1,4,9,16]
```

## Reference
- [kriskowal/asap](https://github.com/kriskowal/asap) - High-priority task queue for Node.js and browsers.
- [rsvp](https://github.com/tildeio/rsvp.js/blob/5fa26506c6b084b5d1db6735852f887620e2cc37/lib/rsvp/asap.js#L3-L13)