/**
 *  lib/text.sentence.js
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

/**
 */
const split = (text, paramd) => {
    text = text
}

/**
 */
const sentence = (_text, _paramd) => {
    const self = Object.assign({})
    const _ = require("..")

    const paramd = _paramd || []
    let parts = []
    
    if (_.is.Array(_text)) {
        parts = _text
    } else if (_.is.String(_text)) {
        parts = _text
            .split(/\s/)
            .map(part => part.replace(/[^a-zA-Z0-9]*$/, ""))
    }

    self.remove = (...removes) => {
        parts = parts
            .filter(part => removes.indexOf(part) === -1)
    }

    self.extract = (...removes) => {
        const extracted = []

        parts = parts
            .filter(part => {
                if (removes.indexOf(part) === -1) {
                    return true
                }

                extracted.push(part)
                return false
            })

        return sentence(extracted, paramd)
    }

    self.join = (separator) => parts.join(_.is.Nullish(separator) ? " " : separator)

    return self
}

/*
const s = sentence("now is the time, for all good men.")
const x = s.extract("all", "is")

console.log(s.join())
console.log(x.join())
*/

/**
 *  API
 */
exports.sentence = sentence
