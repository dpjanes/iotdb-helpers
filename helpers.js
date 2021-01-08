/*
 *  helpers.js
 *
 *  David Janes
 *  IOTDB.org
 *  2013-12-01
 *
 *  Copyright (2013-2020) David P. Janes
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict";

exports.lodash = require('lodash');
exports.underscore = exports.lodash;

const modules = [
    exports.lodash,
    require('./lib/ld'),
    require('./lib/id'),
    require('./lib/d'),
    require('./lib/fs'),
    require('./lib/hash'),
    require('./lib/is'),
    require('./lib/net'),
    require('./lib/color'),
    require('./lib/timestamp'),
    require('./lib/error'),
    require('./lib/convert'),
    require('./lib/random'),
    require('./lib/q'),
    require('./lib/logger'),
    require('./lib/coerce'),
    require('./lib/cfg'),
    require('./lib/promise'),
    require('./lib/text'),
    // require('./lib/validate'),
];
for (var mi in modules) {
    var module = modules[mi];
    for (var key in module) {
        exports[key] = module[key];
    }
}

exports.validate = require("./lib/validate").validate
exports.i = require("./lib/i").i
exports.p = require("./lib/p").p

// underscore / lodash compatibility
exports.mapObject = exports.mapValues;
exports.pairs = exports.toPairs;
exports.object = exports.zipObject;
exports.flatten = (a, shallow) => shallow ? exports.lodash.flatten(a) : exports.lodash.flattenDeep(a);

// misc 
exports.noop = function () {};
/*
exports.spy = name => value => {
    console.log(name, value);
    return value;
};
*/

// these are aliases
exports.queue = require('./lib/q').q.queue;
exports.defaults = require('./lib/d').d.compose.shallow;

// these are likely to be deleted
exports.make_done = done => value => done(null, value);
exports.make_error = done => error => done(error);

// this should be deleted?
exports.counter = require("./counter").counter;

// testing only
exports.QUIET = false
