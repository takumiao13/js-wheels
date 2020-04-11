

const { observable } = require('../dist/mobx');

const counter = observable.box(1);

const dispoesr = counter.observe(({ type, oldValue, newValue }) => {
  console.log(type, oldValue ,'--->', newValue);
});

counter.set(2);
counter.set(3);

dispoesr();

counter.set(4);

// update 1 ---> 2
// update 2 ---> 3