const { Observable, of, from } = require('../src');



from(Promise.resolve(5)).subscribe(console.log);

