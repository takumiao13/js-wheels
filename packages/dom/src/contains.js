module.exports = function contains(parent, child) {
  return parent !== child && parent.contains(child);
}