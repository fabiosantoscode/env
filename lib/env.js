
function create(inherit) {
  function EnvClass() {}
  EnvClass.prototype = inherit || {};
  EnvClass.prototype.$IS_ENV_DATA = true;
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
    var callArgs;
    var callEnv;

    if (!(stackEnv && stackEnv.$IS_ENV_DATA)) {
      callEnv = create(lexicalEnv);
      callArgs = ([].slice.call(arguments));
    } else {
      callEnv = create(stackEnv)
      for (var x in lexicalEnv) {
        callEnv[x] = lexicalEnv[x];
      }
      callArgs = (([].slice.call(arguments, 1)));
    }

    return func.apply(this /* this comes from the real bind */, 
      [callEnv].concat(args).concat(callArgs));
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
