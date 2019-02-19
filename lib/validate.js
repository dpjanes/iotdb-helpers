/*
 *  validate.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-02-19
 *
 *  Copyright [2013-2019] [David P. Janes]
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

const _ = require("..")

const assert = require("assert")
const util = require("util")

/**
 */
function ValidationError(method, rule, got) {
    Error.call(this, "ValidationError");

    console.log("===")
    console.log("ValidationError")
    if (method.method) {
        console.log("method:", method.method)
    } else if (method.name) {
        console.log("method:", method.name)
    } else {
        console.log("method:", method)
    }
    if (rule.message) {
        console.log("message:", rule.message)
    }
    console.log("key:", rule.key)
    console.log("expected:", rule.allows.map(a => a.method || a.name || a.toString()).join(" | "))
    console.log("required:", rule.required)
    console.log("got (type):", typeof got)
    console.log("got (value):", got)
    console.log("==")

    this._ValidationError = true
    this.message = "ValidationError"
    this.statusCode = 500;
}

util.inherits(ValidationError, Error);

/**
 */
const validate = (self, method, rules) => {
    const _ = require("..")

    assert.ok(_.is.Dictionary(self))
    assert.ok(_.is.Array.of.Dictionary(rules))

    rules.forEach(rule => {
        assert.ok(_.is.String(rule.key))

        const got = _.d.get(self, rule.key)
        if (!rule.required && _.is.Nullish(got)) {
            return
        }

        let ok = null

        rule.allows.forEach(allow => {
            assert.ok(_.is.Function(allow))

            if (ok) {
            } else if (allow(got)) {
                ok = true
            } else {
                ok = false
            }
        })

        if (ok === false) {
            throw new ValidationError(method, rule, got)
        }
    })

}

/**
 */
const flatten = (d, required) => {
    const _ = require("..")

    assert.ok(_.is.Dictionary(d))
    assert.ok(_.is.Boolean(required))

    const rules = []

    const _flatten = (_d, path) => {
        _.mapObject(_d, (_subvalue, _subkey) => {
            const key = `${path}/${_subkey}`

            if (_.is.Function(_subvalue)) {
                rules.push({
                    required: required,
                    allows: [ _subvalue ],
                    key: key,
                })
            } else if (_.is.Null(_subvalue)) {
                rules.push({
                    required: required,
                    allows: [ _.is.Null ],
                    key: key,
                })
            } else if (_.is.Array(_subvalue)) {
                const rule = {
                    required: required,
                    allows: [],
                    key: key,
                }
                rules.push(rule)

                _subvalue.forEach(_subsubvalue => {
                    if (_.is.Function(_subsubvalue)) {
                        rule.allows.push(_subsubvalue)
                    } else if (_.is.Null(_subsubvalue)) {
                        rule.allows.push(_.is.Null)
                    } else if (_.is.String(_subsubvalue)) {
                        rule.message = _subsubvalue
                    } else {
                        assert.ok(false, "expected Function, Null or String")
                    }
                })
            } else if (_.is.Dictionary(_subvalue)) {
                _flatten(_subvalue, key)
            }
        })
    }

    _flatten(d, "")

    return rules
}

/**
 *  API
 */
exports.validate = validate

describe("flatten", function() {
    it("works - flat", function() {
        const got = flatten({
            "a": _.is.String,
        }, true)

        const expect = [
            {
                key: "/a",
                required: true, 
                allows: [ _.is.String ],
            },
        ]
        assert.deepEqual(got, expect)
    })
    it("works - flat null", function() {
        const got = flatten({
            "a": null,
        }, true)

        const expect = [
            {
                key: "/a",
                required: true, 
                allows: [ _.is.Null ],
            },
        ]
        assert.deepEqual(got, expect)
    })
    it("works - flat, array", function() {
        const got = flatten({
            "b": [ _.is.String, _.is.Number ],
        }, true)

        const expect = [
            {
                key: "/b",
                required: true, 
                allows: [ _.is.String, _.is.Number ],
            },
        ]
        assert.deepEqual(got, expect)
    })
    it("works - flat, array with Null and String", function() {
        const got = flatten({
            "c": [ _.is.Dictionary, null, "expect a dictionary" ],
        }, true)

        const expect = [
            {
                key: "/c",
                required: true, 
                allows: [ _.is.Dictionary, _.is.Null ],
                message: "expect a dictionary",
            },
        ]
        assert.deepEqual(got, expect)
    })
    it("works - deep, array with String", function() {
        const got = flatten({
            "a": _.is.String,
            "d": {
                "e": {
                    "f": [ _.is.Boolean, "expect a boolean" ],
                },
            },
        }, false)

        const expect = [
            {
                key: "/a",
                required: false, 
                allows: [ _.is.String ],
            },
            {
                key: "/d/e/f",
                required: false, 
                allows: [ _.is.Boolean, ],
                message: "expect a boolean",
            },
        ]
        assert.deepEqual(got, expect)
    })
})

