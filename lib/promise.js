/*
 *  promise.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-02-15
 *
 *  Copyright [2013-2017] [David P. Janes]
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

"use strict";

const Q = require("q");

/**
 *  If the promise throws an error, it will be ignored
 */
const optional = (promise) => {
    const _optional = (self, done) => {
        Q(self)
            .then(promise)
            .then(sd => done(null, sd))
            .catch(error => done(null, self))
    };

    return Q.denodeify(_optional);
}

/**
 *  Condtionally chose something to run
 */
const conditional = (test, if_true, if_false) => {
    const _conditional = (self, done) => {
        let f = () => done(null, self);

        if (test(self)) {
            if (if_true) {
                f = if_true;
            }
        } else {
            if (if_false) {
                f = if_false;
            }
        }

        Q(self)
            .then(f)
            .then(sd => done(null, sd))
            .catch(error => done(error))
    }

    return Q.denodeify(_conditional)
}

exports.promise = {
    optional: optional,
    conditional: conditional,
};
