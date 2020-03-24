AMD
===
A simple AMD implementation for all bundled js.

## Examples
```js
define('bar', [], function(){
  function hello(who) {
    return 'Let me introduce: ' + who;
  }

  return {
    hello: hello
  }
});

define('foo', ['bar'], function(bar){
  var hungry = 'hippo';

  function awesome() {
    console.log( bar.hello( hungry ).toUpperCase() );
  }

  return {
    awesome: awesome
  }
});

amd.require(['foo'], function(foo) {
  foo.awesome();
});

// => LET ME INTRODUCE: HIPPO
```

## Reference
- [requirejs/almond](https://github.com/requirejs/almond) - A minimal AMD API implementation for use after optimized builds.