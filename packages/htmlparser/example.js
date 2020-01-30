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