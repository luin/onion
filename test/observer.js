var Observer = require('../src/observer');
var test = require('tape');

test('observe object', function (t) {
  t.plan(1);

  var model = {
    a: {
      b: 'name'
    }
  };

  var result = [];
  new Observer(model, ['a.b', 'a.c.d'], function(path) {
    result.push(path);
  });

  model.a.b = 1;
  model.a.b = 2;
  model.a = '4';
  model.a = {
    b: 'c',
    c: {
      d: 123
    }
  };
  model.a.b = 3;
  model.a.c = {};
  model.a.c = {
    d: []
  };
  model.a.c.d.push(12);

  t.same([
    'a.b',
    'a.b',
    'a.b',
    'a.c.d',
    'a.b',
    'a.c.d',
    'a.b',
    'a.c.d',
    'a.c.d',
    'a.c.d'
  ], result);
});
