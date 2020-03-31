import React from 'react'
import ReactDOM from 'react-dom'
//import { createStore } from '../../../../redux/src/index.js'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import Counter from './Counter'
import reducers from './reducers'

const store = createStore(reducers);
const rootElement = document.getElementById('root')

window.store = store;

const mapStateToProps = (state) => {
  debugger;
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