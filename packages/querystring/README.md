querystring
===========
Parsing and formatting URL query strings for Browser.

## Examples
```js
var str = querystring.stringify({ foo: '中', bar: '文' });
querystring.parse(str); // => { foo: '中', bar: '文' }

querystring.parse('foo=1&bar=2&bar=3&bar=4');
// => { foo: 1, bar: [2, 3, 4]}
```


## API
```js
interface ParsedUrlQuery { [key: string]: string };

querystring.parse(str, sep?: string, eq?: string): ParsedUrlQuery;

querystring.stringify(obj: ParsedUrlQuery, sep?: string, eq?: string): string;

querystring.escape(str: string): string;

querystirng.unescape(str: string): string;
```

## Reference
- [node/querystring](https://nodejs.org/api/querystring.html)