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
    it("works - function", function(done) {
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
})
