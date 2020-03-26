const { isObject, parsePath } = require('./utils');
const { Dep } = require('./Dep');
const { traverse } = require('./traverse');
const asap = require('../../asap');

let uid = 0;

function Watcher(ctx, expOrFn, cb, options) {
  options || (options = {});
  this.deep = !!options.deep;
  this.sync = !!options.sync;
  this.lazy = !!options.lazy;

  this.ctx = ctx;
  this.cb = cb;
  this.id = ++uid;
  this.dirty = this.lazy;
  this.deps = [];
  this.newDeps = [];
  this.depIds = new Set()
  this.newDepIds = new Set();

  this.expr = expOrFn.toString();
  this.getter = typeof expOrFn === 'function' ?
    expOrFn :
    parsePath(expOrFn);

  // get first value if not lazy
  // lazy is for computed watcher
  this.value = this.lazy
      ? undefined
      : this.get()
}

Object.assign(Watcher.prototype, {
  get() {
    Dep.pushTarget(this);
    // now Dep.target is the current `watcher`
    // `this.getter` will invoke the getter in `Observer.defineProperty`

    const value = this.getter.call(this.ctx, this.ctx);

    // touch every key in value
    if (this.deep) traverse(value)
  
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
    if (this.lazy) {
      // if watcher is lazy not call `run`
      // just make it dirty
      // watcher will call `evaluate` get last value;
      this.dirty = true;
    } else if (this.sync) {
      this.run()
    } else {
      // push callback to asap queue
      // batch update in next microtask
      watcherQueue.push(this)
    }
  },

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  evaluate () {
    this.value = this.get();
    // when dirty is false will use cache value
    // not get value again
    this.dirty = false;
  },

  /**
   * Invoke callback with the new value
   */
  run() {
    const value = this.get();
    // check value is difference
    // or value is deep watching
    if (value !== this.value || (this.deep && isObject(value))) {
      const oldValue = this.value; // cache old value
      this.value = value; // set new value
      // invoke callback
      this.cb.call(this.ctx, value, oldValue);
    }
  },

  /**
   * Depend on all deps collected by this watcher.
   */
  depend () {
    let i = this.deps.length
    while(i--) {
      this.deps[i].depend()
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