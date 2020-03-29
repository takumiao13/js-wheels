import { TransitionManager } from './TransitionManager';
import { parsePath } from './utils';

export class BaseHistory {
  constructor(options = {}) {
    this.options = options || {};
    this.transitionManager = new TransitionManager();

    this.location = window.location;
    this.history = window.history;
  }

  subscribe(listener) {
    const self = this;
    const removeListener = this.transitionManager.append(listener);
    this._checkListener(1);

    return function unsubscribe() {
      removeListener();
      self._checkListener(-1);
    }
  }

  getLocation(fragment) {
    return parsePath(fragment);
  }

  go(n) {
    return this.history.go(n);
  }

  forward() {
    return this.history.go(1);
  }

  back() {
    return this.history.go(-1);
  }
}