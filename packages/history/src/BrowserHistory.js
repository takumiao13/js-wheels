import { BaseHistory } from './BaseHistory';

const PopStateEvent = 'popstate';
export class BrowserHistory extends BaseHistory {

  constructor(options) {
    super(options);
    this.handlePopState = this.handlePopState.bind(this);
  }

  _checkListener(delta) {
    const listeners = this.transitionManager.listeners;
    if (listeners.length === 1 && delta === 1) {
      window.addEventListener(PopStateEvent, this.handlePopState, false);
    } else if (listeners.length === 0) {
      window.removeEventListener(PopStateEvent, this.handlePopState, false);
    }
  }

  push(fragment, options = {}) {
    const { replace = false } = options;
    const url = fragment;
    const location = this.getLocation(fragment);

    this.transitionManager.transitionTo(null, (ok) => {  
      this.history[replace ? 'replaceState' : 'pushState']({}, document.title, url);
      this.transitionManager.notify(location);
    });
  }

  handlePopState() {
    const { pathname, search, hash } = window.location;
    const fragment = pathname + search + hash;
    const location = this.getLocation(fragment);
    this.transitionManager.transitionTo(null, (ok) => {
      this.transitionTo.notify(location);
    });
  }
}