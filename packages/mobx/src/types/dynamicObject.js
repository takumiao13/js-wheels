import { set } from '../api/object-api';

function isPropertyKey(val) {
  return typeof val === 'string' || 
         typeof val === 'number' ||
         typeof val === 'symbol';
}

const objectProxyTraps = {
  has(target, name) {
    const adm = target.$mobx;
    if (isPropertyKey(name)) return adm.has(name)
    return name in target;
  },

  set(target, name, value) {
    if (!isPropertyKey(name)) return false;
    set(target, name, value);
    return true;
  }
}

export function createDynamicObservableObject(base) {
  const proxy = new Proxy(base, objectProxyTraps);
  base.$mobx.proxy = proxy;
  return proxy;
}