const amd = require('./index');
const { define } = amd;

// Usage
define('bar', [], function(){
  function hello(who) {
    return 'Let me introduce: ' + who;
  }

  return {
    hello: hello
  };
});

define('foo', ['bar'], function(bar){
  var hungry = 'hippo';

  function awesome() {
    console.log( bar.hello( hungry ).toUpperCase() );
  }

  return {
    awesome: awesome
  };
});

amd.require(['foo'], function(foo) {
  foo.awesome();
});