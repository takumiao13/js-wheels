import React, { Component, Children } from 'react'

export default class Provider extends Component {
  constructor(props, context) {
    super(props, context)
    this.store = props.store;
  }

  getChildContext() {
    return { 
      store: this.store, 
      storeSubscription: null 
    }
  }

  render() {
    return Children.only(this.props.children)
  }
}