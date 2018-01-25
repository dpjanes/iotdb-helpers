/*
 *  hash.js
 *
 *  David Janes
 *  IOTDB.org
 *  2014-04-11
 *
 *  Hashing functions
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

const _ = require("../helpers");

const crypto = require('crypto');

const safe = v => v.replace(/\//g, '_').replace(/[+]/g, '-');

const _hash = (algorithm, encoding, av) => {
    const hasher = crypto.createHash(algorithm);
    av.forEach(a => hasher.update("" + a))

    return hasher.digest(encoding);
};

const short = a => {
    const hasher = crypto.createHash("md5");
    hasher.update("" + a)

    return safe(hasher.digest("base64").substring(0, 8))
};

exports.hash = {
    safe: safe,
    short: short,
    md5: (...rest) => _hash("md5", "hex", rest),
    sha1: (...rest) => _hash("sha1", "hex", rest),
    sha256: (...rest) => _hash("sha256", "hex", rest),
    sha512: (...rest) => _hash("sha512", "hex", rest),
};
exports.hash.md5.base64 = (...rest) => safe(_hash("md5", "base64", rest));
exports.hash.sha1.base64 = (...rest) => safe(_hash("sha1", "base64", rest));
exports.hash.sha256.base64 = (...rest) => safe(_hash("sha256", "base64", rest));
exports.hash.sha512.base64 = (...rest) => safe(_hash("sha512", "base64", rest));
