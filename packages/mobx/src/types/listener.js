import { once } from '../utils/utils';

// Listeners interface
export function hasListeners(listenable) {
  return listenable.changeListeners &&
    listenable.changeListeners.length > 0
}

export function registerListener(listenable, handler) {
  const listeners = listenable.changeListeners;
  listeners.push(handler);

  return once(() => {
    unregisterListener(listenable, handler);
  });
}

function unregisterListener(listenable, handler) {
  const listeners = listenable.changeListeners;
  const idx = listeners.indexOf(handler);
  if (idx > -1) listeners.splice(idx, 1);
}

export function notifyListeners(listenable, change) {
  let listeners = listenable.changeListeners;
  if (!listeners) return;
  listeners = listeners.slice();
  let i, len = listeners.length;
  for (i = 0; i < len; i++) {
    listeners[i](change)
  }
}