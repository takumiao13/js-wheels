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