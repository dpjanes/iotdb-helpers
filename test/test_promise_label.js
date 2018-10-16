/*
 *  test_promise_label.js
 *
 *  David Janes
 *  IOTDB
 *  2018-10-14
 */

"use strict";

const _ = require("..")
const assert = require("assert")

/**
 */
const f1 = _.promise((self, done) => {
    _.promise.make(self)
        .validate(f1)
        .end(done)
})
f1.method = "f1"
f1.required = {
    "a": _.is.String,
}
f1.allows = {
    "b": [ _.is.String, _.is.Dictionary, 3 ],
    "c": {
        "subc": _.is.String,
    },
}

describe("promise - labeled", function() {
    describe("required", function() {
        it("missing required type", function(done) {
            _.promise.make({
            })
                .then(f1)
                .then(sd => { throw new Error("didn't expect to get here") })
                .catch(error => {
                    done(null)
                })
        })
        it("has required type", function(done) {
            _.promise.make({
                "a": "hello",
            })
                .then(f1)
                .end(done)
        })
        it("has wrong type", function(done) {
            _.promise.make({
                "a": {
                    "hello": "world",
                }
            })
                .then(f1)
                .then(sd => { throw new Error("didn't expect to get here") })
                .catch(error => {
                    done(null)
                })
        })
        it("nested wrong type", function(done) {
            _.promise.make({
                "a": "hello",
                "c": {
                    "subc": 1,
                }
            })
                .then(f1)
                .then(sd => { throw new Error("didn't expect to get here") })
                .catch(error => {
                    done(null)
                })
        })
        it("nested correct type", function(done) {
            _.promise.make({
                "a": "hello",
                "c": {
                    "subc": "Hello",
                }
            })
                .then(f1)
                .end(done)
        })
    })
})
