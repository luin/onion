var Observer = require('../src/observer');
var test = require('tape');

test('simple comparisons', function (t) {
  t.plan(1);
  t.equal(typeof Object.defineProperty, 'function');
});
