/*
 *  test/validate.js
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
                a: 1,
                b: "hello",
                values: [ 1, 2, 3 ],
            },
        },
    }
}

describe("validate", function() {
    const method = () => {}
    method.method = "_.promise.validate.fake"

    describe("required", function() {
        describe("top", function() {
            it("single / ok", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "number",
                        allows: [ _.is.Number ],
                        required: true,
                    },
                ]))

                assert.ok(!result)
            })
            it("single / ok", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "array-of-string",
                        allows: [ _.is.Array.of.String, ],
                        required: true,
                    },
                ]))

                assert.ok(!result)
            })
            it("multiple / ok", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "number",
                        allows: [ _.is.String, _.is.Number ],
                        required: true,
                    },
                ]))

                assert.ok(!result)
            })
            it("single / bad", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "number",
                        allows: [ _.is.String ],
                        required: true,
                    },
                ]))

                assert.ok(result)
            })
            it("multiple / bad", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "number",
                        allows: [ _.is.String, _.is.Boolean, _.is.Array ],
                        required: true,
                    },
                ]))

                assert.ok(result)
            })
            it("single / missing", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "numberX",
                        allows: [ _.is.String ],
                        required: true,
                    },
                ]))

                assert.ok(result)
            })
            it("multiple / missing", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "numberX",
                        allows: [ _.is.String, _.is.Boolean, _.is.Array ],
                        required: true,
                    },
                ]))

                assert.ok(result)
            })
        })
        describe("deep", function() {
            it("single / ok", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "deep/layer2/layer3/a",
                        allows: [ _.is.Number ],
                        required: true,
                    },
                ]))

                assert.ok(!result)
            })
            it("single / ok", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "deep/layer2/layer3/values",
                        allows: [ _.is.Array.of.Number, ],
                        required: true,
                    },
                ]))

                assert.ok(!result)
            })
            it("single / bad", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "deep/layer2/layer3/a",
                        allows: [ _.is.String ],
                        required: true,
                    },
                ]))

                assert.ok(result)
            })
            it("single / bad", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "deep/layer2/layer3/values",
                        allows: [ _.is.Array.of.String, ],
                        required: true,
                    },
                ]))

                assert.ok(result)
            })
            it("single / missing", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "deep/layer2/layer3/aX",
                        allows: [ _.is.NaN ],
                        required: true,
                    },
                ]))

                assert.ok(result)
            })
            it("single / missing", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "deep/layer2/layer3/valuesX",
                        allows: [ _.is.Array.of.Dictionary, ],
                        required: true,
                    },
                ]))

                assert.ok(result)
            })
            it("multiple / ok", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "deep/layer2/layer3/values",
                        allows: [ _.is.Array.of.Dictionary, _.is.Array.of.String, _.is.Array.of.Number, ],
                        required: true,
                    },
                ]))

                assert.ok(!result)
            })
            it("multiple / bad", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "deep/layer2/layer3/a",
                        allows: [ _.is.Array.of.Dictionary, _.is.Array.of.String, _.is.Array.of.Number, ],
                        required: true,
                    },
                ]))

                assert.ok(result)
            })
            it("multiple / missing", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "deep/layer2/layer3/aX",
                        allows: [ _.is.Array.of.Dictionary, _.is.Array.of.String, _.is.Array.of.Number, ],
                        required: true,
                    },
                ]))

                assert.ok(result)
            })
        })
    })
    describe("not required", function() {
        describe("top", function() {
            it("single / ok", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "number",
                        allows: [ _.is.Number ],
                        required: false,
                    },
                ]))

                assert.ok(!result)
            })
            it("single / ok", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "array-of-string",
                        allows: [ _.is.Array.of.String, ],
                        required: false,
                    },
                ]))

                assert.ok(!result)
            })
            it("multiple / ok", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "number",
                        allows: [ _.is.String, _.is.Number ],
                        required: false,
                    },
                ]))

                assert.ok(!result)
            })
            it("single / bad", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "number",
                        allows: [ _.is.String ],
                        required: false,
                    },
                ]))

                assert.ok(result)
            })
            it("multiple / bad", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "number",
                        allows: [ _.is.String, _.is.Boolean, _.is.Array ],
                        required: false,
                    },
                ]))

                assert.ok(result)
            })
            it("single / missing", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "numberX",
                        allows: [ _.is.String ],
                        required: false,
                    },
                ]))

                assert.ok(!result)
            })
            it("multiple / missing", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "numberX",
                        allows: [ _.is.String, _.is.Boolean, _.is.Array ],
                        required: false,
                    },
                ]))

                assert.ok(!result)
            })
        })
        describe("deep", function() {
            it("single / ok", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "deep/layer2/layer3/a",
                        allows: [ _.is.Number ],
                        required: false,
                    },
                ]))

                assert.ok(!result)
            })
            it("single / ok", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "deep/layer2/layer3/values",
                        allows: [ _.is.Array.of.Number, ],
                        required: false,
                    },
                ]))

                assert.ok(!result)
            })
            it("single / bad", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "deep/layer2/layer3/a",
                        allows: [ _.is.String ],
                        required: false,
                    },
                ]))

                assert.ok(result)
            })
            it("single / bad", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "deep/layer2/layer3/values",
                        allows: [ _.is.Array.of.String, ],
                        required: false,
                    },
                ]))

                assert.ok(result)
            })
            it("single / missing", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "deep/layer2/layer3/aX",
                        allows: [ _.is.NaN ],
                        required: false,
                    },
                ]))

                assert.ok(!result)
            })
            it("single / missing", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "deep/layer2/layer3/valuesX",
                        allows: [ _.is.Array.of.Dictionary, ],
                        required: false,
                    },
                ]))

                assert.ok(!result)
            })
            it("multiple / ok", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "deep/layer2/layer3/values",
                        allows: [ _.is.Array.of.Dictionary, _.is.Array.of.String, _.is.Array.of.Number, ],
                        required: false,
                    },
                ]))

                assert.ok(!result)
            })
            it("multiple / bad", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "deep/layer2/layer3/a",
                        allows: [ _.is.Array.of.Dictionary, _.is.Array.of.String, _.is.Array.of.Number, ],
                        required: false,
                    },
                ]))

                assert.ok(result)
            })
            it("multiple / missing", function() {
                const expected = null
                const result = trap(() => _.validate.validate(self, method, [
                    {
                        key: "deep/layer2/layer3/aX",
                        allows: [ _.is.Array.of.Dictionary, _.is.Array.of.String, _.is.Array.of.Number, ],
                        required: false,
                    },
                ]))

                assert.ok(!result)
            })
        })
    })
})

describe("flatten", function() {
    it("works - flat", function() {
        const got = _.validate.flatten({
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
        const got = _.validate.flatten({
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
        const got = _.validate.flatten({
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
        const got = _.validate.flatten({
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
        const got = _.validate.flatten({
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

