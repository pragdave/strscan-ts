**StringScanner** is a simple string tokenizer that provides for lexical
scanning operations on a string. It's a JavaScript port of the [Ruby
library with the same name](http://ruby-doc.org/core/classes/StringScanner.html).

Scanning a string means keeping track of and advancing a position (a
zero-based index into the source string) and matching regular expressions
against the portion of the source string after the position.

This code is a port of Sam Stephenson's original [CoffeeScript version](http://github.com/sstephenson/strscan-js).

## Quick start
-------------------------------------------------------------------------

~~~ 
$ yarn add strscan-ts
$ node
~~~

~~~ ruby
> { StringScanner } = require("strscan-ts")
> s = new StringScanner("This is a test")
> s.scan(/\w+/)             # => "This"
> s.scan(/\w+/)             # => null
> s.scan(/\s+/)             # => " "
> s.scan(/\s+/)             # => null
> s.scan(/\w+/)             # => "is"
> s.hasTerminated()         # => false
> s.scan(/\s+/)             # => " "
> s.scan(/(\w+)\s+(\w+)/)   # => "a test"
> s.getMatch()              # => "a test"
> s.getCapture(0)           # => "a"
> s.getCapture(1)           # => "test"
> s.hasTerminated()         # => true
~~~

## Slower start

Go get a hot drink, put on some soothing music, visualize your happy place, and
delight in [the
docs](https://pragdave.github.io/strscan-ts/)

## Information

This is a derivative work of [Sam Stephenson's original](http://github.com/sstephenson/strscan-js).

It is made available under the MIT license.

Copyright © 2022 Dave Thomas
