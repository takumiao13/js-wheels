
export function once(func) {
  let called = false;
  return function() {
      if (called) {
        return
      }
      called = true;
      return func.apply(this, arguments);
  }
}

export const noop = () => {}