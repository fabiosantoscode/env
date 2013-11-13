
var main = function () {
  env something = 'something'
  b();
}

var b = function () {
  c();
}

var c = function () {
  console.log(env something);
}

/* vim: set sw=2 sts=2 et: */
