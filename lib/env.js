
function create(inherit) {
  function EnvClass() {}
  EnvClass.prototype = inherit || {};
  return new EnvClass();
}

function apply($env, func, args) {
  args = [].slice.call(args);
  args = [create($env)].concat(args);
  return func.apply(null, args);
}

function call($env, func) {
  return apply(create($env), func, [].slice.call(arguments, 2));
}

/* this does NOT emulate Function#bind, it binds anonymous functions to their env. */
function bindLexical(lexicalEnv, func) {
  lexicalEnv = create(lexicalEnv);  /* this env came from the lexical scope this func was bound in */
  var args = [].slice.call(arguments, 2);
  var ret = function (stackEnv /* this env came from the stack scope */) {
    /* merge lexical env and stack env. TODO use ES6 multiple inheritance trick. */
    for (var x in stackEnv) {
      lexicalEnv[x] = stackEnv[x];
    }
    args = [lexicalEnv].concat(args.concat([].slice.call(arguments, 1)));
    return func.apply(this /* this comes from the real bind */, args);
  }
  return ret;
}

module.exports = {
  call: call,
  apply: apply,
  bindLexical: bindLexical,
  create: create,
}

/* vim: set sw=2 sts=2 et: */
