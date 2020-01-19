CancelToken
===========

cancel a promise by `CancelToken`.

## Usage
```js
const CancelToken = require('cancel-token');

let cancel;
const token = new CancelToken(c => cancel = c);

function delay(ms, token) {
  return new Promise((resolve, reject) => {
    const id = setTimeout(resolve, ms);
    token.promise.then(reason => {
      clearTimeout(id) 
      reject(reason)
    });
  });
};

delay(1000, token).then(console.log, console.error);
cancel('Cancelled'); 
// => { message: 'Cancelled', __CANCEL__: true }
```

create token and cancel method by `source` factory
```js
const source = CancelToken.source();
delay(1000, source.token).then(console.log, console.error);
source.cancel();
```

abort XHR
```js
function request(url, token) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);

  return new Promise((resolve, reject) => {
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = reject;

    token.promise.then(reason => {
      xhr.abort();
      reject(reason);
    });
  });
}

const source = CancelToken.source();
request('foo', source.token).catch(ex => {
  if (ex.__CANCEL__) {
    console.log('request is cancelled');
  }
});

document.getElementById('button')
  .addEventListener('click', () => source.cancel('Cancel Request'));
```

## Resources
- [proposal-cancelable-promises](https://github.com/tc39/proposal-cancelable-promises)
- [axois - CancelToken](https://github.com/axios/axios)
- [Promise Cancellation Is Dead — Long Live Promise Cancellation!](https://medium.com/@benlesh/promise-cancellation-is-dead-long-live-promise-cancellation-c6601f1f5082)