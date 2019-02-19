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
function ValidationError(rule, got) {
    Error.call(this, "ValidationError");

    console.log("===")
    console.log("ValidationError")
    if (rule.message) {
        console.log("message:", rule.message)
    }
    console.log("expected:", rule.allows.map(a => a.method || a.name || a.toString()).join(" | "))
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
const validate = (self, rules) => {
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
            throw new ValidationError(rule, got)
        }
    })

}


// ----
const trap = f => {
    try {
        f()
        return null
    }
    catch (x) {
        if (x._ValidationError) {
            return x
        }

        throw x
    }
}

const self = {
    "number": 21,
    "string": "A String",
    "array-of-string": [ "A", "B", "C" ],
    "shallow": {
        "mr": "plow",
    },
    "deep": {
        "layer2": {
            "layer3": {
                values: [ 1, 2, 3 ],
            },
        },
    }
}

describe("validate", function() {
    it("required / top / single / ok", function() {
        const expected = null
        const result = trap(() => validate(self, [
            {
                key: "number",
                allows: [ _.is.Number ],
                required: true,
            },
        ]))

        assert.ok(!result)
    })
    it("required / top / multiple / ok", function() {
        const expected = null
        const result = trap(() => validate(self, [
            {
                key: "number",
                allows: [ _.is.String, _.is.Number ],
                required: true,
            },
        ]))

        assert.ok(!result)
    })
    it("required / top / single / bad", function() {
        const expected = null
        const result = trap(() => validate(self, [
            {
                key: "number",
                allows: [ _.is.String ],
                required: true,
            },
        ]))

        assert.ok(result)
    })
})
