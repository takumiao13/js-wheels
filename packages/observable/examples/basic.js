
const observe = require('../v2');

const ob = observe({
  name: 'taku',
  age: 13
});

ob.$watch('name', function _watchName(val) {
  console.log(val);
});


ob.name = 'x';
ob.name = 'y';
ob.name = 'z';