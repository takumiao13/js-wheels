var promisesAplusTests = require('promises-aplus-tests');
var MyPromise = require('./src');

MyPromise.deferred = function() {
  var dfd = {};
  dfd.promise = new MyPromise(function(resolve, reject) {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};

promisesAplusTests(MyPromise, function (err) {
  // All done; output is in the console. Or check `err` for number of failures.
  if (err == null) {
    console.log('pass all')
  }
});

