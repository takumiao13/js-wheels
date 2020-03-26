const { parsePath } = require('./utils');
const { Dep } = require('./Dep');
const asap = require('../../asap');

let uid = 0;

function Watcher(ctx, expOrFn, cb, options) {
  options || (options = {});

  this.ctx = ctx;
  this.cb = cb;
  this.id = ++uid;
  this.deps = [];
  this.newDeps = [];
  this.depIds = new Set()
  this.newDepIds = new Set();

  this.deep = !!options.deep;
  this.sync = !!options.sync;

  this.getter = typeof expOrFn === 'function' ?
    expOrFn :
    parsePath(expOrFn);

  // get first value;
  this.value = this.get();
}

Object.assign(Watcher.prototype, {
  get() {
    Dep.pushTarget(this);
    // now Dep.target is the current `watcher`
    // `this.getter` will invoke the getter in `Observer.defineProperty`

    const value = this.getter(this.ctx, this.ctx);
    Dep.popTarget();
    this.cleanupDeps()
    return value;
  },

  addDep(dep) {
    const id = dep.id;
    // store dep to set
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep)
      
      // push watcher to dep subs
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  },

  /**
   * Why use cleanDeps ??
   */
  cleanupDeps() {
    let i = this.deps.length;
    while (i--) {
      const dep = this.deps[i];
      // remove no dependency
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }

    let tmp = this.depIds;
    this.depIds = this.newDepIds;
    // clear newDepIds
    this.newDepIds = tmp;
    this.newDepIds.clear();

    tmp = this.deps;
    this.deps = this.newDeps;
    // clear newDeps
    this.newDeps = tmp;
    this.newDeps.length = 0;
  },

  update() {
    if (this.sync) {
      this.run()
    } else {
      // push callback to asap queue
      // batch update in next microtask
      watcherQueue.push(this)
    }
  },

  /**
   * Invoke callback with the new value
   */
  run() {
    const value = this.get();
    if (value !== this.value) {
      const oldValue = this.value; // cache old value
      this.value = value; // set new value
      // invoke callback
      this.cb.call(this.ctx, value, oldValue);
    }
  },

  /**
   * Remove self from deps
   */
  teardown () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].removeSub(this)
    }
  }
});

const watcherQueue = {
  has: {},
  push(watcher) {
    const id = watcher.id;
    if (this.has[id] == null) {
      this.has[id] = true;
      asap(() => {
        this.has[id] = null;
        watcher.run();
      });
    }
  }
};

exports.Watcher = Watcher;