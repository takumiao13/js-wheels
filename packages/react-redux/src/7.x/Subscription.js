
export class Subscription {
  constructor(store) {
    this.store = store;
    this.listeners = [];
    this.handleChangeWrapper = this.handleChangeWrapper.bind(this)
  }

  notify() {
    this.listeners.forEach((listener) => listener())
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  trySubscribe() {
    // listen store change
    // and notify self listeners
    // `onStateChange` is the default listener in the listeners
    // we should define `onStateChange` in `connect`
    this.unsubscribe = this.store.subscribe(this.handleChangeWrapper);
  }

  handleChangeWrapper() {
    if (this.onStateChange) {
      this.onStateChange();
    }
  }

  unsubscribe() {
    this.listeners = null;
  }
}