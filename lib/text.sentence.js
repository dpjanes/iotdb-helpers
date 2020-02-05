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
const sentence = (_text, _paramd) => {
    const self = Object.assign({})
    const _ = require("..")

    const paramd = _paramd || []

    const split = value => {
        if (_.is.Array(value)) {
            return value
        } else if (_.is.String(value)) {
            return value
                .split(/\s/)
                .map(part => part.replace(/[^a-zA-Z0-9]*$/, ""))
        } else {
            return []
        }
    }

    let parts = split(_text)

    self.extract = (...removes) => {
        let extracted = []

        removes = removes.map(split).filter(rs => rs.length)

        for (let li = 0; li < parts.length; li++) {
            for (let ri = 0; ri < removes.length; ri++) {
                let ok = true
                const ss = removes[ri]
                for (let si = 0; si < ss.length; si++) {
                    if (parts[li + si] !== ss[si]) {
                        ok = false
                        break
                    }
                }

                if (!ok) {
                    continue
                }

                // not 100% happy with this - because we'd like to preserve multiword
                extracted = extracted.concat(ss)
                for (let si = 0; si < ss.length; si++) {
                    parts[li + si] = null
                }

                li += ss.length - 1
            }
        }

        parts = parts.filter(part => !_.is.Empty(part))

        return sentence(extracted, paramd)
    }

    self.join = separator => parts.join(_.is.Nullish(separator) ? " " : separator)
    self.first = otherwise => parts.length ? parts[0] : otherwise || null
    self.last = otherwise => parts.length ? parts[parts.length - 1] : otherwise || null

    return self
}

/*
const s = sentence("now is the time, for all good men.")
const x = s.extract("is the time")
// const x = s.extract("is", "the", "good")

console.log(s.join())
console.log(x.join())
*/

/**
 *  API
 */
exports.sentence = sentence
