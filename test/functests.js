/* run the tests in ../functest */

var path = require('path');
var fs = require('fs');
require('../requireHook.js')();

var functestFolder = path.join(__dirname, '../functest');

var tests = fs.readdirSync(functestFolder)
  .filter(/r/.test.bind(/\.js*/))
  .filter(/r/.test.bind(/^[^.]/))
  .map(function (file) {
    return require(path.join(functestFolder, file));
  })
  .forEach(function (module) {
    module.main();
  });

/* vim: set sw=2 sts=2 et: */
