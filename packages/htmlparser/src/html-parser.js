var startTagRE = /^<([A-Za-z0-9_]+)((?:\s+[-A-Za-z_]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
var endTagRE = /^<\/([A-Za-z0-9_]+)[^>]*>/;
var attrRE = /([-A-Za-z0-9_]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

var HTMLParser = function HTMLParser(handler) {
  this.handler = handler || {};
}

module.exports = HTMLParser;

HTMLParser.prototype.parse = function(html) {
  var index;
  var self = this;

  while (html.length) {
    var asChars = true;
 
    // handle comment
    if (html.indexOf('<!--') == 0) {
      var commentEndTag = '-->';
      index = html.indexOf(commentEndTag);

      // match end tag
      if (index >= 0) {
        // extract commnet without start and end tag
        var comment = html.substring(4, index);
        this.parseComment(comment);
        // move point to end of comment
        html = html.substring(index + commentEndTag.length);
        asChars = false;
      }
    
    // handle end tag
    } else if (html.indexOf('</') == 0) {
      var match = html.match(endTagRE);

      if (match) {
        html = html.substring(match[0].length);
        match[0].replace(endTagRE, function(tag, tagName) {
          self.parseEndTag(tagName);
        });
        asChars = false;
      }

    // handle start tag
    } else if (html.indexOf('<') == 0) {
      var match = html.match(startTagRE);

      if (match) {
        html = html.substring(match[0].length);
        match[0].replace(startTagRE, function(tag, tagName, rest) {
          self.parseStartTag(tagName, rest);
        });
        asChars = false;
      }
    }

    // handle text
    if (asChars) {  
      var text;
      index = html.indexOf('<');
      
      // handle has start tag
      if (index >= 0) {
        text = html.substring(0, index); // extract text
        html = html.substring(index);
      } else {
        text = html; // rest is text
        html = ''; // parse end!
      }

      this.parseText(text);
    }
  }

  if (this.handler.onEnd) {
    this.handler.onEnd();
  }
}

HTMLParser.prototype.parseComment = function(comment) {
  if (this.handler.onComment) { 
    this.handler.onComment(comment);
  }
}

HTMLParser.prototype.parseStartTag = function(tagName, rest) {
  if (this.handler.onStartTag) {
    var attrs = this.parseAttrs(tagName, rest);
	  this.handler.onStartTag(tagName, attrs);
  }
}

HTMLParser.prototype.parseAttrs = function(tagName, rest) {
  var self = this;
  var attrs = [];
  rest.replace(attrRE, function() {
    var attr = self.parseAttr.apply(this, arguments);
    attrs.push(attr);
  });
  return attrs;
}

HTMLParser.prototype.parseAttr = function(match, name) {
  var value = arguments[2] || arguments[3] || arguments[4] || '';
  return {
    name: name,
    value: value
  }
}

HTMLParser.prototype.parseEndTag = function(tagName) {
  if (this.handler.onEndTag) {
    this.handler.onEndTag(tagName);
  }
}

HTMLParser.prototype.parseText = function(text) {
  if (this.handler.onText) {
    this.handler.onText(text);
  }
}