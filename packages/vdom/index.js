const TEXT_NODE = 'TEXT_NODE';

const h = (name, props = {}, textOrCh) => {
  let type, children;

  // handle text
  if (
    typeof textOrCh === 'string' ||
    typeof textOrCh === 'number'
  ) {
    children = [{
      name: textOrCh,
      type: TEXT_NODE,
      children: []
    }];

  // handle children
  } else {
    children = Array.isArray(textOrCh) ? textOrCh : [];
  }

  return {
    name, props, children, type,
    key: props.key, // key for diff
    node: null // store real dom
  }
}

const createNode = (vnode) => {
  const { type, name, props, children } = vnode;
  const node = type === TEXT_NODE ?
    document.createTextNode(name) :
    document.createElement(name);

  // set attributes to node
  for (const k in props) {
    updateProp(node, k, null, props[k])
  }

  // create child node
  for (let i = 0; i < children.length; i++) {
    const childNode = createNode(children[i]);
    node.appendChild(childNode);
  }

  vnode.node = node;
  return node;
}

const updateProp = (node, key, oldVal, newVal) => {
  // skip `key` key
  if (key === 'key') {
  
  // @todo: handle `style`
  } else if (key === 'style') {

  // handle `onXXX` event
  } else if (key.slice(0, 2) == 'on') {
    const event = key.slice(2).toLowerCase();

    if (oldVal === newVal) return;

    console.log(event);
    if (newVal) {
      node.addEventListener(event, newVal, false);
    } else if (oldVal && newVal == null) {
      node.removeEventListener(event, oldVal, false);
    }
    
  // handle dom built-in prop
  // - input/button `type`
  } else if (key in node) {
    node[key] = newVal == null ? '' : newVal;

  // handle custom attribute
  } else {
    if (newVal == null) {
      node.removeAttribute(key);
    } else {
      node.setAttribute(key, newVal); 
    }
  }
}

const patch = (oldVnode, newVnode) => {

  // mount newVnode to container
  if ('innerHTML' in oldVnode) {
    const container = oldVnode;
    const newNode = createNode(newVnode);
    container.innerHTML = '';
    container.appendChild(newNode);
    return newNode;
  }

  const oldNode = oldVnode.node;
  const parentNode = oldNode.parentNode;
  let newNode = oldNode;

  // skip same node
  if (oldVnode === newVnode) {
   
  // handle remove node
  } else if (newVnode === null) {
    newNode = null;
    parentNode.removeChild(oldNode);

  // handle text change
  } else if (
    oldVnode.type === TEXT_NODE &&
    newVnode.type === TEXT_NODE &&
    oldVnode.name !== newVnode.name
  ) {
    oldVnode.node.textContent = newVnode.name;

  // handle node name is changed, create new node
  } else if (oldVnode.name !== newVnode.name) {
    // change `newNode`
    newNode = createNode(newVnode);

    // update node at same position
    parentNode.insertBefore(newNode, oldNode);
    parentNode.removeChild(oldNode);
    
  // handle update old node
  } else {
    const oldVProps = oldVnode.props;
    const newVProps = newVnode.props;
    const allProps = Object.assign({}, oldVProps, newVProps);
    
    // update props
    for (const k in allProps) {
      if ((oldVProps[k]) !== newVProps[k]) {
        updateProp(oldVnode.node, k, oldVProps[k], newVProps[k]);
      }
    }

    // diff children
    updateChildren(
      oldVnode.node, // parentNode
      oldVnode.children,
      newVnode.children
    );
  }

  if (newNode) {
    newVnode.node = newNode;
  }
  
  return newVnode;
}

const updateChildren = (parentNode, oldCh, newCh) => {
  let oldKey, newKey;
  let oldItem, newItem, tmpItem;
  
  let oldHead = 0;
  let newHead = 0;
  let oldTail = oldCh.length - 1;
  let newTail = newCh.length - 1;

  const oldKeyed = {};
  const newKeyed = {};

  // build oldKeyed
  for (let i = oldHead; i <= oldTail; i++) {
    oldKey = getKey(oldCh[i]);
    if (oldKey != null) {
      oldKeyed[oldKey] = oldCh[i];
    }
  }

  // loop `newCh` to insert and update node
  while (newHead <= newTail) {
    oldItem = oldCh[oldHead];
    newItem = newCh[newHead];

    oldKey = getKey(oldItem);
    newKey = getKey(newItem);

    // skip the oldNode patched
    if (newKeyed[oldKey]) {
      oldHead++;
      continue
    }

    // handle `newItem` without key
    if (newKey == null) {
      if (oldKey == null) {
        patch(oldItem, newItem);
        newHead++;
      }
      oldHead++;

    // handle `newItem` with key
    } else {
      if (oldKey === newKey) {
        patch(oldItem, newItem);
        // record new key has patched
        newKeyed[newKey] = true;
        oldHead++;
      } else {
        // when `oldKeyed` has newKey
        tmpItem = oldKeyed[newKey];
        oldNode = oldItem && oldItem.node;

        if (tmpItem != null) {
          // move `tmpNode` to `oldNode` position and patch it

          parentNode.insertBefore(tmpItem.node, oldNode);
         
          // const snapshot = [].slice.call(parentNode.children).map(child => child.textContent);
          // console.log(snapshot);
          // console.log(oldCh);
          
          patch(tmpItem, newItem);
  
          newKeyed[newKey] = true;
          //console.log('--------------------');
        } else {
          // insert node before oldNode
          const newNode = createNode(newItem);
          parentNode.insertBefore(newNode, oldNode)
        }
      }
      newHead++;
    }
  }

  // remove `oldVnode` without key
  while (oldHead <= oldTail) {
    oldItem = oldCh[oldHead++];
    if (oldItem.key == null) {
      parentNode.removeChild(oldItem.node);
    }
  }

  // remove `oldVnode` not patched
  for (k in oldKeyed) {
    if (newKeyed[k] == null) {
      parentNode.removeChild(oldKeyed[k].node);
    }
  }
}

const getKey = (vnode) => vnode ? vnode.key : null;

window.h = h;
window.patch = patch;