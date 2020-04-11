import { registerListener, notifyListeners } from './listener';
import { globalState } from '../core/globalState';
import { ObservableValue } from './observableValue';

export class ObservableObject {
  constructor(target, values) {
    this.target = target;
    this.values = values;
    this.changeListeners = [];
  }

  read(key) {
    return this.values.get(key).get();
  }

  write(key, newValue) {
    const instance = this.target;
    const observable = this.values.get(key);

    newValue = observable.prepareNewValue(newValue);

    if (newValue !== globalState.UNCHANGED) {
      const change = {
        type: 'update',
        object: this.proxy || instance,
        name: key,
        oldValue: observable.value,
        newValue
      };

      observable.setNewValue(newValue);
      notifyListeners(this, change);
    }
  }

  addObservableProp(propName, newValue) {
    const target = this.target;
    const observable = new ObservableValue(newValue);
    this.values.set(propName, observable);
    newValue = observable.value;

    Object.defineProperty(target, propName, generateObservablePropConfig(propName));
    this.notifyPropertyAddition(propName, newValue);
  }

  observe(listener) {
    return registerListener(this, listener);
  }

  notifyPropertyAddition(key, newValue) {
    const change = {
      type: 'add',
      object: this.proxy || this.target,
      name: key,
      newValue
    };

    notifyListeners(this, change);
  }
}

const observablePropertyConfigs = Object.create(null);

// cache observable define config
function generateObservablePropConfig(propName) {
  return (
    observablePropertyConfigs[propName] ||
    (observablePropertyConfigs[propName] = {
      configurable: true,
      enumerable: true,
      get() {
        return this.$mobx.read(propName);
      },
      set(v) {
        this.$mobx.write(propName, v);
      }
    })
  )
}

// just a create over ObservableOject
// to prevent multiple instance
export function asObservableObject(target) {
  // prevent multiple call
  if (target.$mobx) {
    return target.$mobx;
  }

  const adm = new ObservableObject(target, new Map());
  target.$mobx = adm;
  return adm;
}