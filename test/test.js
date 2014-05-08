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
      env.call($env, env.bindLexical($env, spy), 1);
      ok(spy.calledOnce);
      ok.strictEqual(spy.lastCall.args[0].prop, 'prop');
      ok.strictEqual(spy.lastCall.args[1], 1);
    });
    it('only passes $ENV to lexically bound methods', function () {
      var notLexicallyBound = function () {
        ok.equal(this.that, 'is it');
        ok.equal(arguments.length, 0);
      }.bind({ that: 'is it' });  //spy.bind({ that: 'is it' });
      env.call($env, spy);
    });
  });
  describe('env.callMethod', function () {
    it('calls the method with ctx, env, args', function () {
      var vader = { 'i am': 'urfather', func: env.bindLexical($env, spy) };
      env.callMethod($env, vader, 'func', 1, 2, 3);
      ok.strictEqual(spy.lastCall.args[0].prop, 'prop');
      ok.strictEqual(spy.lastCall.args[1], 1);
      ok.strictEqual(spy.lastCall.thisValue, vader);
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

describe('processed code usage examples:', function () {
  it('closure closure', function (done) {
    var $env = env.create();
    $env.lexical = 'yeah';
    var func = env.bindLexical($env, function ($env) {
      ok.strictEqual($env.lexical, 'yeah');
      done();
    });

    func();
  });
  it('stack closure', function (done) {
    var $env = env.create();
    var a = env.bindLexical($env, function ($env) {
      $env.a = true; env.call($env, b);
    });
    var b = env.bindLexical($env, function ($env) {
      $env.b = true; $env.a = false; env.call($env, c);
    });
    var c = env.bindLexical($env, function ($env) {
      ok.strictEqual($env.a, false); ok($env.b); done();
    });

    a();
  });
  it('stack closure vs closure closure', function (done) {
    var $env = env.create();
    $env.a = 'in closure';
    var a = env.bindLexical($env, function ($env) {
      $env.a = 'in stack';
      env.call($env, b);
    });
    var b = env.bindLexical($env, function ($env) {
      ok.equal($env.a, 'in closure');
      done();
    });
    env.call($env, a);
  });
});

/* vim: set sw=2 sts=2 et: */
