var pathToRegexp = require('path-to-regexp');
var utils = require('./components/utils');

var Router = module.exports = function(url, middlewares, app) {
  this.url = url;

  var keys = [];
  this.urlRegexp = pathToRegexp(url, keys);
  this.middlewares = middlewares;
  this.app = app;
};

Router.prototype.test = function(url) {
  return this.urlRegexp.test(url);
};
