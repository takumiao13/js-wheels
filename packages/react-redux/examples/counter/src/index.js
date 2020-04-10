import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'my-redux' // use custom redux
import { Provider, connect } from 'my-react-redux' // use custom react-redux

import Counter from './Counter'
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