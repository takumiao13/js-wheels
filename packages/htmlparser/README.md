HTMLParser
==========

A simple HTML Parser

## Examples
simple parse
```js
var { HTMLParser } = require('./src');
var results = '';

var parser = new HTMLParser({
  onStartTag: function(tag, attrs) {
    results += '<' + tag;
 
    for ( var i = 0; i < attrs.length; i++ )
      results += ' ' + attrs[i].name + '="' + attrs[i].value + '"';
 
    results += '>';
  },
  onEndTag: function(tag) {
    results += '</' + tag + '>';
  },
  onText: function(text) {
    results += text;
  },
  onComment: function(text) {
    results += '<!--' + text + '-->';
  },
  onEnd: function() {
    console.log(results); 
  }
});

parser.parse('<div class="foo"><p id="p" data-foo="2">adfadf</p></div>');
// => <div class="foo"><p id="p" data-foo="2">adfadf</p></div>
```


with dom handler
```js
var util = require('util');
var { HTMLParser, DOMHandler } = require('../src');

var domHandler = new DOMHandler(function(err, dom) {
  console.log(dom);
})

var parser = new HTMLParser(domHandler);
parser.parse(`
  <div class="foo">
    <p id="p" data-foo="2">adfadf</p>
    <!-- comment text -->
    <ul>
      <li>item-1</li>
      <li class="active">
        item-2
      </li>
      <li>item-3</li>
      <li>item-4</li>
    </ul>
  </div>
`);
```

output
```js
[
  {
    tag: 'div',
    type: 'tag',
    attrs: [
      { class: 'foo' }
    ],
    children: [
      {
        tag: 'p',
        type: 'tag',
        attrs: [
          { id: 'p' },
          { 'data-foo': '2' }
        ],
        children: [
          {
            type: 'text',
            data: adfadf
          }
        ]
      },
      {
        type: 'comment',
        data: 'comment text'
      },
      {
        tag: 'ul',
        type: 'tag',
        children: [
          {
            tag: 'li',
            type: 'tag',
            children: [
              {
                type: 'text',
                data: 'item-1'
              }
            ]
          },
          ...
        ]
      }
    ]
  }
]
```

## API
```js
interface Attr {
  name: string;
  value: string;
}

interface DOMHandler {
  onStartTag: (tag: string, attrs: Attr[]) => void;
  onEndTag: (tag: string) => void;
  onText: (text: string) => void;
  onComment: (comment: string) => void;
  onEnd: () => void;
}

new HTMLParser(handler: DOMHandler)

HTMLParser#parse(html: string): void
```

## Reference
- [simplehtmlparser](http://erik.eae.net/simplehtmlparser/simplehtmlparser.js)
- [htmlparser](https://johnresig.com/blog/pure-javascript-html-parser/)
- [fb55/htmlparser2](https://github.com/fb55/htmlparser2) - Forgiving html and xml parser.
- [fb55/domhandler](https://github.com/fb55/domhandler) - htmlparser2's dom as a separate module.