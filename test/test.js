var sinon = require('sinon');
var env = require('../lib/env.js');
var ok = require('assert');

var root;
beforeEach(function () {
  root = env.create();
  root.hi = 'hi from root';
});
describe('create', function () {
  describe('(returned obj)', function () {
    it('is an object', function () {
      ok(root !== null);
      ok.strictEqual(typeof root, 'object');
    });
  });
  describe('(inheriting from an obj)', function () {
    var inherited;
    beforeEach(function () {
      ok(!('prop' in root)) // sanity check
      root.prop = 'BEGH';
      inherited = env.create(root);
    });
    it('inherits properties through the proto chain', function () {
      ok.strictEqual(inherited.prop, 'BEGH');
    });
    describe('overridden props', function () {
      beforeEach(function () { inherited.prop = 'BEGH2' });
      it('don\'t override the root props', function () {
        ok.strictEqual(root.prop, 'BEGH');
      });
    });
  });
});
describe('', function () {
  var $env;
  beforeEach(function () {
    $env = env.create(root);
    $env.prop = 'prop';
  });
  var spy;
  beforeEach(function () { spy = sinon.spy(); });
  describe('env.call', function () {
    it('calls the function with env, args', function () {
      env.call($env, spy, 1);
      ok(spy.calledOnce);
      ok.strictEqual(spy.lastCall.args[0].prop, 'prop');
      ok.strictEqual(spy.lastCall.args[1], 1);
    });
  });
  describe('envApply', function () {
    it('calls the function with env and args', function () {
      env.apply($env, spy, [1]);
      ok(spy.calledOnce);
      ok.strictEqual(spy.lastCall.args[0].prop, 'prop');
      ok.strictEqual(spy.lastCall.args[1], 1);
    });
  });
  describe('envBind', function () {
    it('creates a function', function () {
      ok.strictEqual(typeof env.bindLexical($env, sinon.spy()), 'function');
    });
    describe('returned function', function () {
      var f;
      beforeEach(function () {
        f = env.bindLexical($env, spy, 1);
      });
      it('is called with env, args, and appended args', function () {
        env.call($env, f, 2);
        ok(spy.calledOnce);
        ok.strictEqual(spy.lastCall.args[0].prop, 'prop');
        ok.strictEqual(spy.lastCall.args[0].hi, 'hi from root');
        ok.strictEqual(spy.lastCall.args[1], 1);
        ok.strictEqual(spy.lastCall.args[2], 2);
      });
    });
  });
});

/* vim: set sw=2 sts=2 et: */
