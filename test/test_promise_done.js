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

describe("promise/done", function() {
    const original = {
        "value": 10,
        "json": {
            "value": 15,
        },
    } 

    describe("old-way", function() {
        it("sd", function(done) {
            const my_done = (error, self) => {
                assert.deepEqual(self.value, original.value)
                assert.deepEqual(self.json, original.json)

                done(error)
            }

            _.promise.make(original)
                .then(_.promise.done(my_done))
                .catch(done)
        })
        it("sd with change", function(done) {
            const my_done = (error, self) => {
                assert.deepEqual(self.value, 20)
                assert.deepEqual(self.json, original.json)

                done(error)
            }

            _.promise.make(original)
                .then(_.promise.add("value", 20))
                .then(_.promise.done(my_done))
                .catch(done)
        })
        it("self", function(done) {
            const my_done = (error, self) => {
                assert.deepEqual(self.value, original.value)
                assert.deepEqual(self.json, original.json)

                done(error)
            }

            _.promise.make(original)
                .then(_.promise.done(my_done, original))
                .catch(done)
        })
        it("self with change", function(done) {
            const my_done = (error, self) => {
                assert.deepEqual(self.value, original.value)
                assert.deepEqual(self.json, original.json)

                done(error)
            }

            _.promise.make(original)
                .then(_.promise.add("value", 20))
                .then(_.promise.done(my_done, original))
                .catch(done)
        })
        it("self with variable", function(done) {
            const my_done = (error, self) => {
                assert.deepEqual(self.value, 30); // original.value)
                assert.deepEqual(self.json, original.json)

                done(error)
            }

            _.promise.make(original)
                .then(_.promise.add("value", 30))
                .then(_.promise.done(my_done, original, "value"))
                .catch(done)
        })
        it("self with nested variable", function(done) {
            const my_done = (error, self) => {
                assert.deepEqual(self.value, original.json.value)
                assert.deepEqual(self.json, original.json)

                done(error)
            }

            _.promise.make(original)
                .then(_.promise.add("value", 30))
                .then(_.promise.done(my_done, original, "json/value"))
                .catch(done)
        })
        it("self with nested variable and rename", function(done) {
            const my_done = (error, self) => {
                assert.deepEqual(self.value, original.value)
                assert.deepEqual(self.v2, original.json.value)
                assert.deepEqual(self.json, original.json)

                done(error)
            }

            _.promise.make(original)
                .then(_.promise.add("value", 30))
                .then(_.promise.done(my_done, original, "json/value:v2"))
                .catch(done)
        })
        it("self with multiple arguments", function(done) {
            const my_done = (error, self) => {
                assert.deepEqual(self.value, original.value)
                assert.deepEqual(self.nvalue, original.value)
                assert.deepEqual(self.json, original.json)
                assert.deepEqual(self.njson, original.json)

                done(error)
            }

            _.promise.make(original)
                .then(_.promise.done(my_done, original, "json:njson", "value:nvalue"))
                .catch(done)
        })
        it("self with comma arguments", function(done) {
            const my_done = (error, self) => {
                assert.deepEqual(self.value, original.value)
                assert.deepEqual(self.nvalue, original.value)
                assert.deepEqual(self.json, original.json)
                assert.deepEqual(self.njson, original.json)

                done(error)
            }

            _.promise.make(original)
                .then(_.promise.done(my_done, original, "json:njson,value:nvalue"))
                .catch(done)
        })
    })
    describe("new-way", function() {
        it("sd", function(done) {
            const my_done = (error, self) => {
                assert.deepEqual(self.value, original.value)
                assert.deepEqual(self.json, original.json)

                done(error)
            }

            _.promise(original)
                .end(my_done)
        })
        it("sd with change", function(done) {
            const my_done = (error, self) => {
                assert.deepEqual(self.value, 20)
                assert.deepEqual(self.json, original.json)

                done(error)
            }

            _.promise(original)
                .add("value", 20)
                .end(my_done)
        })
        it("self", function(done) {
            const my_done = (error, self) => {
                assert.deepEqual(self.value, original.value)
                assert.deepEqual(self.json, original.json)

                done(error)
            }

            _.promise(original)
                .end(my_done, original)
        })
        it("self with change", function(done) {
            const my_done = (error, self) => {
                assert.deepEqual(self.value, original.value)
                assert.deepEqual(self.json, original.json)

                done(error)
            }

            _.promise(original)
                .add("value", 20)
                .end(my_done, original)
        })
        it("self with variable", function(done) {
            const my_done = (error, self) => {
                assert.deepEqual(self.value, 30); // original.value)
                assert.deepEqual(self.json, original.json)

                done(error)
            }

            _.promise(original)
                .add("value", 30)
                .end(my_done, original, "value")
        })
        it("self with nested variable", function(done) {
            const my_done = (error, self) => {
                assert.deepEqual(self.value, original.json.value)
                assert.deepEqual(self.json, original.json)

                done(error)
            }

            _.promise(original)
                .add("value", 30)
                .end(my_done, original, "json/value")
        })
        it("self with nested variable and rename", function(done) {
            const my_done = (error, self) => {
                assert.deepEqual(self.value, original.value)
                assert.deepEqual(self.v2, original.json.value)
                assert.deepEqual(self.json, original.json)

                done(error)
            }

            _.promise(original)
                .add("value", 30)
                .end(my_done, original, "json/value:v2")
        })
        it("self with multiple arguments", function(done) {
            const my_done = (error, self) => {
                assert.deepEqual(self.value, original.value)
                assert.deepEqual(self.nvalue, original.value)
                assert.deepEqual(self.json, original.json)
                assert.deepEqual(self.njson, original.json)

                done(error)
            }

            _.promise(original)
                .end(my_done, original, "json:njson", "value:nvalue")
        })
        it("self with comma arguments", function(done) {
            const my_done = (error, self) => {
                assert.deepEqual(self.value, original.value)
                assert.deepEqual(self.nvalue, original.value)
                assert.deepEqual(self.json, original.json)
                assert.deepEqual(self.njson, original.json)

                done(error)
            }

            _.promise(original)
                .end(my_done, original, "json:njson,value:nvalue")
        })
    })
})
