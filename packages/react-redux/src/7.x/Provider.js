import React, { useEffect, useMemo } from 'react';
import ReactReduxContext from './Context'; 
import { Subscription } from './Subscription';

const Provider = ({ store, children }) => {
  const contextValue = useMemo(() => {
    const subscription = new Subscription(store);
    return { store, subscription }
  }, [store]);

  useEffect(() => {
    const { subscription } = contextValue;
    subscription.trySubscribe();
    return () => {
      subscription.unsubscribe();
    }
  }, [contextValue]);
  
  return (
    <ReactReduxContext.Provider value={contextValue}>
      {children}
    </ReactReduxContext.Provider>
  )
}

export default Provider