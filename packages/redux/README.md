redux
=====
A Simple Redux

## Examples
```js
const { createStore, applyMiddleware } = require('./src');
const { logger } = require('./src/logger.mw');
const { thunk } = require('./src/thunk.mw');

function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1;
  case 'DECREMENT':
    return state - 1;
  default:
    return state;
  }
}

const store = createStore(
  counter,
  undefined,
  applyMiddleware(thunk, logger)
);

store.subscribe(() => {
  console.log(`counter: ${store.getState()}`);
});

store.dispatch(increment()); // 1
store.dispatch(increment()); // 2
store.dispatch(decrement()); // 1

function increment() {
  return { type: 'INCREMENT' }
}

function decrement() {
  return { type: 'DECREMENT' }
}

// async dispatch
store.dispatch(incrementAsync());
function incrementAsync() {
  return (dispatch) => {
    setTimeout(_ => {
      dispatch(increment());
    }, 1000);
  }
}


// conditional dispatch
store.dispatch(incrementIfOdd());
function incrementIfOdd() {
  return (dispatch, getState) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment())
  };
}
```

**output**
```js
INCREMENT
  dispatching { type: 'INCREMENT' }
  counter: 1
  next state 1
INCREMENT
  dispatching { type: 'INCREMENT' }
  counter: 2
  next state 2
DECREMENT
  dispatching { type: 'DECREMENT' }
  counter: 1
  next state 1
INCREMENT
  dispatching { type: 'INCREMENT' }
  counter: 2
  next state 2
INCREMENT
  dispatching { type: 'INCREMENT' }
  counter: 3
  next state 3
```

## API
```js
import { createStore, applyMiddleware } from 'redux'

createStore(
  reducer: Function, 
  initialState?: any, 
  enhancer?: Function
): Store
```

## Reference
- [reduxjs/redux](https://github.com/reduxjs/redux) - Predictable state container for JavaScript apps.