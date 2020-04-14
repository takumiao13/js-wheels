
const timer = require('../index.js')

const cancel = timer((x) => {
  console.log(x);
  if (x === 10) {
    cancel();
    console.log('end');
  }
}, 1000);