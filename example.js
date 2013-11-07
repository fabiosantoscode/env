/* The following is an example of usage of env.js. */

var env = require('./lib/env.js');

/* Take this following simple program, which fetches data from a database backend and prints it. */

// initialize the root environment
var $env = env.create();
// some configuration.
$env.db_backend = 'db://backend';
$env.lang = 'en_US';

var main = env.bindLexical($env, function ($env, db_backend) {
  env.call($env, fetchFromBackend, env.bindLexical($env, function (data) {
    console.log(data);
  }));
});

// now you have this nifty function in another module and want to use the configuration. no problem!
var fetchFromBackend = env.bindLexical($env, function ($env, callback) {
  callback({ backend: $env.db_backend, data: { 'this is': 'the payload' }})
});

// Do you want to call the main function once? use a different backend and call it? call it once for each backend? No matter!

var theProgram = env.bindLexical($env, function ($env) {
  if (something) {
    env.call($env, main);
  } else if (somethingelse) {
    $env.db_backend = 'somethingelse'; // this does not affect anything above this stack.
    env.call($env, main);
  } else {
    ['file1', 'couch', 'whatever'].forEach(env.bindLexical($env, function ($env, file) {
      $env.db_backend = file;
      env.call($env, main);
    }));
  }
});

/* vim: set sw=2 sts=2 et: */
