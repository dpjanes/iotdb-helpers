/*
 *  conditional.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-01-08
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const Q = require("q");

/**
 *  Use me as follows:
 *
 *  Q({})
 *      .then(_.conditional(_self => _self.must_be_true, promise_or_function_to_run_if_true))
 *
 */
const conditional = (test, if_true, if_false) => (self, done) => {
    if (test(self)) {
        if (if_true) {
            if_true(self, done)
        } else {
            done(null, self);
        }
    } else {
        if (if_false) {
            if_false(self, done)
        } else {
            done(null, self);
        }
    }
};

/**
 *  API
 */
exports.conditional = Q.denodeify(conditional);
