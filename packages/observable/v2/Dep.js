let uid = 0;

function Dep(key) {
  this.key = key // the key for Dep
  this.id = uid++;
  this.subs = []; // store watchers
}

Object.assign(Dep.prototype, {
  addSub(watcher) {
    this.subs.push(watcher);
  },

  removeSub(watcher) {
    const subs = this.subs;
    const index = subs.indexOf(watcher)
    if (index > -1) {
      return subs.splice(index, 1)
    }
  },

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  },

  notify () {
    const subs = this.subs.slice();
    let i, len = subs.length, watcher;
    for (i = 0; i < len; i++) {
      watcher = subs[i];
      watcher.update()
    }
  }
})

targetStack = [];

Dep.target = null

Dep.pushTarget = function(target) {
  targetStack.push(target)
  Dep.target = target
}

Dep.popTarget = function() {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}

exports.Dep = Dep;