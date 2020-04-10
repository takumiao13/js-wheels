
export class Subscription {
  constructor(store) {
    this.store = store;
    this.listeners = [
      this.handleChangeWrapper.bind(this)
    ];
  }

  notify() {
    this.listeners.forEach((listener) => listener())
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  trySubscribe() {
    this.unsubscribe = this.store.subscribe(() => {
      this.notify();
    });
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