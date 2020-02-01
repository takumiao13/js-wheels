ajax
====
JS API for handleing XHR.

## Examples
```js
ajax('./some/json?foo=1&b=2').then(function(res) {
  console.log(JSON.parse(res));
});

// POST
ajax('./some/json', { 
  method: 'POST',
  body: JSON.stringify({ foo: 1, bar: 2 })
});

// FormData
var formData = new FormData();
formData.append('foo', 1);
formData.append('bar', 2);

ajax('./some/json', {
  metod: 'POST',
  body: formData
});

// headers
ajax('./some/json', {
  method: 'POST',
  body: ['foo=1', 'bar=2'].join('&'),
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});
```

## API
```js
interface AjaxOptions {
  method: 'GET'|'POST'|'PUT'|'DELETE';
  body: string|FormData;
  headers: Object|null;
}

ajax(url: string, options?: AjaxOptions): Promise<any>
```