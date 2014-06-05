'use strict';

var compiler = require('./compiler.js');
var path = require('path');
var fs = require('fs');

var utf8 = { encoding: 'utf-8' };

module.exports =
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

/* vim: set sw=2 sts=2 et: */
