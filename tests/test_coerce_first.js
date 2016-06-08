/*
 *  test_coerce_first.js
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

const otherwise = "otherwise";

describe("coerce", function() {
    describe("first", function() {
        it("undefined", function() {
            assert.strictEqual(coerce.first(undefined, otherwise), otherwise);
        });
        it("null", function() {
            assert.strictEqual(coerce.first(null, otherwise), null);
        });
        it("0", function() {
            assert.strictEqual(coerce.first(0, otherwise), 0);
        });
        it("empty array", function() {
            assert.strictEqual(coerce.first([], otherwise), otherwise);
        });
        it("array", function() {
            assert.strictEqual(coerce.first([ 1, 2, 3, ], otherwise), 1);
        });
    });
});
