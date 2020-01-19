function run(gen) {
  const ctx = this;
  const args = [].slice.call(arguments, 1);
  const g = gen.apply(ctx, args);

  return new Promise(function(resolve, reject) {
    function next(data) {
      const result = g.next(data);
      if (result.done) {
        resolve(result.value);
      } else {
        // convert result value to promise
        toPromise(result.value).then(next);
      }
    }

    next();
  });
}

function toPromise(val) {
  // handle parallel
  if (Object.prototype.toString.call(val) === '[object Array]') {
    return Promise.all(val);
  
  // convert any value to promise
  } else {
    return Promise.resolve(val);
  }
}

module.exports = run;