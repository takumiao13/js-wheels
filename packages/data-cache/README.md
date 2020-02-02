dataCache
=========
setter/getter arbitrary data associated with the specified element, like [jQuery.data()](https://api.jquery.com/jQuery.data/)

## Usage

### Set
- `.set(elem, key, value)`
- `.set(elem, obj)`

```js
var div = document.createElement('div');

// dataCache
dataCache.set(div, 'foo', 1);
dataCache.set(div, { bar: 2, baz: 3 });

// jquery
$.data(div, 'foo', 1);
$.data(div, { bar: 2, baz: 3 });
```

### Get
- `.get(elem, key)`
- `.get(elem)`

```js
// datacache
dataCache.get(div, 'foo'); // => 1
dataCache.get(div); // => { bar: 2, baz: 3 }

// jquery
$.data(div, 'foo');
$.data(div);
```

### Remove
- `.remove(elem, key)`
- `.remove(elem)`

```js
// dataCache
dataCache.remove(div, 'foo');
dataCache.remove(div);

// jquery
$.removeData(div, 'foo');
$.removeData(div);
```

### Has
- `.has(elem, key)` - check the `elem` has `key` of stored data.
- `.has(elem)`

```js
// dataCache
dataCache.has(div);
dataCache.has(div, 'foo');

// jquery
$.hasData(div);
```

## Reference
- [dom/data](https://github.com/twbs/bootstrap/blob/master/js/src/dom/data.js) - Bootstrap dom/data.js
- [jQuery.data()](https://api.jquery.com/jQuery.data/)