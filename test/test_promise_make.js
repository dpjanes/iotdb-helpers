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
        it("dictionary", function(done) {
            _.promise.make({
                "value": 10,
            })
                .then(_.promise.block(sd => {
                    assert.deepEqual(sd.value, 10);
                }))
                .then(_.promise.done(done))
                .catch(done)
        })
        it("asynchronous function", function(done) {
            const _change_sync = _.promise.make((self, done) => {
                self.value = 20;
                done(null, self);
            })

            let previous;

            _.promise.make({
                "value": 10,
            })
                .then(sd => {
                    previous = sd;
                    return sd;
                })
                .then(_change_sync)
                .then(_.promise.block(sd => {
                    assert.deepEqual(sd.value, 20);
                    assert.deepEqual(previous.value, 10);
                }))
                .then(_.promise.done(done))
                .catch(done)
        })
        it("synchronous function", function(done) {
            const _change_async = _.promise.make(self => {
                self.value = 20;
            })

            let previous;

            _.promise.make({
                "value": 10,
            })
                .then(sd => {
                    previous = sd;
                    return sd;
                })
                .then(_change_async)
                .then(_.promise.block(sd => {
                    assert.deepEqual(sd.value, 20);
                    assert.deepEqual(previous.value, 10);
                }))
                .then(_.promise.done(done))
                .catch(done)
        })
    })
})
