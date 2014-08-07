var utils = require('../components/utils');
var binders = require('./binders');

var Index = module.exports = function(dom, model, options) {
  this.dom = dom;
  this.model = model;
  this.options = utils.extend({
    prefix: 'nu',
    templateDelimiters: ['{{', '}}'],
    rootInterface: '.',
    preloadData: true
  }, options);
  this.binders = utils.extend(binders, options.binders);
  this.build();
};

Index.Parser = require('./parsers');

Index.prototype.build = function() {
  var options = this.options;
  var bindings = this.bindings = [];

  var buildBinding = function(binding, node, type, declaration) {
    var options = {};
    var pipes = declaration.split('|');
    var i;
    for (i = 0; i < pipes.length; ++i) {
      pipes[i] = pipes[i].trim();
    }
    var context = pipes.shift().split('<');
    for (i = 0; i < context.length; ++i) {
      context[i] = context[i].trim();
    }
    var keypath = context.shift();

    options.formatters = pipes;

    var dependencies = context.shift();
    if (dependencies) {
      options.dependencies = dependencies.split(/\s+/);
    }
    bindings.push(new s(this, node, type, keypath, options));
  };

  var parse = function(node) {
    var i;

    if (parse.skipNodes.indexOf(node) >= 0) {
      return;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      var tokens = Index.Parser.TextParser.parse(node.data, options.templateDelimiters);
      if (tokens.length) {
        if (tokens.length !== 1 || tokens[0].type !== Index.Parser.TextParser.Types.TEXT) {
          for (i = 0; i < tokens.length; ++i) {
            text = document.createTextNode(tokens[i].value);
            node.parentNode.insertBefore(text, node);

            if (tokens[i].type === Index.Parser.TextParser.Types.BINDING) {
              // buildBinding('TextBinding', text, null, tokens[i].value);
            }
          }
          node.parentNode.removeChild(node);
        }
      }
    }

    for (i = 0; i < node.childNodes.length; ++i) {
      parse(node.childNodes[i]);
    }
  };

  parse.skipNodes = [];

  parse(this.dom);
};
