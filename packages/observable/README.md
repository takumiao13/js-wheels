observable
==========
Observe the changes of object.

## Examples
```js
var observable = require('./index');

var user = observable({
  firstName: 'Taku',
  lastName: 'Miao',
  age: 13,
  address: {
    country: 'China',
    city: 'SH'
  },
  
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


user.$watch('age', function(newVal, oldVala) { /* */ })
user.$watch('address.city', function(newVal, oldVala) { /* */ });
var unwatch = user.$watch('address', function(newVal, oldVala) { /* */ }, true);
```

## API
```js
observable(data: Object|Array): Observer

Observer.prototype.$watch(
  expr: string|Function; 
  callback: (newVal: any, oldVal: any) => void;   
  deep: boolean = false;
): Function unwatch;

Observer.prototype.$set<T>(key: string, value: T): T;

Observer.prototype.$unset(key: string): void;
```

## Reference
- [cnlon/smart-observe](https://github.com/cnlon/smart-observe)
- [dntzhang/oba](https://github.com/dntzhang/oba)
- [melanke/Watch.JS](https://github.com/melanke/Watch.JS)