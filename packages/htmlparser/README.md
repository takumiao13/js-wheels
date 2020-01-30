HTMLParser
==========

A simple HTML Parser

## Examples
```js
var HTMLParser = require('./index');
var results = '';

var parser = new HTMLParser({
  onStart: function(tag, attrs) {
    results += '<' + tag;
 
    for ( var i = 0; i < attrs.length; i++ )
      results += ' ' + attrs[i].name + '="' + attrs[i].value + '"';
 
    results += '>';
  },
  onEnd: function(tag) {
    results += '</' + tag + '>';
  },
  onText: function(text) {
    results += text;
  },
  onComment: function(text) {
    results += '<!--' + text + '-->';
  }
});

parser.parse('<div class="foo"><p id="p" data-foo="2">adfadf</p></div>');

console.log(results); 
// => <div class="foo"><p id="p" data-foo="2">adfadf</p></div>
```

## API
```js
interface Attr {
  name: string;
  value: string;
}

interface DOMHandler {
  onStart: (tag: string, attrs: Attr[]) => void;
  onEnd: (tag: string) => void;
  onText: (text: string) => void;
  onComment: (comment: string) => void;
}

new HTMLParser(handler: DOMHandler)

HTMLParser#parse(html: string): void
```

## Reference
- [simplehtmlparser](http://erik.eae.net/simplehtmlparser/simplehtmlparser.js)
- [htmlparser](https://johnresig.com/blog/pure-javascript-html-parser/)