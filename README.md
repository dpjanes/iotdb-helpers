# iotdb-helpers

Lots of useful functions, built as an overlay on <strike>underscore</strike>lodash.

<img src="https://raw.githubusercontent.com/dpjanes/iotdb-homestar/master/docs/HomeStar.png" align="right" />

Now Bluebird / Async / Q free - 2020-01-08

# Introduction

These are tons of little useful functions. 

    const _ = require("iotdb-helpers");

Everything (well, 99%) is namespaced. For example, to access the `d` "dictionary" functions
you would do:

    _.d.get({ "a": { "b": 1 }}, "/a/b"); // returns "1"

# Sections
## Top Level

`_.noop` - do nothing
`_.make_error` - return a function that
## cfg

Configuration: find files and load them

## coerce

Coerce: change types of things, e.g. `"32"` -> `32`

## color

Color: color operations, such as RGB to HSV

## convert

Convert: unit of measure conversions, such as Celsius to Fahrenheit. 

## d

Dictionaries: manipuate dictionaries, such as getting nested values by path, compositing.

## error

Error: manipulate Error objects

## hash

Hash: hash stuff

## id

Id: create slugs, camel case, dash case, etc.

## is

Is: test types

## ld

Linked Data: work semantic web type LD data, where URIs are used as keys and multiple values may exist at keys

## logger

Loggger: log stuff (looks like <a href="https://github.com/trentm/node-bunyan">bunyan</a> but isn't - can be swapped in though)

## net

Net: do network operations, such as getting IPv4 / IPv6 addresses

## q

Queue: queue operations

## random

Random: generate random numbers and strings

## timestamp

Timestamp: work with ISO datetimes, such as generating, adding to dictionaries, comparison.
