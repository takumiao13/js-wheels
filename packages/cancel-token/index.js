function CancelToken(executor) {
  let token = this;
  let _resolvePromise;

  token.promise = new Promise((resolve) => {
    _resolvePromise = resolve;
  });

  executor((message) => {
    const cancel = {
      message,
      __CANCEL__: true
    };
    token.reason = cancel; 
    _resolvePromise(token.reason);
  });
}

CancelToken.source = function() {
  let cancel;
  // get cancel method synchronously
  const token = new CancelToken(c => cancel = c);
  return { token, cancel }
}

module.exports = CancelToken;