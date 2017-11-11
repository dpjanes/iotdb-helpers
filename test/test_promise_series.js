/*
 *  test_promise_series.js
 *
 *  David Janes
 *  IOTDB
 *  2016-01-17
 */

"use strict";

const _ = require("iotdb-helpers")
const async = require("async")
const assert = require("assert")

describe("promise", function() {
    describe("bad", function() {
        it("inputs is an Array but no self.input_field", function(done) {
            _.promise.make({
            })
                .then(_.promise.series({
                    method: sd => sd.value * sd.value,
                    inputs: [ 1, 2, 3, 4, 5 ],
                    output_selector: result => result,
                    output_filter: result => result != 9,
                    outputs: "squares",
                }))
                .then(sd => {
                    assert.ok(false)
                })
                .catch(error => {
                    done(null);
                })

        })
    })
    describe("good", function() {
        it("method is a function", function(done) {
            _.promise.make({
                values: [ 1, 2, 3, 4, 5 ],
            })
                .then(_.promise.series({
                    method: sd => sd.value * sd.value,
                    // inputs: sd => sd.values.map(value => ({ value: value })),
                    inputs: "values:value",
                    output_selector: result => result,
                    output_filter: result => result != 9,
                    outputs: "squares",
                }))
                .then(sd => {
                    assert.deepEqual(sd.squares, [ 1, 4, 16, 25 ])
                    done()
                })
                .catch(done)
        })
        it("method is a promise", function(done) {
            const _promise = _.promise.denodeify((_self, done) => {
                const self = _.d.clone.shallow(_self)
                self.value = self.value * self.value

                done(null, self);
            })

            _.promise.make({
                values: [ 1, 2, 3, 4, 5 ],
            })
                .then(_.promise.series({
                    method: _promise,
                    inputs: "values:value",
                    output_selector: sd => sd.value,
                    output_filter: result => result != 9,
                    outputs: "squares",
                }))
                .then(sd => {
                    assert.deepEqual(sd.squares, [ 1, 4, 16, 25 ])
                    done()
                })
                .catch(done)
        })
        it("inputs is an Array (with self.input_field)", function(done) {
            _.promise.make({
            })
                .then(_.promise.series({
                    method: sd => sd.value * sd.value,
                    inputs: [ 1, 2, 3, 4, 5 ],
                    input_field: "value",
                    output_selector: result => result,
                    output_filter: result => result != 9,
                    outputs: "squares",
                }))
                .then(sd => {
                    assert.deepEqual(sd.squares, [ 1, 4, 16, 25 ])
                    done()
                })
                .catch(done)
        })
        it("inputs is function (with self.input_field)", function(done) {
            _.promise.make({
            })
                .then(_.promise.series({
                    method: sd => sd.value * sd.value,
                    inputs: sd => [ 1, 2, 3, 4, 5 ].map(value => ({ value: value })),
                    output_selector: result => result,
                    output_filter: result => result != 9,
                    outputs: "squares",
                }))
                .then(sd => {
                    assert.deepEqual(sd.squares, [ 1, 4, 16, 25 ])
                    done()
                })
                .catch(done)
        })
        it("inputs is function (without self.input_field)", function(done) {
            _.promise.make({
            })
                .then(_.promise.series({
                    method: sd => sd.value * sd.value,
                    inputs: sd => [ 1, 2, 3, 4, 5 ],
                    input_field: "value",
                    output_selector: result => result,
                    output_filter: result => result != 9,
                    outputs: "squares",
                }))
                .then(sd => {
                    assert.deepEqual(sd.squares, [ 1, 4, 16, 25 ])
                    done()
                })
                .catch(done)
        })
    })
})
