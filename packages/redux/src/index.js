function createStore(reducer, initialState, enhancer) {
  // apply middlewares to store.dispatch
  if (typeof enhancer === 'function') {
    return enhancer(createStore, reducer, initialState)
  }

  var state = initialState; // store state
  var listeners = [];
  var getState = () => state;
  var dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(handler => handler());
  };

  var subscribe = (listener) => {
    listeners.push(listener)
  };

  // init state tree.
  dispatch({ type: '@@INIT' })

  return {
    getState,
    dispatch,
    subscribe
  }
}

function applyMiddleware(...middlewares) {
  return function(createStore, reducer, initialState) {
    // create store
    var store = createStore(reducer, initialState);
    var dispatch = function() {};

    var middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    };

    // pass store to each middleware and we can get store in closure
    var chain = middlewares.map(middleware => middleware(middlewareAPI));

    // now the each chain is a dispatch decorator
    // `next` is next chain's dispatch
    dispatch = compose(...chain)(store.dispatch)

    // replace original dispatch
    store.dispatch = dispatch;
    return store;
  }
}

function compose(...funcs) {
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

module.exports = {
  createStore,
  applyMiddleware
}