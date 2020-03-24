exports.pipe = (...fns) => {
  if (!fns) return function() {}

  if (fns.length === 1) return fns[0];

  return function piped(input) {
    return fns.reduce((prev, fn) => fn(prev), input);
  }
}
