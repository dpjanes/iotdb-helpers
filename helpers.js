/*
 *  helpers.js
 *
 *  David Janes
 *  IOTDB.org
 *  2013-12-01
 *
 *  Nodejs IOTDB control
 *
 *  Copyright [2013-2016] [David P. Janes]
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

var crypto = require('crypto');
var node_url = require('url');
var path = require('path');

exports.underscore = require('underscore')

var modules = [
    exports.underscore,
    require('./lib/ld'),
    require('./lib/id'),
    require('./lib/d'),
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
];
for (var mi in modules) {
    var module = modules[mi];
    for (var key in module) {
        exports[key] = module[key];
    }
}

exports.queue = require('./lib/q').q.queue;
exports.defaults = require('./lib/d').d.compose.shallow;
exports.noop = function () {};
exports.make_done = function (done) {
    return function(value) {
        done(null, value);
    };
};
exports.make_error = function (done) {
    return function(error) {
        done(error);
    };
};