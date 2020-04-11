

function defaultComparer(a, b) {
  return Object.is(a, b);
}

function identityComparer(a, b) {
  return a === b;
}

export const comparer = {
  identity: identityComparer,
  default: defaultComparer
}