fetch-extra
===========
Simple extend of `window.fetch`

## Features

- Support params
- Auto stringify body
- Support timeout
- Custom validate response status
- Defaults Options

## Example

### Support `params`

```js
require('fetch-extra');
// old
fetch('/your/path?page=1&pageSize=2');

// now
fetch('/your/path', {
  params: { page: 1, pageSize: 2 }
});
```

### Auto stringify body

```js
// old
fetch('/your/path', {
  method: 'post',
  body: JSON.stringify({ foo: 1, bar: 2}),
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});

// now
fetch('/your/path', {
  method: 'post',
  body: { foo: 1, bar: 2}
})
```

### Support `timeout`

```js
fetch('/your/path', { timeout: 3000 })
  .then()
  .catch(err => { 
    if (err.message === 'timeout') {
      // do something
    }
  })
```

### Custom validate response status

```js
// old
fetch('/server/404').then(resp => { })

// now
fetch('/server/404').catch(err => { })

// your can also add custom validateStatus function
fetch('/server/500', {
  validateStatus: function (status) {
    return status = 200 || status == 304;
  }
}).catch(err => { })
```

### Options defaults

```js
{
  ignoreBody: true, // if method is `GET` or `HEAD` body will be ignored
  timeout: 0,
  validateStatus: function (status) {
    return status >= 200 && status < 300;
  }
}
```

**change default options**

```js
fetch.defaults.timeout = 3000;
fetch.defaults.mode = 'cors'
//...
```

## Test

```bash
jest
```

## Reference
- [github/fetch](https://github.com/github/fetch) - A window.fetch JavaScript polyfill.
- [axios/axios](https://github.com/axios/axios) - Promise based HTTP client for the browser and node.js