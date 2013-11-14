
function create(inherit) {
  function EnvClass() {}
  EnvClass.prototype = inherit || {};
  return new EnvClass();
}

function _applyCtx($env, func, ctx, args) {
  args = [].slice.call(args);
  if (func.$ENV_LEXICALLY_BOUND) {
    args = [create($env)].concat(args);
  }
  return func.apply(ctx, args);
}

function _apply($env, func, args) {
  return _applyCtx($env, func, null, args);
}

function call($env, func) {
  return _apply(create($env), func, [].slice.call(arguments, 2));
}

function callMethod($env, obj, funcName) {
  return _applyCtx($env, obj[funcName], obj, [].slice.call(arguments, 3));
}

/* this does NOT emulate Function#bind, it binds anonymous functions to their env. */
function bindLexical(lexicalEnv, func) {
  /* this env came from the lexical scope this func was bound in */
  lexicalEnv = create(lexicalEnv);
  var args = [].slice.call(arguments, 2);
  /* this env came from the stack scope */
  var ret = function (stackEnv) {
    /* merge lexical env and stack env. TODO use ES6 multiple inheritance trick. */
    for (var x in stackEnv) {
      lexicalEnv[x] = stackEnv[x];
    }
    args = [lexicalEnv].concat(args.concat([].slice.call(arguments, 1)));
    return func.apply(this /* this comes from the real bind */, args);
  }
  ret.$ENV_LEXICALLY_BOUND = true;
  return ret;
}

module.exports = {
  call: call,
  callMethod: callMethod,
  bindLexical: bindLexical,
  create: create,
}

/* vim: set sw=2 sts=2 et: */
