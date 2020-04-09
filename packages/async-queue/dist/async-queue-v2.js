(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.AsyncQueue = {}));
}(this, function (exports) { 'use strict';

  class Queue {
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

  const defaults = {
    concurrency: Infinity,
    autoStart: true
  };
  class AsyncQueue {
    constructor(options) {
      const o = this.options = Object.assign({}, defaults, options);
      this._handlingCount = 0; // to control concurrency

      this._pendingCount = 0; // count pending promise task

      this._queue = new Queue(); // store wrapped task

      this._concurrency = o.concurrency;
      this._paused = !o.autoStart;
    }

    add(task) {
      return new Promise((resolve, reject) => {
        // build task and enqueue
        const runTask = this._buildTask(task, resolve, reject);

        this._queue.enqueue(runTask); // when no-paused and count is less then concurrency
        // call next to invoke task


        if (!this._paused && this._handlingCount < this._concurrency) {
          this._next();
        }
      });
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
      };

      return runTask;
    }

    _taskComplete(settle) {
      const complete = result => {
        this._pendingCount--;
        this._handlingCount--;
        settle(result);

        if (this._queue.size()) {
          this._next();
        }
      };

      return complete;
    }

    _next() {
      const runTask = this._queue.dequeue();

      this._handlingCount++;
      runTask();
    }

    start() {
      // when started skip
      if (!this._paused) return;
      this._paused = false;

      while (this._handlingCount < this._concurrency) {
        this._next();
      }
    }

    size() {
      return this._queue.size();
    }

  }

  exports.AsyncQueue = AsyncQueue;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
