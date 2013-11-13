
var compiler = require('./compiler.js');
var Module = require('module').Module;

var utf8 = { encoding: 'utf-8' };

module.exports = function addRequireHook() {
  var oldExt = require.extensions['.js'];
  require.extensions['.js'] = function (module, filename) {
    if (/\.env\.js$/.test(filename)) {
      var code = compiler.compile(fs.readFileSync(filename, utf8));
      var filename = '.env.' + filename.replace(/\.env\.js$/, '.js');
      fs.writeFileSync(outName, code, utf8);
    }
    return oldExt(module, filename);
  }
}

if (module.parent === null) {
  module.exports();
  require(process.argv[1]);
}

/* vim: set sw=2 sts=2 et: */
