var OBSERVER_KEY = '__onionobserver__';

var Observer = module.exports = function(model, keypaths, notifier) {
  this.model = model;
  this.keypaths = keypaths;
  this.silent = true;
  this.convertObject(keypaths);
  this.silent = false;
  this.notifier = notifier;
};

Observer.prototype.watchMutation = function(path, array) {
  var self = this;
  [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
  ].forEach(function(method) {
    var originalMethod = array[method];
    if (!Object.getOwnPropertyDescriptor(array, method) ||
        Object.getOwnPropertyDescriptor(array, method).configurable) {
      Object.defineProperty(array, method, {
        value: function() {
          originalMethod.apply(array, arguments);
          self.notifier(path, array);
        }
      });
    }
  });
};

Observer.prototype.convertObject = function(keypaths) {
  var i;
  if (Array.isArray(keypaths)) {
    for (i = 0; i < keypaths.length; ++i) {
      this.convertObject(keypaths[i]);
    }
    return;
  }
  var keys = keypaths.split('.');
  var current = this.model;
  var self = this;
  keys.forEach(function(key, index) {
    if (typeof current !== 'object' || current === null) {
      return;
    }
    var value = current[key];
    var path = keys.slice(0, index + 1).join('.');

    if (!current[OBSERVER_KEY]) {
      Object.defineProperty(current, OBSERVER_KEY, {
        value: {
          owner: [],
          children: []
        }
      });
    }

    if (current[OBSERVER_KEY].owner.indexOf(key) >= 0) {
      if (current[OBSERVER_KEY].children.indexOf(keypaths) < 0) {
        current[OBSERVER_KEY].children.push(keypaths);
      }
    } else {
      current[OBSERVER_KEY].owner.push(key);
      current[OBSERVER_KEY].children.push(keypaths);
      if (self.keypaths.indexOf(path) >= 0 && !self.silent) {
        self.notifier(path, value);
      }
      Object.defineProperty(current, key, {
        enumerable: true,
        get: function() {
          return value;
        },
        set: function(newValue) {
          if (newValue !== value) {
            value = newValue;
            if (self.keypaths.indexOf(path) >= 0) {
              self.notifier(path, newValue);
            }
            if (this[OBSERVER_KEY].children.length) {
              self.convertObject(this[OBSERVER_KEY].children);
            }
          }
        }
      });
    }
    if (Array.isArray(value) && self.keypaths.indexOf(path) >= 0) {
      self.watchMutation(path, value);
    }
    current = value;
  });
};
