React-Redux
===========
A Simple React-Redux

## Example

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'my-redux' // use custom redux
import { Provider, connect } from 'my-react-redux' // use custom react-redux

import reducers from './reducers'

const store = createStore(reducers);
const rootElement = document.getElementById('root')

const mapStateToProps = (state) => {
  return {
    value: state
  }
}

const mapDispatchToProps = (dispatch) => {
  // dispatch action
  return {
    increment: () => dispatch({ type: 'INCREMENT' }),
    decrement: () => dispatch({ type: 'DECREMENT' })
  }
}

const Counter = function({ value, increment, decrement }) {
  return (
    <p>
      Clicked: {value} times
      {' '}
      <button onClick={increment}>
        +
      </button>
      {' '}
      <button onClick={decrement}>
        -
      </button>
    </p>
  )
}

const CounterContainer = connect(
  mapStateToProps, 
  mapDispatchToProps
)(Counter)

ReactDOM.render(
  <Provider store={store}>
    <CounterContainer />
  </Provider>,
  rootElement
);
```

**reducers.js**
```js
export default (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}
```

## API
```js
<Provider store={store}>

connect(mapStateToProps, mapDispatchToProps)(WrappedComponent)
```


## Reference
- [reduxjs/react-redux](https://github.com/reduxjs/react-redux) - Official React bindings for Redux.
- [【干货】从零实现 react-redux](https://mp.weixin.qq.com/s/8_Usur3IDUIxTRf0yL53uQ)