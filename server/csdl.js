var _ = require('underscore'),
    settings = require('./settings'),
    request = require('superagent'),
    sprintf = require('sprintf').sprintf;

var CSDL = function(opts) {
  if (!(this instanceof CSDL)) {
    return new CSDL(opts);
  }

  _.defaults(this, opts, {
    username: settings.datasiftUsername,
    apiKey: settings.datasiftKey,
    host: 'http://api.datasift.com',
    validateEndpoint: '/v1/validate',
    compileEndpoint: '/v1/compile'
  });
}

/**
 * compile csdl. See http://dev.datasift.com/docs/rest-api/compile
 * for details. Callback takes (error, res). See
 * https://github.com/visionmedia/superagent for details.
 */
CSDL.prototype.compile = function(src, fn) {
  request
    .post(sprintf("%s%s", this.host, this.compileEndpoint))
    .set('Accept', 'application/json')
    .send({csdl: src, username: this.username, api_key: this.apiKey})
    .timeout(3000)
    .end(fn);
}

/**
 * validate csdl. See http://dev.datasift.com/docs/rest-api/validate
 * for details. Callback takes (error, res). See
 * https://github.com/visionmedia/superagent for details.
 */
CSDL.prototype.validate = function(src, fn) {
  request
    .post(sprintf("%s%s", this.host, this.validateEndpoint))
    .set('Accept', 'application/json')
    .send({csdl: src, username: this.username, api_key: this.apiKey})
    .timeout(3000)
    .end(fn);
}

exports = module.exports = CSDL;
