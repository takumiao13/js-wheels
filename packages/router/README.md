Router
======
A simple routes for JS (only support hashchange)

## Examples
```js
var Router = require('./index');
var router = new Router();

router.route('/user/:name/post/:id', function(name, id) {
  alert('name: ' + name + ' id: ' + id);
});

router.route('/download/*file', function(file) {
  alert('download: ' + file);
});

// stop listening
router.stop();
```

## Reference