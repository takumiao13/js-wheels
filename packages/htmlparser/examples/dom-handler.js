var util = require('util');
var { HTMLParser, DOMHandler } = require('../src');

var domHandler = new DOMHandler(function(err, dom) {
  console.log(util.inspect(dom, Infinity));
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