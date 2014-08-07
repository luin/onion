var utils = require('../components/utils');

var Binding = module.exports = function(view, element, type, keypath, options) {
  this.view = view;
  this.element = element;
  this.type = type;
  this.keypath = keypath;
  this.options = utils.extend({
    formatters: []
  }, options);
  this.dependencies = [];
};

Binding.prototype.formattedValue = function(value) {
  for (var i = 0; i < this.formatters.length; ++i) {
    var formatter = this.formatters[i];
    var args = formatter.split(/\s+/);
    var id = args.shift();
    formatter = this.view.formatters[id];

    if (formatter && formatter.read instanceof Function) {
      value = formatter.read.apply(formatter, [value].concat(args));
    } else if (formatter instanceof Function) {
      value = formatter.apply(null, [value].concat(args));
    }
  }
  return value;
};

Binding.prototype.eventHandler = function(fn) {
  var handler = this;
  return function(ev) {
    // TODO ??
    handler.call(fn, this, ev, binding);
  };
};

Binding.prototype.set = function(value) {
  if (!this.binder.routine) {
    return;
  }
  if (value instanceof Function && !this.binder.function) {
    this.binder.routine.call(this, this.element, this.formattedValue(value.call(this.model)));
  } else {
    this.binder.routine.call(this, this.element, this.formattedValue(value));
  }
};

Binding.prototype.sync = function() {
  if (this.model !== this.observer.target) {
    for (var i = 0; i < this.dependencies.length; ++i) {
      this.dependencies[i].unobserve();
    }
    this.dependencies = [];

    this.model = this.observer.target;
    if (utils.isset(this.mode) && this.options.dependencies && this.options.dependencies.length) {
      for (var j = 0; j < this.options.dependencies; ++j) {
        var observer = new Observer(this.view, this.model, this.options.dependencies[j], this.sync);
        this.dependencies.push(observer);
      }
    }
  }
  this.set(this.observer.value());
};

Binding.prototype.publish = function() {
  var value = utils.getInputValue(this.el);

  var formatters = this.formatters.slice(0).reverse();

  for (var i = 0; i < formatters.length; ++i) {
    var formatter = formatters[i];
    var args = formatter.split(/\s+/);
    var id = args.shift();

    var found = this.view.formatters[id];
    if (found && found.publish) {
      value = found.publish.apply(found, [value].concat(args));
    }
  }

  this.observer.publish(value);
};

Binding.prototype.bind = function() {
  if (this.binder.bind) {
    this.binder.bind.call(this, this.element);
  }
  this.observer = new Observer(this.view, this.view.models, this.keypath, this.sync);
  this.model = this.observer.target;

  if (this.model && this.options.dependencies && this.options.dependencies.length) {
    for (var i = 0; i < this.options.dependencies.length; ++i) {
      var observer = new Observer(this.view, this.model, this.options.dependencies[i], this.sync);
      this.dependencies.push(observer);
    }
  }
  if (this.view.config.preloadData) {
    this.sync();
  }
};

Binding.prototype.unbind = function() {
  if (this.binder.unbind) {
    this.binder.unbind.call(this, this.element);
  }
  this.observer.unobserve();
  for (var i = 0; i < this.dependencies.length; ++i) {
    this.dependencies[i].unobserve();
  }
  this.dependencies = [];
};

Binding.prototype.update = function(models) {
  this.model = this.observer.target;
  this.unbind();
  if (this.binder.update) {
    this.binder.update.call(this, models || {});
  }
  this.bind();
};

Binding.text = utils.inherit(Binding, require('./text'));
