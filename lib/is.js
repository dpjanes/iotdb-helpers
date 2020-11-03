/*
 *  is.js
 *
 *  David Janes
 *  IOTDB.org
 *  2014-04-15
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

"use strict"

const node_url = require("url")
const lodash = require("lodash")

const isDictionary = o => {
    const _ = require("..")

    if (_.is.Array(o)) {
        return false;
    } else if (_.is.Function(o)) {
        return false;
    } else if (o === null) {
        return false;
    } else if (!_.is.Object(o)) {
        return false;
    } else if (o.constructor === Object) {
        return true;
    } else {
        return false;
    }
};

const isAbsoluteURL = o => {
    if (typeof o !== 'string') {
        return false;
    }

    const u = node_url.parse(o);
    if (!u) {
        return false;
    }
    if (!u.protocol) {
        return false;
    }

    return u.protocol.length > 0;

};

const isEMail = o => {
    if (typeof o !== 'string') {
        return false;
    }

    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(o)
}

const isQName = o => {
    if (typeof o !== 'string') {
        return false;
    }

    return o.match(/^[-a-zA-Z0-9_]+:[^ \/]+$/)
};

const isIPv4 = o => {
    if (typeof o !== 'string') {
        return false;
    }

    const match = o.match(/^(\d+)[.](\d+)[.](\d+)[.](\d+)$/);
    if (!match) {
        return false;
    }

    for (let i = 1; i <= 4; i++) {
        const v = parseInt(match[i])
        if (Number.isNaN(v)) {
            return false;
        } else if ((v < 0) || (v > 255)) {
            return false;
        }
    }

    return true;
};

const _ArrayOfX = (vs, test) => {
    const _ = require("..")

    if (!Array.isArray(vs)) {
        return false;
    }

    for (var vi in vs) {
        if (_.is.Dictionary(test)) {
            const _ = require("..")

            if (!_.is.Dictionary(vs[vi])) {
                return false
            }

            for (let [key, subtest] of Object.entries(test)) {
                if (!subtest(vs[vi][key])) {
                    return false;
                }
            }
        } else {
            if (!test(vs[vi])) {
                return false;
            }
        }
    }

    return true;
};

const isAtomic = v => exports.is.Boolean(v) || exports.is.Number(v) || exports.is.String(v) || exports.is.Null(v);

const isJSON = (v, _verbose) => {
    const _ = require("..")

    if (exports.is.Array(v)) {
        for (let vi in v) {
            if (!isJSON(v[vi], _verbose)) {
                return false;
            }
        }
        return true;
    } else if (exports.is.Dictionary(v)) {
        const values = _.values(v);
        for (let value in values) {
            if (!isJSON(value, _verbose)) {
                return false;
            }
        }
        return true;
    } else {
        if (isAtomic(v)) {
            return true
        } else {
            if (_verbose) {
                console.log("_.is.JSON:", "JSON:", typeof v, v)
            }

            return false
        }
    }
}

// e.g. items.sort((a, b) => _.is.unsorted(a.name, b.name))
const unsorted = (a, b) => {
    const _ = require("..")

    if (lodash.isEqual(a, b)) {
        return 0;
    } else if (a < b) {
        return -1;
    } else {
        return 1;
    }
}

// this is more pythonic than the underscore isEmpty
const isEmpty = o => {
    const _ = require("..")

    if (_.is.Array(o)) {
        return o.length === 0
    } else if (_.is.String(o)) {
        return o.length === 0
    } else if (_.is.Boolean(o)) {
        return !o
    } else if (_.is.Number(o)) {
        return o === 0
    } else if (_.is.Nullish(o)) {
        return true
    } else {
        return lodash.isEmpty(o)
    }
}

const isInEnumeration = (e, v) => {
    const _ = require("..")

    if (_.is.Array(e)) {
        return e.indexOf(v) !== -1
    } else if (_.is.Dictionary(e)) {
        return _.values(e).indexOf(v) !== -1
    } else {
        return false
    }
}

exports.is = {
    // lowercase because not asking about a typ
    unsorted: unsorted,

    // useful helpers
    Dictionary: isDictionary,
    AbsoluteURL: isAbsoluteURL,
    QName: isQName,
    Timestamp: o => (typeof o === 'string') && o.match(/\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ/),
    IPv4: isIPv4,
    EMail: isEMail,

    // JSON-like
    JSON: isJSON,
    Atomic: isAtomic,

    // consistency
    Empty: isEmpty,
    Equal: lodash.isEqual,

    // Javascript classes and types
    Array: Array.isArray,
    Boolean: o => typeof o === 'boolean',
    Date: o => o instanceof Date,
    Function: o => typeof o === 'function',
    Integer: o => typeof o === 'number' && ((o % 1) === 0),
    Null: o => o === null,
    Number: o => typeof o === 'number' && !Number.isNaN(o) && Number.isFinite(o),
    Object: lodash.isObject,
    RegExp: o => o instanceof RegExp,
    Buffer: o => o instanceof Buffer,
    String: o => typeof o === 'string',
    Promise: o => o instanceof Promise,
    Error: o => o instanceof Error,
    Undefined: o => o === void 0,
    NaN: v => Number.isNaN(v), 
    Bail: v => {
        const _ = require("..")
        return v && v.__bail === _.promise.BAIL
    },

    Enumeration: e => v => isInEnumeration(e, v),
    Anything: v => true,

    Nullish: o => exports.is.Null(o) || exports.is.Undefined(o),

    // aggregates - depreciated
    ArrayOfString: o => exports.is.Array.of.String(o),
    ArrayOfObject: o => exports.is.Array.of.Object(o),
    ArrayOfDictionary: o => exports.is.Array.of.Dictionary(o),
};

exports.is.JSON.verbose = v => isJSON(v, true)

Object.keys(exports.is).forEach(m => exports.is[m].method = `_.is.${m}`)

exports.is.Boolean.False = o => o === false
exports.is.Boolean.True = o => o === true

exports.is.Array.of = f => o => _ArrayOfX(o, f)

exports.is.Array.of.Number = o => _ArrayOfX(o, exports.is.Number)
exports.is.Array.of.Number.method = "_.is.Array.of.Number"

exports.is.Array.of.String = o => _ArrayOfX(o, exports.is.String)
exports.is.Array.of.String.method = "_.is.Array.of.String"

exports.is.Array.of.Object = o => _ArrayOfX(o, exports.is.Object)
exports.is.Array.of.Object.method = "_.is.Array.of.Object"

exports.is.Array.of.Dictionary = o => _ArrayOfX(o, exports.is.Dictionary)
exports.is.Array.of.Dictionary.method = "_.is.Array.of.Dictionary"

exports.is.Array.of.JSON = o => _ArrayOfX(o, exports.is.JSON)
exports.is.Array.of.JSON.method = "_.is.Array.of.JSON"

exports.is.Array.of.Atomic = o => _ArrayOfX(o, exports.is.Atomic)
exports.is.Array.of.Atomic.method = "_.is.Array.of.Atomic"

