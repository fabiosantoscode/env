
var ok = require('assert');

env foo = 'bar';

module.exports.main = function () {
  env something = 'something'
  b();
}

var b = function () {
  c();
}

var c = function () {
  ok.equal(env something, 'something');
  ok.equal(env foo, 'bar');
}

/* vim: set sw=2 sts=2 et: */
