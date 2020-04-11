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
    
    // store subscribe
    subscription.trySubscribe();
    return () => {
      // clean up
      subscription.unsubscribe();
      subscription.onStateChange = null;
    }
  }, [contextValue]);
  
  return (
    <ReactReduxContext.Provider value={contextValue}>
      {children}
    </ReactReduxContext.Provider>
  )
}

export default Provider