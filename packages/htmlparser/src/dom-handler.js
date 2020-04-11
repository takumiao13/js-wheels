
var { DataNode, Element, ElementTypes } = require('./node');

var DOMHandler = function DOMHandler(callback, options) {
  this.dom = [];
  this._tagStack = [];
  this._callback = callback;
  this._done = false; // has parse done
  this.options = Object.assign({
    stripWhitespace: true
  }, options || {})
};

module.exports = DOMHandler;

DOMHandler.prototype.onStartTag = function(tag, attrs) {
  // create node by tag and attrs
  var elem = new Element(tag, attrs);
  // add elem to `dom`
  this._addNode(elem);
  // push elem to stack, if has child node
  // we can get parent by the peek of `_tagStack`
  this._tagStack.push(elem);
};

DOMHandler.prototype.onEndTag = function(tag) {
  // just pop from stack
  // nothing should parse continue (DFS)
  // <a>
  //  <b>
  //   <c></c> <-- end
  //  <b>
  // </a>
  var elem = this._tagStack.pop();
  if (!elem) {
    return
  }
};

DOMHandler.prototype.onText = function(text) {
  if (/^\s+$/.test(text) && this.options.stripWhitespace) {
    return;
  }

  text = text.replace(/^\s+|\s+$/g, '');
  var node = new DataNode(ElementTypes.TEXT, text);
  this._addNode(node);
};

DOMHandler.prototype.onComment = function(comment) {
  var node = new DataNode(ElementTypes.COMMENT, comment);
  this._addNode(node);
};

DOMHandler.prototype.onEnd = function() {
  // parse end and invoke callback with the result
  if (typeof this._callback === 'function') {
    this._done = true;
    this._callback(null, this.dom);
  }
}

DOMHandler.prototype._addNode = function(node) {
  // get node parent by tagStack
  var parent = this._tagStack[this._tagStack.length - 1];
  // get siblings and prev node
  var siblings = parent ? parent.children : this.dom;
  var previousSibling = siblings[siblings.length - 1];

  // add node to dom
  siblings.push(node);

  // ensure prev
  if (previousSibling) {
    node.prev = previousSibling;
    previousSibling.next = node;
  }

  // ensure parent
  if (parent) {
    node.parent = parent;
  }
};