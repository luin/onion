var Response = require('./response');
var Request = require('./request');
var Router = require('./router');
var utils = require('./components/utils');

var Application = module.exports = function(container, options) {
  this.container = container;
  this.stack = [];
  this.options = options || {};
};

Application.prototype.route = function(url) {
  var middlewares = [].slice.call(arguments, 1);

  var router = new Router(url, utils.flatten(middlewares), this);
  this.stack.push(router);

  return router;
};

Application.prototype.run = function() {
  if (this.container.jquery) {
    this.container = this.container[0];
  } else if (typeof this.container === 'string') {
    this.container = document.querySelector(this.container);
  }

  if (window.addEventListener) {
    window.addEventListener('hashchange', this.dispatch.bind(this), false);
  } else {
    window.attachEvent('onhashchange', this.dispatch.bind(this));
  }

  this.dispatch();
};

Application.prototype.dispatch = function() {
  var req = new Request();

  var router;
  for (var i = 0; i < this.stack.length; ++i) {
    if (this.stack[i].test(req.url)) {
      router = this.stack[i];
      break;
    }
  }

  if (!router) {
    return;
  }

  var res = new Response(this);

  var index = 0;
  function handleMiddleware() {
    var middleware = router.middlewares[index++];
    middleware.call(res.locals, {}, res, function() {
      if (index < router.middlewares.length) {
        handleMiddleware();
      }
    });
  }
  handleMiddleware();
};
