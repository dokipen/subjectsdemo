var debug = require('debug')('subject-server');

exports = module.exports = function(app) {
  return function(req, res, next) {
    req.headers['accept'] = 'application/json'
    next() } }
