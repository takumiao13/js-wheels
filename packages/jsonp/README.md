jsonp
=====

A JSONP implementation

## API

```js
interface jsonpOptions {
  timeout: number = 60000;
  callback: string = 'callback';
  prefix: string = 'jsonp_';
}

jsonp(
  url: string, 
  options?: jsonpOptions,
  fn: Function 
): Function
```

## Examples

```js
jsonp('http://foo/jsonp?foo=1&bar=2&callback=?', {
  timeout: 30000
}, function(err, data) {
  if (err) {
    // handle error
    return;
  }

  // handle success
};
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
- [camsong/fetch-jsonp](https://github.com/camsong/fetch-jsonp) - Make JSONP request like window.fetch.