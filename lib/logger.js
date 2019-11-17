/*
 *  logger.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-04-07
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

const os = require("os")
const util = require("util")
const events = require("events")

const _logd = {
    debug: true,
    info: true,
    error: true,
    warn: true,
    trace: true,
    fatal: true,
}

/**
 *  Make a new logger. Clevel people could
 *  swap this out to replace it.
 */
const make = _initd => {
    const _ = require("..")
    const self = Object.assign({})

    const initd = _.d.clone(_initd)
    initd.hostname = os.hostname()
    initd.pid = process.pid
    initd.v = 0

    const emitter = new events();
    self.on = (...rest) => emitter.on.apply(emitter, rest)

    const _log = (level, level_name) => (...rest) => {
        if (!_logd[level_name]) {
            return;
        }

        let packet = _.d.clone(initd)
        packet.level = level;
        packet.time = _.timestamp.make()

        if (rest.length) {
            if (rest[0] instanceof Error) {
                packer.err = {
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                }

                rest.shift()
            } else if (_.is.Object(rest[0])) {
                packet = Object.assign({}, packet, rest[0])
                rest.shift()
            }
        }

        if (rest.length) {
            packet.msg = util.format.apply(util.format, rest)
        }

        process.stdout.write(JSON.stringify(packet))
        process.stdout.write("\n")

        emitter.emit("event", packet)

        return packet;
    }

    self.trace = _log(10, "trace")
    self.debug = _log(20, "debug")
    self.info = _log(30, "info")
    self.warn = _log(40, "warn")
    self.error = _log(50, "error")
    self.fatal = _log(60, "fatal")

    return self;
};

/**
 *  Set the logging levels.
 *
 *  If leveld.all is set, everything in _logd
 *  is set to that value first.
 */
const levels = leveld => {
    if (leveld.all !== undefined) {
        Object.keys(_logd).forEach(key => _logd[key] = leveld.all);
    }

    Object.keys(leveld).forEach(key => _logd[key] = leveld[key])
}

/**
 *  Turn off all logging except
 *  for fatal error messages
 */
const silent = function() {
    levels({
        all: false,
        fatal: true,
    });
};

const _mutes = [];

/**
 *  Mute based on dictionary
 */
const mute = md => _mutes.push(md);

/**
 *  Create a logger. If you don't want
 *  to use bunyan, replace 'logger.make',
 *  not this
 */
const logger = function (initd) {
    const _d = require("./d").d;
    const _logger = function() {
        let l = null;

        const _make = () => {
            if (l === null) {
                l = make(initd);
            }
        };

        const _level = level => {
            return function(...rest) {
                if (!_logd[level]) {
                    return;
                }

                if (_mutes.find(m => _d.is.subset(m, initd))) {
                    return;
                }

                _make();
                return l[level](...rest)
            }
        };

        return {
            debug: _level("debug"),
            info: _level("info"),
            warn: _level("warn"),
            error: _level("error"),
            trace: _level("trace"),
            fatal: _level("fatal"),
        }
    };

    return _logger();
};

/* --- API --- */
exports.logger = {
    make: make,
    logger: logger,
    levels: levels,
    silent: silent,
    mute: mute,
};
