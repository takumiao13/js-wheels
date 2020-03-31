var namedParam = /:\w+/g;
var splatParam = /\*\w+/g;

function pathToRegExp(path) {
  path = path
    .replace(namedParam, '([^/]+)')
    .replace(splatParam, '(.*?)');

  return new RegExp('^' + path + '$');
}

function extractParams(path, fragment) {
  var params = path.exec(fragment).slice(1);
  return params;
}

module.exports = {
  pathToRegExp,
  extractParams
}