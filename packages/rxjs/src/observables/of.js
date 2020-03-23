const { fromArray } = require('./fromArray');

exports.of = (...args) => fromArray(args)
