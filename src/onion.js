window.rivets = require('../vendors/rivets');
window.jQuery = require('../vendors/jquery');

var Application = require('./application');
var ready = require('./components/ready');

var Onion = window.onion = function() {
  var args = arguments;
  function F() {
    return Application.apply(this, args);
  }
  F.prototype = Application.prototype;
  var app = new F();

  var originRun = app.run;
  app.run = function() {
    ready(function() {
      originRun.call(app);
    });
  };

  return app;
};
