env.js
======

Stack-oriented, per-call closures for passing values into other functions, like environment variables in unix. Shoved into JavaScript.


WTF Is Wrong With You?
======================

I am always thinking of new ways to build apps and paradigms which would help us do it,
and I was inspired by the several ways of doing message passing in unix. In particular, environment
variables got my attention, since they aren't used in day-by-day programming (except if you
write bash or sh scripts every day).

So I decided to create this way of having "Stack variables" in addition to the closure variables
javascript already has.

There is an environment (which is to say a javascript object) which gets extended in each and every
function call into another object, which is passed into the called function. The called function can
add to this environment to declare "stack variables", which are accessible there and in any function it calls.

This function can in turn call other functions and they will be able to use these values and add
values of their own. As functions return, the "environment" they used gets deleted, unless stored elsewhere,
by the garbage collector.

The caller will not be able to access "stack" variables declared in the callee, but the opposite is true. Just
like in lexical closures. However, unlike in lexical closures, a called function will not be able to mess with
the caller's environment, instead it shadows the variables created above (without deleting them).

If you really want to expose variables to be changed below, you can declare an object. Since objects are mutable,
their values can be changed below without shadowing or copying.


This stinks of global variables to me
-------------------------------------

I am always obsessed with program correctness, and I have thought of that too. I prefer to think that
these are "context variables". In *nix systems, you can use the "env" command to pass specific environment
variables to new program, and that only affects that program and child processes of it. This idea is similar,
in that your functions are indeed accessing variables which are global to *them*, but are not really global
in that you can change them at will. In a way, since this is completely new, maybe it doesn't make sense
to dismiss it without trying it to see if it is an antipattern, or can lead to antipatterns.


How?
----
The core behaviour is achieved through the prototype chain. Every call will create an "env" object
inheriting through the prototype chain from the "env" object present in the caller.

This simple system can be used to implement object orientation of sorts (when you don't need the full class thing),
share application configuration settings across the whole app, and change them slightly across "zones" in your app.


Roadmap
=======

- JS preprocessor, introducing the "env" keyword, analogous to "var" and which works on block level (tricky!).
- An example on the repo
- NPM
- Try to build some apps with it
  - In the DOM
  - On the server
- Try to use this to create an application with plugins, to see if it helps decouple the app, and what problems
may occur.
- See if this works well when the base env is the system's environment variables (I'm dying to try this one out).
- Port to other languages if the concept works. First in line, Python!
