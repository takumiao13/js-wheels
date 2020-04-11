
import { notifyListeners, registerListener } from './listener';
import { comparer } from '../utils/comparer';
import { globalState } from '../core/globalState';

export class ObservableValue {
  constructor(value) {
    this.value = value;
    this.equals = comparer.default;
    // should implement Listener interface
    this.changeListeners = [];
  }

  set(newValue) {
    // compare newValue and oldValue
    newValue = this._prepareNewValue(newValue);
    // if changed then set new value
    if (newValue !== globalState.UNCHANGED) {
      this.setNewValue(newValue);  
    }
  }

  _prepareNewValue(newValue) {
    return this.equals(this.value, newValue) ?
      globalState.UNCHANGED :
      newValue;
  }

  setNewValue(newValue) {
    // set new value and notify changed
    const oldValue = this.value;
    this.value = newValue;
    
    notifyListeners(this, {
      type: 'update',
      object: this,
      newValue,
      oldValue
    })
  }

  get() {
    return this.value;
  }

  observe(listener, immediately) {
    if (immediately) {
      listener({
        object: this,
        type: 'update',
        newValue: this.value,
        oldvalue: void 0
      });
    }

    return registerListener(this, listener);
  }

  toJSON() {
    return this.get();
  }
}