'use strict';

var compiler = require('./compiler.js');
var path = require('path');
var fs = require('fs');

var utf8 = { encoding: 'utf-8' };

function addRequireHook() {
  var oldExt = require.extensions['.js'];
  require.extensions['.js'] = function (module, filename) {
    if (/\.env\.js$/.test(filename)) {
      var code = compiler.compile(fs.readFileSync(filename, utf8));

      filename = path.join(
          path.dirname(filename),
          '.env.' + path.basename(filename, '.env.js')) + '.js';

      fs.writeFileSync(filename, code, utf8);
    }
    return oldExt(module, filename);
  }
}

if (module.parent === null) {
  var path = require('path');

  addRequireHook();

  var fname = path.resolve(process.argv[2], process.env.PWD, process.argv[2]);
  require(fname);
}

module.exports = addRequireHook;

/* vim: set sw=2 sts=2 et: */
