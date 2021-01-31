/*
 *  test/is_email.js
 *
 *  David Janes
 *  IOTDB
 *  2020-01-31
 *
 *  Copyright (2013-2021) David P. Janes
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

const assert = require("assert")
const _ = require("../helpers")

describe("_.is.EMail", function() {
    it("wrong type - fail", function() {
        assert.ok(!_.is.EMail(NaN))
        assert.ok(!_.is.EMail(new Date()))
        assert.ok(!_.is.EMail(/^hello world$/))
        assert.ok(!_.is.EMail(null))
        assert.ok(!_.is.EMail(undefined))
        assert.ok(!_.is.EMail(0))
        assert.ok(!_.is.EMail(1))
        assert.ok(!_.is.EMail(0.1))
        assert.ok(!_.is.EMail(1.2))
        assert.ok(!_.is.EMail(false))
        assert.ok(!_.is.EMail(true))
        assert.ok(!_.is.EMail(""))
        assert.ok(!_.is.EMail("string"))
        assert.ok(!_.is.EMail([ "a", ]))
        assert.ok(!_.is.EMail({ "a": "n" }))
        assert.ok(!_.is.EMail(function() {}))
    })

    it("wrong format - fail", function() {
        assert.ok(!_.is.EMail("ftp://example.com"))
        assert.ok(!_.is.EMail("ftp://example.com/sub#1"))
        assert.ok(!_.is.EMail("http://example.com"))
        assert.ok(!_.is.EMail("http://example.com/sub#1"))
        assert.ok(!_.is.EMail("https://example.com"))
        assert.ok(!_.is.EMail("https://example.com/sub#1"))
        assert.ok(!_.is.EMail("example.com/hi"))
        assert.ok(!_.is.EMail("iot:xxx")); 
    })

    // a handful of emails - could be expanded
    it("good", function() {
        assert.ok(_.is.EMail("david@example.com"))
        assert.ok(_.is.EMail("david@example.net"))
        assert.ok(_.is.EMail("david@example.edu"))
        assert.ok(_.is.EMail("david@example.ca"))
        assert.ok(_.is.EMail("david@example.eu"))
        assert.ok(_.is.EMail("david@example.world"))

        assert.ok(_.is.EMail("david@subdomain.example.com"))

        assert.ok(_.is.EMail("david+subpart@example.com"))
        assert.ok(_.is.EMail("david%subpart@example.com"))
    })
})
