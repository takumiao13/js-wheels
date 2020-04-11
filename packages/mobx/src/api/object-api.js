


export function set(obj, key, value) {
  const adm = obj.$mobx;
  const existingObservable = adm.values.get(key);

  // add or update
  if (existingObservable) {
    adm.write(key, value);
  } else {
    adm.addObservableProp(key, value);
  }
}