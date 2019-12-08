/*
 *  test/test_promise_wrap.js
 *
 *  David Janes
 *  IOTDB
 *  2019-12-08
 */

"use strict";

const _ = require("..")
const assert = require("assert")
const fs = require("fs")

describe("promise/wrap", function() {
    it("works - implicit", function(done) {
        _.promise({
            path: __dirname,
            paths: null,
        })
            .wrap(fs.readdir, "path", "paths")
            .make(sd => {
                assert.ok(_.is.Array(sd.paths))
                assert.ok(sd.paths.length)
            })
            .end(done)

    })
    it("works - explicit", function(done) {
        _.promise({
            path: __dirname,
            paths: null,
        })
            .wrap(fs.readdir, [ __dirname ], "paths")
            .make(sd => {
                assert.ok(_.is.Array(sd.paths))
                assert.ok(sd.paths.length)
            })
            .end(done)

    })
})
