CreateError
===========

Create custom error

## Examples
```js
var createError = require('create-error');
var HttpError = createError('HttpError', function(message, statusCode) {
  this.statusCode = statusCode;
});

var err = new HttpError('Not Found', 404);
console.log(err.name); //=> 'HttpError';
console.log(err.message); //=> 'Not Found';
console.log(err.statusCode); //=> 404;
console.log(err.stack.split('\n')[0]); //=> HttpError: Not Found

// when use `Error().stack`
console.log(err.stack.split('\n')[0]); //=> Error
console.log(err.toString()); //=> HttpError: Not Found
```

## API

```js
interface CustomError extends Error {}

createError(
  name: string,
  initialize: (message: string, statusCode: number) => void
): CustomError
```


## Reference
- [justmoon/custom-error.js](https://gist.github.com/justmoon/15511f92e5216fa2624b) - Creating custom Error classes in Node.js.
- [bluebird/src/errors.js](https://github.com/petkaantonov/bluebird/blob/master/src/errors.js) - subError