
import { BrowserHistory } from './BrowserHistory';
import { HashHistory } from './HashHistory';

const createHistory = (options) => {
  const { mode = 'browser', ...opts } = options;
  let history;
  switch (mode) {
    case 'hash':
      history = new HashHistory(opts);
      break;
    case 'browser':
      history = new BrowserHistory(opts);
      break;
  }

  return history;
}

export default createHistory;