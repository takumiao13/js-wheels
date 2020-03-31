History
=======
A cross-browser history

## Examples
```js
const browserHistory = createHistory({ mode: 'browser' });

const unsubscribe = browserHistory.subscribe(function(location) {
  console.log(location);

  // => location
  // {
  //   pathname: '/home',
  //   search: '?foo=1&baz=2',
  //   hash: #hash
  // }
});

browserHistory.push('/home?foo=1&baz=2#hash');

unsubscribe();
```

## API
```js
interface Location {
  pathname: string; // The path of the URL
  search: string; // The URL query string
  hash: string; // The URL hash fragment
}

createHistory(
  mode: 'browser' | 'hash'
): History

// subscribe / cleanup
History#subscribe((location: Location) => void 0): unsubscribe

// navigation
History#push(path: string);

History#go(delta: number);

History#back();

History#forwar();
```

## Reference
- [ReactTraining/history](https://github.com/ReactTraining/history)
- [jashkenas/backbone](https://github.com/jashkenas/backbone/blob/master/backbone.js#L1737) - Backbone.History
- [vuejs/vue-route](https://github.com/vuejs/vue-router/tree/dev/src/history) - history