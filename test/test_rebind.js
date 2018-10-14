/*
 *  test_promise_rebind.js
 *
 *  David Janes
 *  IOTDB
 *  2018-10-14
 */

"use strict";

const _ = require("..")
const assert = require("assert")

describe("promise/make (rebind)", function() {
    describe("add", function() {
        it("dictionary", function(done) {
            _.promise.make({})
                .add({
                    hello: "world",
                })
                .then(_.promise.make(sd => {
                    assert.deepEqual(sd, {
                        hello: "world",
                    })
                }))
                .then(_.promise.done(done))
                .catch(done)
        })
        it("two arguments", function(done) {
            _.promise.make({})
                .add("hello", "world-2")
                .then(_.promise.make(sd => {
                    assert.deepEqual(sd, {
                        hello: "world-2",
                    })
                }))
                .then(_.promise.done(done))
                .catch(done)
        })
        it("function", function(done) {
            _.promise.make({
                other: "world-3",
            })
                .add(sd => ({
                    hello: sd.other,
                }))
                .then(_.promise.make(sd => {
                    assert.deepEqual(sd, {
                        other: "world-3",
                        hello: "world-3",
                    })
                }))
                .then(_.promise.done(done))
                .catch(done)
        })
    })
    describe("all-up", function() {
        it("dictionary", function(done) {
            _.promise({
                a: 1,
                b: 2,
            })
                .add({
                    hello: "world",
                })
                .make(sd => {
                    sd.world = "3"
                })
                .make(sd => {
                    assert.deepEqual(sd, { a: 1, b: 2, hello: 'world', world: '3' })
                })
                .end(done)
        })
    })
})
