/*
 *  test_coerce_coerce.js
 *
 *  David Janes
 *  IOTDB
 *  2016-06-08
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

const assert = require("assert");
const coerce = require("./coerce");

describe("coerce", function() {
    describe("coerce", function() {
        describe("simple", function() {
            describe("null", function() {
                it("->null", function() {
                    assert.strictEqual(coerce.coerce(null, "iot:type.null"), null);
                });
                it("->boolean", function() {
                    assert.strictEqual(coerce.coerce(null, "iot:type.boolean"), false);
                });
                it("->integer", function() {
                    assert.strictEqual(coerce.coerce(null, "iot:type.integer"), 0);
                });
                it("->number", function() {
                    assert.strictEqual(coerce.coerce(null, "iot:type.number"), 0);
                });
                it("->string", function() {
                    assert.strictEqual(coerce.coerce(null, "iot:type.string"), "");
                });
            });
            describe("boolean(false)", function() {
                it("->null", function() {
                    assert.strictEqual(coerce.coerce(false, "iot:type.null"), null);
                });
                it("->boolean", function() {
                    assert.strictEqual(coerce.coerce(false, "iot:type.boolean"), false);
                });
                it("->integer", function() {
                    assert.strictEqual(coerce.coerce(false, "iot:type.integer"), 0);
                });
                it("->number", function() {
                    assert.strictEqual(coerce.coerce(false, "iot:type.number"), 0);
                });
                it("->string", function() {
                    assert.strictEqual(coerce.coerce(false, "iot:type.string"), "0");
                });
            });
            describe("boolean(true)", function() {
                it("->null", function() {
                    assert.strictEqual(coerce.coerce(true, "iot:type.null"), null);
                });
                it("->boolean", function() {
                    assert.strictEqual(coerce.coerce(true, "iot:type.boolean"), true);
                });
                it("->integer", function() {
                    assert.strictEqual(coerce.coerce(true, "iot:type.integer"), 1);
                });
                it("->number", function() {
                    assert.strictEqual(coerce.coerce(true, "iot:type.number"), 1);
                });
                it("->string", function() {
                    assert.strictEqual(coerce.coerce(true, "iot:type.string"), "1");
                });
            });
            describe("integer(0)", function() {
                it("->null", function() {
                    assert.strictEqual(coerce.coerce(0, "iot:type.null"), null);
                });
                it("->boolean", function() {
                    assert.strictEqual(coerce.coerce(0, "iot:type.boolean"), false);
                });
                it("->integer", function() {
                    assert.strictEqual(coerce.coerce(0, "iot:type.integer"), 0);
                });
                it("->number", function() {
                    assert.strictEqual(coerce.coerce(0, "iot:type.number"), 0);
                });
                it("->string", function() {
                    assert.strictEqual(coerce.coerce(0, "iot:type.string"), "0");
                });
            });
            describe("integer(negative)", function() {
                it("->null", function() {
                    assert.strictEqual(coerce.coerce(-99, "iot:type.null"), null);
                });
                it("->boolean", function() {
                    assert.strictEqual(coerce.coerce(-99, "iot:type.boolean"), true);
                });
                it("->integer", function() {
                    assert.strictEqual(coerce.coerce(-99, "iot:type.integer"), -99);
                });
                it("->number", function() {
                    assert.strictEqual(coerce.coerce(-99, "iot:type.number"), -99);
                });
                it("->string", function() {
                    assert.strictEqual(coerce.coerce(-99, "iot:type.string"), "-99");
                });
            });
            describe("integer(positive)", function() {
                it("->null", function() {
                    assert.strictEqual(coerce.coerce(99, "iot:type.null"), null);
                });
                it("->boolean", function() {
                    assert.strictEqual(coerce.coerce(99, "iot:type.boolean"), true);
                });
                it("->integer", function() {
                    assert.strictEqual(coerce.coerce(99, "iot:type.integer"), 99);
                });
                it("->number", function() {
                    assert.strictEqual(coerce.coerce(99, "iot:type.number"), 99);
                });
                it("->string", function() {
                    assert.strictEqual(coerce.coerce(99, "iot:type.string"), "99");
                });
            });
            describe("number(negative)", function() {
                it("->null", function() {
                    assert.strictEqual(coerce.coerce(-99.9, "iot:type.null"), null);
                });
                it("->boolean", function() {
                    assert.strictEqual(coerce.coerce(-99.9, "iot:type.boolean"), true);
                });
                it("->integer", function() {
                    assert.strictEqual(coerce.coerce(-99.9, "iot:type.integer"), -100);
                });
                it("->number", function() {
                    assert.strictEqual(coerce.coerce(-99.9, "iot:type.number"), -99.9);
                });
                it("->string", function() {
                    assert.strictEqual(coerce.coerce(-99.9, "iot:type.string"), "-99.9");
                });
            });
            describe("number(positive)", function() {
                it("->null", function() {
                    assert.strictEqual(coerce.coerce(99.9, "iot:type.null"), null);
                });
                it("->boolean", function() {
                    assert.strictEqual(coerce.coerce(99.9, "iot:type.boolean"), true);
                });
                it("->integer", function() {
                    assert.strictEqual(coerce.coerce(99.9, "iot:type.integer"), 100);
                });
                it("->number", function() {
                    assert.strictEqual(coerce.coerce(99.9, "iot:type.number"), 99.9);
                });
                it("->string", function() {
                    assert.strictEqual(coerce.coerce(99.9, "iot:type.string"), "99.9");
                });
            });
            describe("string(empty)", function() {
                it("->null", function() {
                    assert.strictEqual(coerce.coerce("", "iot:type.null"), null);
                });
                it("->boolean", function() {
                    assert.strictEqual(coerce.coerce("", "iot:type.boolean"), false);
                });
                it("->integer", function() {
                    assert.strictEqual(coerce.coerce("", "iot:type.integer"), undefined);
                });
                it("->number", function() {
                    assert.strictEqual(coerce.coerce("", "iot:type.number"), undefined);
                });
                it("->string", function() {
                    assert.strictEqual(coerce.coerce("", "iot:type.string"), "");
                });
            });
            describe("string(text)", function() {
                it("->null", function() {
                    assert.strictEqual(coerce.coerce("hello world", "iot:type.null"), null);
                });
                it("->boolean", function() {
                    assert.strictEqual(coerce.coerce("hello world", "iot:type.boolean"), true);
                });
                it("->integer", function() {
                    assert.strictEqual(coerce.coerce("hello world", "iot:type.integer"), undefined);
                });
                it("->number", function() {
                    assert.strictEqual(coerce.coerce("hello world", "iot:type.number"), undefined);
                });
                it("->string", function() {
                    assert.strictEqual(coerce.coerce("hello world", "iot:type.string"), "hello world");
                });
            });
            describe("string(falsey)", function() {
                it("0->boolean", function() {
                    assert.strictEqual(coerce.coerce("0", "iot:type.boolean"), false);
                });
                it("off->boolean", function() {
                    assert.strictEqual(coerce.coerce("off", "iot:type.boolean"), false);
                });
                it("false->boolean", function() {
                    assert.strictEqual(coerce.coerce("false", "iot:type.boolean"), false);
                });
                it("no->boolean", function() {
                    assert.strictEqual(coerce.coerce("no", "iot:type.boolean"), false);
                });
                it("OFF->boolean", function() {
                    assert.strictEqual(coerce.coerce("off", "iot:type.boolean"), false);
                });
                it("FALSE->boolean", function() {
                    assert.strictEqual(coerce.coerce("false", "iot:type.boolean"), false);
                });
                it("NO->boolean", function() {
                    assert.strictEqual(coerce.coerce("no", "iot:type.boolean"), false);
                });
            });
            describe("string(0)", function() {
                it("->boolean", function() {
                    assert.strictEqual(coerce.coerce("0", "iot:type.boolean"), false);
                });
                it("->integer", function() {
                    assert.strictEqual(coerce.coerce("0", "iot:type.integer"), 0);
                });
                it("->number", function() {
                    assert.strictEqual(coerce.coerce("0", "iot:type.number"), 0);
                });
            });
            describe("string(positive-integer)", function() {
                it("->boolean", function() {
                    assert.strictEqual(coerce.coerce("99", "iot:type.boolean"), true);
                });
                it("->integer", function() {
                    assert.strictEqual(coerce.coerce("99", "iot:type.integer"), 99);
                });
                it("->number", function() {
                    assert.strictEqual(coerce.coerce("99", "iot:type.number"), 99);
                });
            });
            describe("string(+positive-integer)", function() {
                it("->boolean", function() {
                    assert.strictEqual(coerce.coerce("+99", "iot:type.boolean"), true);
                });
                it("->integer", function() {
                    assert.strictEqual(coerce.coerce("+99", "iot:type.integer"), 99);
                });
                it("->number", function() {
                    assert.strictEqual(coerce.coerce("+99", "iot:type.number"), 99);
                });
            });
            describe("string(negative-integer)", function() {
                it("->boolean", function() {
                    assert.strictEqual(coerce.coerce("-99", "iot:type.boolean"), true);
                });
                it("->integer", function() {
                    assert.strictEqual(coerce.coerce("-99", "iot:type.integer"), -99);
                });
                it("->number", function() {
                    assert.strictEqual(coerce.coerce("-99", "iot:type.number"), -99);
                });
            });
            describe("string(positive-number)", function() {
                it("->boolean", function() {
                    assert.strictEqual(coerce.coerce("99.1", "iot:type.boolean"), true);
                });
                it("->integer", function() {
                    assert.strictEqual(coerce.coerce("99.1", "iot:type.integer"), 99);
                });
                it("->number", function() {
                    assert.strictEqual(coerce.coerce("99.1", "iot:type.number"), 99.1);
                });
            });
            describe("string(+positive-number)", function() {
                it("->boolean", function() {
                    assert.strictEqual(coerce.coerce("+99.1", "iot:type.boolean"), true);
                });
                it("->integer", function() {
                    assert.strictEqual(coerce.coerce("+99.1", "iot:type.integer"), 99);
                });
                it("->number", function() {
                    assert.strictEqual(coerce.coerce("+99.1", "iot:type.number"), 99.1);
                });
            });
            describe("string(negative-number)", function() {
                it("->boolean", function() {
                    assert.strictEqual(coerce.coerce("-99.1", "iot:type.boolean"), true);
                });
                it("->integer", function() {
                    assert.strictEqual(coerce.coerce("-99.1", "iot:type.integer"), -99);
                });
                it("->number", function() {
                    assert.strictEqual(coerce.coerce("-99.1", "iot:type.number"), -99.1);
                });
            });
        });
    });
});
