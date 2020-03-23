exports.isPromise = (val) => {
  return !!val && typeof val === 'object' && typeof val.then === 'function'
}