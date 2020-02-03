(function(root) {

function parse(str) {
  var params = {};
  
  if (!str) {
    return params
  }

  var pairs = str.split('&');
  var i, l = pairs.length;

  for (i = 0; i < l; i++) {
    var pair = pairs[i].split('=');
    var key = unescape(pair[0]);
    var value = pair.length == 1 ? '' : unescape(pair[1]);
    
    if (key in params) {
      if (!Array.isArray(params[key])) {
        params[key] = [params[key]];
      }
      params[key].push(value);
    } else {
      params[key] = value;
    }
  }
  
  return params;
}

function stringify(obj, sep, eq) {
  sep = sep || '&';
  eq = eq || '=';
  
  var pairs = [];
  for (var key in obj) {
    var pair = escape(key) + eq + escape(obj[key]);
    pairs.push(pair);
  }

  return pairs.join(sep);
}

function escape(str) {
  return encodeURIComponent(str);
}

function unescape(str) {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    return str;
  }
}

root.querystring = {
  parse: parse,
  stringify: stringify,
  escape: escape,
  unescape: unescape
}

}(window));