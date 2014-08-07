var Binding = require('./binding');
var utils = require('./components/utils');

var Response = module.exports = function(app) {
  this.app = app;
  this.locals = {};
};

Response.prototype.render = function(url) {
  var args = [].slice.call(arguments, 1);
  var self = this;
  jQuery.get(url, function(html) {
    self.renderHTML.apply(self, [html].concat(args));
  });
};

Response.prototype.renderHTML = function(html, options, callback) {
  this.app.container.innerHTML = html;

  if (typeof options === 'function') {
    callback = options;
    options = null;
  }

  new Binding(this.app.container, this.locals, utils.extend(this.app.options.binding, options));

  this.bind(this.app.container);

  if (callback) {
    callback(html);
  }
};

Response.prototype.bind = function(rootElement) {
  var self = this;
  rootElement.onclick = function(event) {
    if (event.ctrlKey || event.metaKey || event.which == 2) {
      return;
    }

    var elm = event.target;
    while (elm.nodeName.toLowerCase() !== 'a') {
      if (elm === rootElement || !(elm = elm.parentNode)[0]) {
        return;
      }
    }

    var href = elm.getAttribute('href') || elm.getAttribute('xlink:href');
    if (!href) {
      return;
    }

    if (href[0] === '#') {
      href = href.slice(1);
    }

    self.navigate(href);

    event.preventDefault();
  };
};

Response.prototype.navigate = function(path) {
  window.location.hash = path;
  this.app.dispatch();
};
