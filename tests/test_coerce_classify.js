/*
 *  test_coerce_classify.js
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
const coerce = require("../lib/coerce");

describe("coerce", function() {
    describe("classify", function() {
        describe("good", function() {
            it("null", function() {
                assert.strictEqual("iot:type.null", coerce.classify(null));
            });
            it("boolean - false", function() {
                assert.strictEqual("iot:type.boolean", coerce.classify(false));
            });
            it("boolean - true", function() {
                assert.strictEqual("iot:type.boolean", coerce.classify(true));
            });
            it("integer - 0", function() {
                assert.strictEqual("iot:type.integer", coerce.classify(0));
            });
            it("integer - negative", function() {
                assert.strictEqual("iot:type.integer", coerce.classify(-34));
            });
            it("integer - positive", function() {
                assert.strictEqual("iot:type.integer", coerce.classify(99));
            });
            it("number - negative", function() {
                assert.strictEqual("iot:type.number", coerce.classify(-3.4));
            });
            it("number - positive", function() {
                assert.strictEqual("iot:type.number", coerce.classify(99.9));
            });
            it("string - empty", function() {
                assert.strictEqual("iot:type.string", coerce.classify(""));
            });
            it("string - empty", function() {
                assert.strictEqual("iot:type.string", coerce.classify("not empty"));
            });
        });
        describe("unknown", function() {
            it("undefined", function() {
                assert.strictEqual(null, coerce.classify(undefined));
            });
            it("dictionary(empty)", function() {
                assert.strictEqual(null, coerce.classify({}));
            });
            it("dictionary(full)", function() {
                assert.strictEqual(null, coerce.classify({ a: 1 }));
            });
            it("array(empty)", function() {
                assert.strictEqual(null, coerce.classify([]));
            });
            it("array(full)", function() {
                assert.strictEqual(null, coerce.classify([ 1, 2, 3 ]));
            });
            it("function", function() {
                assert.strictEqual(null, coerce.classify(() => {}));
            });
            it("class", function() {
                assert.strictEqual(null, coerce.classify(Date));
            });
            it("object", function() {
                assert.strictEqual(null, coerce.classify(new Date()));
            });
        });
    });
});
