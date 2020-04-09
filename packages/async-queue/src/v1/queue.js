export class Queue {
  constructor() {
    this._queue = [];
  }

  enqueue(value) {
    this._queue.push(value);
    return value;
  }

  dequeue() {
    return this._queue.shift();
  }

  peek() {
    return this._queue[0];
  }

  clear() {
    this._queue.length = 0;
  }
  
  size() {
    return this._queue.length;
  }
}