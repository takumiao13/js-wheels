module.exports = function cssText(style) {
  return Object.keys(style).reduce((cssText, prop) => {
    return cssText += (prop + ':' + style[prop] + ';'); 
  }, '');
}