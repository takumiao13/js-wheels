Storage
=======
A better `localStorage`.

## Features
- Support value expires.
- Support scope storage.
- Support set Object value.

## Examples
```js
var storage = Storage({ prefix: 'app' });
storage.set('string', 'foo', 1);
storage.set('number', 13);
storage.set('boolean', true);
storage.set('object', { name: 'taku', age: 13 });
storage.set('array', [1,2,3,4]);
storage.set('date', new Date);

storage.keys(); //=> ["string", "number", "boolean", "object", "array", "date"]
storage.size(); //=> 6
storage.has('array'); //=> true

storage.get('number'); //=> 13
storage.get('boolean'); //=> true
storage.get('object'); //=> { name: "taku", age: 13 }
storage.get('array'); //=> [1, 2, 3, 4]

setTimeout(_ => {
  storage.get('string'); //=> null (value is expired)

  storage.remove('number');
  storage.remove('boolean');
  storage.keys(); //=> ["object", "array", "date"]
  
  storage.clear();
  storage.keys(); //=> []
}, 1000);
```

## API
```js
interface StorageOptions {
  prefix?: string = '';
}

interface IStorage {
  set: (key: string, value: any, maxAge: number): boolean;
  get: (key: string): any|null;
  has: (key: string): boolean;
  remove: (key: string): boolean;
  clear: (): void;
  keys: (): string[];
  size: (): number;
}

Storage(StorageOptions): IStorage;
```