/*
 *  p.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-11-17
 *
 *  Copyright (2013-2020) David P. Janes
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict"

const assert = require("assert")

const asis = "asis"
const otherwise = "otherwise"
const normal = "normal"

/**
 */
const p = f => {
    const _ = require("..")

    assert.ok(f.params, "function.params must be defined")

    const wrapped = (...rest) => {
        return _.promise((self, done) => {
            _.promise(self)
                .make(sd => {
                    _.forEach(f.params, (how, key) => {
                        let value = rest.shift()

                        switch (how) {
                        case asis:
                            sd[key] = value
                            break

                        case otherwise:
                            sd[key] = _.is.Undefined(value) ? sd[key] : value 
                            break

                        case normal:
                        default:
                            if (_.is.Nullish(value)) {
                                value = sd[key]
                            } 
                            if (_.is.Undefined(value)) {
                                value = null
                            } 
                            sd[key] = value
                            break
                        }
                    })
                })
                .then(f)
                .end(done, self, f)
        })
    }

    wrapped.method = f.method + ".p"

    return wrapped
}
p.asis = asis
p.normal = normal
p.otherwise = otherwise

/**
 *  API
 */
exports.p = p
