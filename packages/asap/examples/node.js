
const asap = require('../index');

const arr = [];
[1,2,3,4].forEach(v => asap(_ => arr.push(v*v)));
setTimeout(() => console.log(arr));