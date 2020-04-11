import { ObservableValue } from '../types/observableValue';
import { createDynamicObservableObject } from '../types/dynamicObject';


export function extendObservable(target, props) {

}

export function extendObservableObjectWithProperties(target, props) {

}

const observableFactories = {
  box(value) {
    return new ObservableValue(value)
  },
  object(props) {
    const base = {};
    // create proxy first
    const proxy = createDynamicObservableObject(base);
    // assign prop to proxy
    extendObservableObjectWithProperties(proxy, props);
    return proxy;
  }
};

export const observable = {};

Object.keys(observableFactories).forEach(name => {
  observable[name] = observableFactories[name]
});