const queue = [];
let index = 0;
let flushing = false;

function asap(task) {
  if (!queue.length) {
    requestFlush();
    flushing = true;
  }

  // enqueue
  queue[queue.length] = task;
}

function flush() {
  while (index < queue.length) {
    const task = queue[index++];
    task();
  }

  // clean queue
  index = 0;
  queue.length = 0;
  flushing = false;
}

if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
  requestFlush = useNextTick();
} {
  requestFlush = useSetTimeout();
}

function useNextTick() {
  return function() {
    process.nextTick(flush);
  }
}

function useSetTimeout() {
  return function() {
    setTimeout(flush);
  }
}