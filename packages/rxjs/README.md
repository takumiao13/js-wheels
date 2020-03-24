rxjs
====
A Simple Rxjs

## Examples
```js
const { Observable } = require('../src');
const { map, filter, take } = require('../src/operators');

new Observable(function(observer) {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.next(4);
  observer.next(5);
  observer.next(6);
})
.pipe(
  take(4),
  filter(x => x % 2 === 0),
  map(x => x + 5)
)
.subscribe(
  console.log, 
  console.error, 
  () => console.log('DONE')
);
```

**output**
```
7
9
DONE
```

## Operators
- `map: (value: any) => any`
- `filter: (value: any) => boolean`
- `take: (count: number)`

## Reference
- [ReactiveX/rxjs](https://github.com/ReactiveX/rxjs) - A reactive programming library for JavaScript.