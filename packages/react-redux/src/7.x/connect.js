import React, { useState, useContext, useEffect, useMemo } from 'react';
import ReactReduxContext from './Context';

export const connect = (mapStateToProps, mapDispatchToProps) => (WrappedComponent) => {
  return function ConnectedComponent(props) {
    const { store, subscription } = useContext(ReactReduxContext);
    const [ count, setCount ] = useState(0);
  
    useEffect(() => {
      subscription.onStateChange = () => {
        setCount(count + 1);
      }
    }, [count]);

    const newProps = useMemo(() => {
      const stateProps = mapStateToProps(store.getState());
      const dispatchProps = mapDispatchToProps(store.dispatch);
      
      return {
        ...stateProps,
        ...dispatchProps,
        ...props
      }
    }, [props, store, count]);

    return <WrappedComponent {...newProps} />
  
  }
}