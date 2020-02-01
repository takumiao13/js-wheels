cookies
=======
JS API for handling cookies.


## Examples
```js
cookies.set('name', 'value');
cookies.set('boolean', true, {
  expires: 7 // days of expires
});
cookies.set('number', 13, {
  path: '' // current url
});
cookies.set('object', { name: 'Bob', age: 13 });
cookies.set('https', true, {
  secure: true
});

cookies.get('name'); //=> value
cookies.get('boolean'); //=> true
cookies.get('object'); //=> { name: 'Bob', age: 13 }

cookies.remove('boolean');
cookies.get('boolean'); //=> null

cookies.remove('number');
cookies.get('number'); //=> 13 remove failed

cookies.remove('number', {
  path: '' // should specify path
})
cookies.get('number'); //=> null remove success

cookies.get('https');
//=> null (when http://)
//=> true (when https://)
```

## API
```js
interface CookieOptions {
  expires: number; // <-- days
  path: string;
  domain: string;
  secure: boolean;
}

cookies.set(name: string, value: any, options?: CookieOptions);

cookies.get(name: string);

cookies.remove(name: string, options?: CookieOptions);
```

## Reference
- [Document/cookie](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie) - MDN Document.cookie
