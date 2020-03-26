const { observe } = require('../v2');

const ob = observe({
  firstName: 'Taku',
  lastName: 'Miao',
  age: 13,
  address: {
    country: 'China',
    city: 'SH'
  }
});

ob.$compute({
  // computed getter
  get fullName() {
    return this.firstName + '-' + this.lastName; 
  },

  // computed setter
  set fullName(val) {
    var [ firstName, lastName ] = val.split('-')
    this.firstName = firstName;
    this.lastName = lastName;
  }
});

ob.$watch('firstName', function(val) {
  console.log('firstName', val);
});

ob.$watch('fullName', function(val, oldval) {
  console.log('fullName', val, oldval);
});

ob.fullName = 'abc-xyz';