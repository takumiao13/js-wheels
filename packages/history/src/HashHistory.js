import { BaseHistory } from './BaseHistory';
import { addLeadingSlash } from './utils';

const HashChangeEvent = 'hashchange';
export class HashHistory extends BaseHistory {

  constructor(options) {
    super(options);
    this.handleHashChange = this.handleHashChange.bind(this);
  }

  _checkListener(delta) {
    const listeners = this.transitionManager.listeners;
    if (listeners.length === 1 && delta === 1) {
      window.addEventListener(HashChangeEvent, this.handleHashChange, false);
    } else if (listeners.length === 0) {
      window.removeEventListener(HashChangeEvent, this.handleHashChange, false);
    }
  }

  push(fragment, options = {}) {
    const { replace = false } = options;

    this.transitionManager.transitionTo(null, (ok) => {
      if (replace) {
        const href = stripHash(location.href) + '#' + fragment
        location.replace(href);
      } else {
        this.location.hash = fragment;
      };
    })
  }

  handleHashChange() {
    const fragment = addLeadingSlash(getHashPath());
    const location = this.getLocation(fragment);
    this.transitionManager.transitionTo(null, (ok) => {
      this.transitionManager.notify(location);
    });
  }
}


function stripHash(url) {
  const hashIndex = url.indexOf('#');
  return hashIndex === -1 ? url : url.slice(0, hashIndex);
}

function getHashPath() {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  const href = window.location.href;
  const hashIndex = href.indexOf('#');
  return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
}