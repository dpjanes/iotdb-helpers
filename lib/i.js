/*
 *  i.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-12-07
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

/**
 *  Imediate transformation.
 *
 *  This basically wraps a function that takes a single argument, 'self'
 *  - we shallow clone self before calling
 *  - we return the shallow clone
 *
 *  So the original "f" mutates its argument, this version doesn't.
 *  This makes writing "immediate" (.i) functions a lot easier
 */
const i = f => {
    const nf = self => {
        const _ = require("..")

        self = _.d.clone(self)
        f(self)

        return self
    }
    
    // keep documentation
    ;[ "method", "description", ].forEach(key => {
        if (f[key]) {
            nf[key] = f[key]
        }
    })

    return nf
}

/**
 *  API
 */
exports.i = i
