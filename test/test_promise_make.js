/*
 *  test_promise_make.js
 *
 *  David Janes
 *  IOTDB
 *  2017-11-18
 */

"use strict";

const _ = require("..")
const assert = require("assert")

describe("promise/make", function() {
    describe("good", function() {
        it("no arguments", function(done) {
            _.promise({})
                .make(sd => {
                    assert.ok(_.is.Undefined(sd.value))
                })
                .end(done, {})
        })
        it("dictionary", function(done) {
            _.promise({
                "value": 10,
            })
                .make(sd => {
                    assert.deepEqual(sd.value, 10);
                })
                .end(done, {})
        })
        it("asynchronous function", function(done) {
            const _change_sync = _.promise((self, done) => {
                self.value = 20;
                done(null, self);
            })

            let previous;

            _.promise({
                "value": 10,
            })
                .then(sd => {
                    previous = sd;
                    return sd;
                })
                .then(_change_sync)
                .make(sd => {
                    assert.deepEqual(sd.value, 20);
                    assert.deepEqual(previous.value, 10);
                })
                .end(done, {})
        })
        it("synchronous function", function(done) {
            const _change_async = _.promise(self => {
                self.value = 20;
            })

            let previous;

            _.promise({
                "value": 10,
            })
                .then(sd => {
                    previous = sd;
                    return sd;
                })
                .then(_change_async)
                .make(sd => {
                    assert.deepEqual(sd.value, 20);
                    assert.deepEqual(previous.value, 10);
                })
                .end(done, {})
        })
        it("'async' block", function(done) {
            const _space = async () => {
                return 20
            }

            let previous;

            _.promise({
                "value": 10,
            })
                .then(sd => {
                    previous = sd;
                    return sd;
                })
                .make(async sd => {
                    sd.value = await _space()
                })
                .make(sd => {
                    assert.deepEqual(sd.value, 20);
                    assert.deepEqual(previous.value, 10);
                })
                .end(done, {})
        })
    })
})
