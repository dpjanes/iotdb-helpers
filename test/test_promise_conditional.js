/*
 *  test_promise_add.js
 *
 *  David Janes
 *  IOTDB
 *  2017-12-16
 */

"use strict";

const _ = require("..")
const assert = require("assert")

describe("promise/conditional", function() {
    describe("immediate", function() {
        describe("static", function() {
            it("[true]/false", function(done) {
                let go = null;

                _.promise.make({
                    "value": 10,
                })
                    .then(_.promise.conditional(true, () => go = true, () => go = false))
                    .then(_.promise.block(sd => {
                        assert.strictEqual(go, true)
                    }))
                    .then(_.promise.done(done))
                    .catch(done)
            })
            it("true/[false]", function(done) {
                let go = null;

                _.promise.make({
                    "value": 10,
                })
                    .then(_.promise.conditional(false, () => go = true, () => go = false))
                    .then(_.promise.block(sd => {
                        assert.strictEqual(go, false)
                    }))
                    .then(_.promise.done(done))
                    .catch(done)
            })
            it("[]/false", function(done) {
                let go = null;

                _.promise.make({
                    "value": 10,
                })
                    .then(_.promise.conditional(true, null, () => go = false))
                    .then(_.promise.block(sd => {
                        assert.strictEqual(go, null)
                    }))
                    .then(_.promise.done(done))
                    .catch(done)
            })
            it("true/[]", function(done) {
                let go = null;

                _.promise.make({
                    "value": 10,
                })
                    .then(_.promise.conditional(false, () => go = true, null))
                    .then(_.promise.block(sd => {
                        assert.strictEqual(go, null)
                    }))
                    .then(_.promise.done(done))
                    .catch(done)
            })
        })
        describe("flow", function() {
            it("[true]/false", function(done) {
                let go = null;

                _.promise.make({
                    "value": 10,
                })
                    .then(_.promise.conditional(sd => sd.value > 5, () => go = true, () => go = false))
                    .then(_.promise.block(sd => {
                        assert.strictEqual(go, true)
                    }))
                    .then(_.promise.done(done))
                    .catch(done)
            })
            it("true/[false]", function(done) {
                let go = null;

                _.promise.make({
                    "value": 10,
                })
                    .then(_.promise.conditional(sd => sd.value > 15, () => go = true, () => go = false))
                    .then(_.promise.block(sd => {
                        assert.strictEqual(go, false)
                    }))
                    .then(_.promise.done(done))
                    .catch(done)
            })
            it("[]/false", function(done) {
                let go = null;

                _.promise.make({
                    "value": 10,
                })
                    .then(_.promise.conditional(sd => sd.value > 5, null, () => go = false))
                    .then(_.promise.block(sd => {
                        assert.strictEqual(go, null)
                    }))
                    .then(_.promise.done(done))
                    .catch(done)
            })
            it("true/[]", function(done) {
                let go = null;

                _.promise.make({
                    "value": 10,
                })
                    .then(_.promise.conditional(sd => sd.value > 15, () => go = true, null))
                    .then(_.promise.block(sd => {
                        assert.strictEqual(go, null)
                    }))
                    .then(_.promise.done(done))
                    .catch(done)
            })
        })
    })
    describe("promises", function() {
        it("[true]/false", function(done) {
            const do_true = _.promise.make((self, done) => {
                self.go = true;
                done(null, self);
            })
            const do_false = _.promise.make((self, done) => {
                self.go = false;
                done(null, self);
            })

            _.promise.make({
                "value": 10,
            })
                .then(_.promise.conditional(true, do_true, do_false))
                .then(_.promise.block(sd => {
                    assert.strictEqual(sd.go, true)
                }))
                .then(_.promise.done(done))
                .catch(done)
        })
        it("true/[false]", function(done) {
            const do_true = _.promise.make((self, done) => {
                self.go = true;
                done(null, self);
            })
            const do_false = _.promise.make((self, done) => {
                self.go = false;
                done(null, self);
            })

            _.promise.make({
                "value": 10,
            })
                .then(_.promise.conditional(false, do_true, do_false))
                .then(_.promise.block(sd => {
                    assert.strictEqual(sd.go, false)
                }))
                .then(_.promise.done(done))
                .catch(done)
        })
    })
})
