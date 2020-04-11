var { HTMLParser } = require('../src');

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
    console.log('--->', text)
    results += text;
  },
  onComment: function(text) {
    results += '<!--' + text + '-->';
  },
  onEnd: function() {
    console.log(results);
  }
});

parser.parse(`
  <div class="foo">
    <p id="p" data-foo="2">adfadf</p>
  </div>
`);