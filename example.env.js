'use strict';
/* The following is an example of usage of env.js. */

// some configuration.
env db_backend = 'db://backend';
env lang = 'en_US';

var main = function () {
  fetchFromBackend(env db_backend, function (data) {
    console.log(data);
  });
};

// (this is in another module. No problem!)
var fetchFromBackend = function (callback) {
  callback({
    backend: db_backend,
    data: { 'this is': 'the payload' }
  })
};

var theProgram = function () {
  if (something) {
    main();
  } else if (somethingelse) {
    env db_backend = 'somethingelse'; // this does not affect anything above this stack.
    main();
  } else {
    ['file1', 'couch', 'whatever'].forEach(function (file) {
      env db_backend = file;
      main();
    });
  }
};

/* vim: set sw=2 sts=2 et: */
