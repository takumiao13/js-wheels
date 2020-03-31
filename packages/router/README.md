Router
======
A simple routes for JS

## Examples
```js
var RouterDOM = require('./src/router-dom');
var routerDOM = new RouterDOM({ mode: 'hash' });

routerDOM.route('/user/:name/post/:id', function(match) {
  console.log(match);
});

var stop = routerDOM.start();

// stop listening
// stop()
```

## API
```js
new RouterDOM({
  mode: 'hash' | 'browser'
})

RouterDOM#route(path: string, callback: Function): this

RouterDOM#match(path: string)

RouterDOM#start(): Function stop
```

## Reference
- [jashkenas/backbone](https://github.com/jashkenas/backbone/blob/master/backbone.js#L1631) - Backbone.Router
- [ReactTraining/react-router](https://github.com/ReactTraining/react-router) - Declarative routing for React.