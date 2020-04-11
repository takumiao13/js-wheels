
var ElementTypes = {
  TEXT: 'text',
  COMMENT: 'comment',
  SCRIPT: 'script',
  STYLE: 'style',
  TAG: 'tag'
};

var Node = function Node() {
  this.parent = null;
  this.prev = null;
  this.next = null; 
}

Object.defineProperty(Node, 'parentNode', {
  get: function() {
    return this.parent || null;
  },

  set: function(parent) {
    this.parent = parent;
  }
});

Object.defineProperty(Node, 'previousSibling', {
  get: function() {
    return this.prev || null;
  },
  set: function(prev) {
    this.prev = prev;
  }
});

Object.defineProperty(Node, 'nextSibling', {
  get: function() {
    return this.next || null;
  },
  set: function(next) {
    this.next = next;
  }
});

var DataNode = function DataNode(type, data) {
  Node.call(this);
  this.type = type;
  this.data = data;
};

DataNode.prototype = Object.create(Node.prototype);

DataNode.prototype.constructor = DataNode;

Object.defineProperty(DataNode, 'nodeValue', {
  get: function() {
    return this.data;
  }
})



var Element = function Element(tag, attrs) {
  Node.call(this);
  this.children = [];
  this.attrs = attrs;
  this.tag = tag;
  this.type = ElementTypes.TAG;
}

Element.prototype = Object.create(Node.prototype);

Element.prototype.constructor = Element;

Object.defineProperty(Element, 'childNodes', {
  get: function() {
    return this.children;
  },
  set: function(children) {
    this.children = children;
  }
});

Object.defineProperty(Element, 'firstChild', {
  get: function() {
    return this.children[0] || null;
  }
});

Object.defineProperty(Element, 'lastChild', {
  get: function() {
    return this.children[this.children.length-1] || null;
  }
});

Object.defineProperty(Element, 'tagName', {
  get: function() {
    return this.tag;
  }
});

module.exports = {
  Node,
  DataNode,
  Element,
  ElementTypes
}