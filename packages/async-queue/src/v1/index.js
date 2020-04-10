import { Queue } from './queue';

const defaults = {
  concurrency: Infinity
};

export class AsyncQueue {
  constructor(options) {
    this.options = Object.assign({}, defaults, options);
    this._pendingCount = 0;
    this._queue = new Queue();
    this._concurrency = this.options.concurrency;
  }

  add(task) {
    return new Promise((resolve, reject) => {
      // build task and enqueue
      const runTask = this._buildTask(task, resolve, reject);
      this._queue.enqueue(runTask)

      if (this._pendingCount < this._concurrency) {
        this._next();
      }
    })
  }

  _buildTask(task, resolve, reject) {
    const runTask = () => {
      this._pendingCount++;

      const done = this._taskComplete(resolve);
      const fail = this._taskComplete(reject); 

      try {
        const ret = task();
        Promise.resolve(ret).then(done, fail);
      } catch (err) {
        fail(err);
      }
    }

    return runTask;
  }

  _taskComplete(settle) {
    const complete = (result) => {
      this._pendingCount--;
      settle(result);

      if (this._queue.size()) {
        this._next();
      }
    }

    return complete;
  }

  _next() {
    const runTask = this._queue.dequeue();
    runTask();
  }
}