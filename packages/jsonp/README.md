jsonp
=====

A JSONP implementation

## API

```js
jsonp(
  url: string, 
  fn: Function, 
  timeout: number|void
): Function
```

## Examples

```js
jsonp('http://foo/jsonp?foo=1&bar=2&callback=?', function(err, data) {
  if (err) {
    // handle error
    return;
  }

  // handle success
}, 3000);
```

cancel jsonp request
```js
var cancel = jsonp('http://foo/jsonp?foo=1&bar=2&callback=?', function() {
  // handle callback
});

cancel();
```

## Reference
- [webmodules/jsonp](https://github.com/webmodules/jsonp) - A simple JSONP implementation.