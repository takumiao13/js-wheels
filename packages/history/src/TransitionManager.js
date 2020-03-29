export class TransitionManager {

  constructor() {
    this.listeners = [];
  }

  append(fn) {
    const listeners = this.listeners;

    function listener(...args) {
      fn(...args);
    }

    listeners.push(listener);

    return () => {
      this.listeners = listeners.filter(item => item !== listener);
    };
  }

  notify(...args) {
    this.listeners.forEach(listener => listener(...args));
  }

  transitionTo(location, callback) {
    callback(true);
  }
}