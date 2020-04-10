import { Queue } from './queue';

const noop = () => {}

export const Schedulers = {
  QUEUE: Symbol('queue'),
  ASYNC: Symbol('async')
}

const defaults = {
  concurrency: Infinity,
  autoStart: true,
  scheduler: Schedulers.ASYNC,
  onEmpty: noop,
  onCompleted: noop
};

export class AsyncQueue {
  constructor(options) {
    const o = this.options = Object.assign({}, defaults, options);
    this._pendingCount = 0; // to control concurrency
    this._queue = new Queue(); // store wrapped task
    this._paused = !o.autoStart;

    this._concurrency = o.concurrency;
    this._onEmpty = o.onEmpty;
    this._onCompleted = o.onCompleted;
    this._scheduler = o.scheduler;
  }

  add(task) {
    return new Promise((resolve, reject) => {
      // build task and enqueue
      const runTask = this._buildTask(task, resolve, reject);
      this._queue.enqueue(runTask)

      // when no-paused and count is less then concurrency
      // call next to invoke task
      if (!this._paused && this._pendingCount < this._concurrency) {
        this._next();
      }
    })
  }

  _buildTask(task, resolve, reject) {
    const runTask = () => {
      this._pendingCount++; // increase pending count

      if (!this._queue.size()) {
        this._onEmpty();
      }

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
      // fulfill or reject the promise that add method return
      settle(result);

      // when queue is not empty
      // run task in next macro task 
      if (this._queue.size()) {
        if (this._scheduler === Schedulers.ASYNC) {
          setTimeout(_ => this._next());
        } else {
          this._next();
        }
      // emit `onCompleted` when all task has done
      } else {
        if (this._scheduler === Schedulers.ASYNC) {
          setTimeout(_ => this._onCompleted());
        } else {
          this._onCompleted();
        }
      }
    }

    return complete;
  }

  _next() {
    // check queue is paused
    if (this._paused) return;
    
    // dequeue task and run it
    const runTask = this._queue.dequeue();
    runTask();
  }

  start() {
    // when started skip
    if (!this._paused) return;
    this._paused = false;

    while(this._pendingCount < this._concurrency) {
      this._next();
    }
  }

  pause() {
    this._paused = true;
  }

  size() {
    return this._queue.size();
  }
}