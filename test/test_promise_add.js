/*
 *  test_promise_add.js
 *
 *  David Janes
 *  IOTDB
 *  2017-11-17
 */

"use strict";

const _ = require("..")
const assert = require("assert")

describe("promise/add", function() {
    describe("good", function() {
        it("string/value", function(done) {
            _.promise.make({
                "value": 10,
            })
                .then(_.promise.add("value", 20))
                .then(_.promise.block(sd => {
                    assert.deepEqual(sd.value, 20);
                }))
                .then(_.promise.done(done))
                .catch(done)
        })
        it("string/function", function(done) {
            _.promise.make({
                "value": 10,
            })
                .then(_.promise.add("value", sd => sd.value * 2))
                .then(_.promise.block(sd => {
                    assert.deepEqual(sd.value, 20);
                }))
                .then(_.promise.done(done))
                .catch(done)
        })
        it("object/dictionary", function(done) {
            _.promise.make({
                "value": 10,
            })
                .then(_.promise.add({
                    "value": 20,
                }))
                .then(_.promise.block(sd => {
                    assert.deepEqual(sd.value, 20);
                }))
                .then(_.promise.done(done))
                .catch(done)
        })
        it("function returning dictionary", function(done) {
            _.promise.make({
                "value": 10,
            })
                .then(_.promise.add(sd => ({
                    "value": sd.value * 20,
                })))
                .then(_.promise.block(sd => {
                    assert.deepEqual(sd.value, 200);
                }))
                .then(_.promise.done(done))
                .catch(done)
        })
    })

    describe("bad", function() {
        it("string - too few arguments", function(done) {
            _.promise.make({
                "value": 10,
            })
                .then(_.promise.add("value"))
                .then(_.promise.block(sd => {
                    assert.ok(false);
                }))
                .catch(_.promise.done(done, {}))
        })
        it("string - too many arguments", function(done) {
            _.promise.make({
                "value": 10,
            })
                .then(_.promise.add("value", 1, 2, 3))
                .then(_.promise.block(sd => {
                    assert.ok(false);
                }))
                .catch(_.promise.done(done, {}))
        })
        it("object/dictionary - too many arguments", function(done) {
            _.promise.make({
                "value": 10,
            })
                .then(_.promise.add({
                    "value": 20,
                }, 111))
                .then(_.promise.block(sd => {
                    assert.ok(false);
                }))
                .catch(_.promise.done(done, {}))
        })
        it("function returning dictionary - too many arguments", function(done) {
            _.promise.make({
                "value": 10,
            })
                .then(_.promise.add(sd => ({
                    "value": sd.value * 20,
                }), 111))
                .then(_.promise.block(sd => {
                    assert.ok(false);
                }))
                .catch(_.promise.done(done, {}))
        })
        it("undefined", function(done) {
            _.promise.make({
                "value": 10,
            })
                .then(_.promise.add())
                .then(_.promise.block(sd => {
                    assert.ok(false);
                }))
                .catch(_.promise.done(done, {}))
        })
        it("number", function(done) {
            _.promise.make({
                "value": 10,
            })
                .then(_.promise.add([ 111, 222, 333 ]))
                .then(_.promise.block(sd => {
                    assert.ok(false);
                }))
                .catch(_.promise.done(done, {}))
        })
        it("array", function(done) {
            _.promise.make({
                "value": 10,
            })
                .then(_.promise.add(111))
                .then(_.promise.block(sd => {
                    assert.ok(false);
                }))
                .catch(_.promise.done(done, {}))
        })
        it("function returning non-dictionary", function(done) {
            _.promise.make({
                "value": 10,
            })
                .then(_.promise.add(sd => null))
                .then(_.promise.block(sd => {
                    assert.ok(false);
                }))
                .catch(_.promise.done(done, {}))
        })
    })
})

