(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    const asap = factory(root);
    module.exports = asap;
    module.exports.default = asap; // es6 umd support
  } else {
    root.asap = factory();
  }
}(this, function() {
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
  
  if (typeof Promise !== 'undefined') {
    requestFlush = usePromise();
  } else if (typeof MutationObserver !== 'undefined') {
    requestFlush = useMutationObserver();
  } else if (
    typeof process !== 'undefined' && 
    Object.prototype.toString.call(process) === '[object process]'
  ) {
    requestFlush = useNextTick();
  } {
    requestFlush = useSetTimeout();
  }
  
  function usePromise() {
    const p = Promise.resolve();
    return function() {
      p.then(flush);
    }
  }
  
  function useMutationObserver() {
    let counter = 1;
    const observer = new MutationObserver(flush);
    const textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
  
    return function() {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
      console.log('mutation')
    }
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

  return asap;
}));