env.js
======

Stack-oriented, per-call closures for passing variables, like environment variables in unix. Shoved into JavaScript.


WTF Is Wrong With You?
======================

I am always thinking of new ways to build apps and paradigms which would help us do it,
and I was inspired by the several ways of doing message passing in unix. In particular, environment
variables got my attention, since they aren't used in day-by-day programming (except if you
write bash or sh scripts every day).

So I decided to create this way of having "Stack variables" in addition to the closure variables
javascript already has.

There is an environment (which is to say a javascript object) which gets extended in each and every
function call into another object, and passed into the called function. The called function gets an
object containing the environment of the above function, and it can add to it easily by declaring
"stack variables". In turn, this function can call other functions and they will be able to use these
values. When this function returns, the environment "chain" is shortened again. The above functions
will not be able to access "stack" variables in the below functions, but the opposite is true. Just
like in lexical closures. Unlike in lexical closures, a called function will not be able to mess with
the caller's environment, because this is copy-on-write. But if you defined an object as a stack variable
above, the object properties can be changed below and that change impacts above too. This is because
objects are mutable.

How?
----
The core behaviour is achieved through the prototype chain. Every call will create an "env" object
inheriting through the prototype chain from the "env" object present in the caller.

This simple system can be used to implement object orientation of sorts (when you don't need the full class thing),
share application configuration settings and change them slightly across "zones" in your app.


Roadmap
=======

- JS preprocessor, introducing the "env" keyword, analogous to "var" and which works on block level (tricky!).
- An example on the repo
- NPM
- Try to build some apps with it
  - In the DOM
  - On the server
- See if this works well when the base env is the system's environment variables.
- Port to other languages if the concept works
