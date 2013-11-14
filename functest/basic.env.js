
var ok = require('assert');

module.exports.main = function () {
  env something = 'something'
  b();
}

var b = function () {
  c();
}

var c = function () {
  ok.equal(env something, 'something');
}

/* vim: set sw=2 sts=2 et: */
