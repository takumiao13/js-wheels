const MyPromise = require('./src');

MyPromise.all([
  Promise.resolve(1),
  MyPromise.resolve(2)
]).then(console.log);

MyPromise.all([
  MyPromise.reject('BOOM'),
  Promise.resolve(1)
]).catch(console.log);