/*
 *  test_promise_end.js
 *
 *  David Janes
 *  IOTDB
 *  2017-11-17
 */

"use strict";

const _ = require("..")
const assert = require("assert")

describe("promise/end", function() {
    const original = {
        "value": 10,
        "json": {
            "value": 15,
        },
    } 
    const JSON = original
    const A = 122
    const B = "Hello, World"


    it("works", function(done) {
        const _wrap_done = (error, self) => {
            if (error) {
                return done(error)
            }

            try {
                assert.deepEqual(self.json, JSON)
                assert.strictEqual(self.a, A)
                assert.strictEqual(self.b, B)
            } catch (x) {
                return done(x)
            }

            done(null)
        }

        const self = {}
        const something = () => {}
        something.produces = {
            json: _.is.JSON,
            a: _.is.Number,
            b: _.is.String,
        }

        _.promise(self)
            .make(sd => {
                sd.json = JSON
                sd.a = A
                sd.b = B
            })
            .end(_wrap_done, self, something)
    })
    it("allows nulls", function(done) {
        const _wrap_done = (error, self) => {
            if (error) {
                return done(error)
            }

            try {
                assert.strictEqual(self.json, null)
                assert.strictEqual(self.a, null)
                assert.strictEqual(self.b, null)
            } catch (x) {
                return done(x)
            }

            done(null)
        }

        const self = {}
        const something = () => {}
        something.produces = {
            json: _.is.JSON,
            a: _.is.Number,
            b: _.is.String,
        }

        _.promise(self)
            .make(sd => {
                sd.json = null
                sd.a = null
                sd.b = null
            })
            .end(_wrap_done, self, something)
    })
    it("undefined is exception", function(done) {
        const _wrap_done = (error, self) => {
            if (error) {
                return done(null)
            }

            done(new Error("expected an exception"))
        }

        const self = {}
        const something = () => {}
        something.produces = {
            json: _.is.JSON,
            a: _.is.Number,
            b: _.is.String,
        }

        _.promise(self)
            .make(sd => {
            })
            .end(_wrap_done, self, something)
    })
    it("bad value is exception", function(done) {
        const _wrap_done = (error, self) => {
            if (error) {
                return done(null)
            }

            done(new Error("expected an exception"))
        }

        const self = {}
        const something = () => {}
        something.produces = {
            json: _.is.JSON,
            a: _.is.Number,
            b: _.is.String,
        }

        _.promise(self)
            .make(sd => {
                sd.json = JSON
                sd.a = A
                sd.b = 839389
            })
            .end(_wrap_done, self, something)
    })
})
