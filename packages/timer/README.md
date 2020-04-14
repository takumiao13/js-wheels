timer
=====
A better interval

## Examples
```js
const cancel = timer((x) => {
  console.log(x);
  if (x === 10) {
    cancel();
    console.log('end');
  }
}, 1000, 2000);
// 1
// 2
// 3
// ...
// 10
// end
```

## API
```js
interface Cancel {
  (): void 0;
}

timer(
  callback: Function,
  period: Number,
  delay: Number
): Cancel
```


## Reference
[Is there a more accurate way to create a Javascript timer than setTimeout?](https://stackoverflow.com/questions/196027/is-there-a-more-accurate-way-to-create-a-javascript-timer-than-settimeout)