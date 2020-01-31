module.exports = function vendorPrefix() {
  var vendor = ['webkit', 'moz', 'ms', 'o'];
  var prop = 'Transform';
  var prefix = '';
  var style = document.createElement('p').style;
  var i = 0;

  while (i < vendor.length) {
    if (typeof style[vendor[i] + prop] === 'string') {
      prefix = vendor[i];
    }

    i++;
  }

  if (prefix === 'webkit' && 'msHyphens' in style) {
    prefix = 'ms';
  }

  return {
    lowercase: prefix,
    css: '-' + prefix + '-',
    js: prefix[0].toUpperCase() + prefix.substr(1)
  };
}