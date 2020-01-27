vdom
====

A simple virtual DOM implementation

## API
```js
interface Vnode {
  name: string,
  props: Object,
  node: Element,
  children: Array<Vnode>,
  key: string|number,
  type: TEXT_NODE|void
}

// create vnode
h(
  name: string, 
  props: Object, 
  textOrCh: Array<Vnode>|string|number
);

// mount, remove and update vnode
patch(oldVnode: Vnode|Element, newVnode: Vnode|null);
```

## Examples
```js
const { h, patch } = require('./vdom');
let vnode;
let nextKey = 2;
let data = [
  { key: 0, text: 'item-0' },
  { key: 1, text: 'item-1' }  
];

const appView = ({ children }) => h('app', {}, [
  h('h1', {}, 'App'),
  ...children,
  h('hr'),
  h('button', {
    type: 'button',
    onClick: addItem
  }, 'add'),
  h('button', {
    type: 'button',
    onClick: reverseList
  }, 'reverse'),
  h('button', {
    type: 'button',
    onClick: clearList
  }, 'clear')
]);

const listView = ({ list }) => h('ul', {}, 
  list.map(item => h('li', { key: item.key }, item.text))
);

const render = (container) => {
  vnode = patch(vnode || container, appView({
    children: [ listView({ list: data }) ]
  }))
}

render(document.getElementById('app'));

function addItem() {
  data = data.concat({ key: nextKey, text: `item-${nextKey}` });
  nextKey++;
  render();
}

function reverseList() {
  data = [].slice.call(data).reverse();
  render();
}

function clearList() {
  data.length = 0;
  render();
}
```

## Reference
- [snabbdom/snabbdom](https://github.com/snabbdom/snabbdom) - A virtual DOM library with focus on simplicity, modularity, powerful features and performance.
- [jorgebucaran/hyperapp](https://github.com/jorgebucaran/hyperapp) - The tiny framework for building web interfaces.