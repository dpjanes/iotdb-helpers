/*
 *  test_parameterize.js
 *
 *  David Janes
 *  IOTDB
 *  2017-11-17
 */

"use strict";

const _ = require("..")
const assert = require("assert")

describe("parameterize", function() {
    const original = {
        "value": 10,
        "json": {
            "value": 15,
        },
    } 
    const JSON = original
    const A = 122
    const B = "Hello, World"
    let captured

    const reset = _.promise(self => {
        captured = null
    })

    const capture = _.promise((self, done) => {
        _.promise(self)
            .validate(capture)
            .make(sd => {
                captured = _.d.clone(sd)

                if (_.is.Undefined(sd.a)) {
                    sd.a = "A-UNDEF"
                }
                if (_.is.Undefined(sd.b)) {
                    sd.b = "B-UNDEF"
                }
            })
            .end(done, self, capture)
    })
    capture.produces = {
        a: _.is.Anything,
        b: _.is.Anything,
    }

    it("reset/capture works", function(done) {
        _.promise({
            a: 1,
        })
            .then(reset)
            .make(sd => {
                assert.deepEqual(captured, null)
            })
            .then(capture)
            .make(sd => {
                assert.deepEqual(captured, { a: 1 })
            })
            .end(done)

    })
    it("no arguments - b should become null", function(done) {
        capture.params = {
            "a": null,
            "b": null,
        }
        capture.p = _.p(capture)

        _.promise({
            a: 1,
        })
            .then(reset)
            .then(capture.p())
            .make(sd => {
                assert.deepEqual(captured, { a: 1, b: null })
                assert.deepEqual(sd, { a: 1, b: null })
            })
            .end(done)

    })
    it("null arguments - a/b should become null", function(done) {
        capture.params = {
            "a": _.p.normal,
            "b": _.p.normal,
        }
        capture.p = _.p(capture)

        _.promise({
            a: 1,
        })
            .then(reset)
            .then(capture.p(null, null))
            .make(sd => {
                assert.deepEqual(captured, { a: null, b: null })
                assert.deepEqual(sd, { a: null, b: null })
            })
            .end(done)

    })
    it("normal arguments", function(done) {
        capture.params = {
            "a": _.p.normal,
            "b": _.p.normal,
        }
        capture.p = _.p(capture)

        _.promise({
            a: 1,
        })
            .then(reset)
            .then(capture.p("a", "b"))
            .make(sd => {
                assert.deepEqual(captured, { a: "a", b: "b" })
                assert.deepEqual(sd, { a: "a", b: "b" })
            })
            .end(done)

    })
    it("asis", function(done) {
        capture.params = {
            "a": _.p.asis,
            "b": _.p.asis,
        }
        capture.p = _.p(capture)

        _.promise({
            a: 1,
        })
            .then(reset)
            .then(capture.p())
            .make(sd => {
                assert.deepEqual(captured, { a: undefined, b: undefined })
                assert.deepEqual(sd, { a: "A-UNDEF", b: "B-UNDEF" })
            })
            .end(done)

    })
    it("otherwise", function(done) {
        capture.params = {
            "a": _.p.otherwise,
            "b": _.p.otherwise,
        }
        capture.p = _.p(capture)

        _.promise({
            a: 1,
        })
            .then(reset)
            .then(capture.p())
            .make(sd => {
                assert.deepEqual(captured, { a: 1, b: undefined })
                assert.deepEqual(sd, { a: 1, b: "B-UNDEF" })
            })
            .end(done)

    })
})
