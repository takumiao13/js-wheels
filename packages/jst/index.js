var jst = function() {
  var source = '',
      prepended = 'var __r = [], __append = __r.push.bind(__r);' + '\n',
      appended = 'return __r.join("");' + '\n';

  function parse(tpl) {
    var reg = /<%[^%>]+?%>/g
    var matches = [];
    var cursor = 0;
    var result = null;

    while (result = reg.exec(tpl)) {
      matches.push(tpl.slice(cursor, result.index));
      matches.push(result[0]);
      cursor = result[0].length + result.index;
    }

    matches.push(tpl.slice(cursor));
    return matches;
  }

  function scanLine(line) {
    var start = line.indexOf('<%'),
        end = line.indexOf('%>');

    if (start > -1 && end > -1) {
      
      line = line.slice(start+2, end);
      switch (line[0]) {
        case '=':
          line = line.replace(/^=/, '');
          source += '__append(' + line + ');\n';
          break;
        default:
          source += line + '\n'
          break;
      }
    } else {
      source += '__append("' + line + '");';
    }
  }
 
  function compile(tpl) {
    var matches = [];
    source = '';
    tpl = tpl.replace(/[\r\n\t]/g, '');
    matches = parse(tpl);
    matches.forEach(scanLine);
    source = prepended + source + appended;
    return new Function('data', source);
  }

  function render(tpl, data) {
    var fn = compile(tpl);
    return fn.call(this, data);
  }

  return {
    compile: compile,
    render: render
  }
}();