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

const Q = require("bluebird-q");
const async = require("async");

const assert = require("assert");
const path = require("path");

const _split = (self, rest) => {
    const _ = require("..");

    return _.flatten(rest.map(key => key.split(",")))
        .filter(key => key)
        .map(key => key.split(":"))
        .map(parts => parts.length === 1 ? {
            from: parts[0],
            to: path.basename(parts[0]),
            value: self ? _.d.get(self, parts[0]) : undefined,
        } : {
            from: parts[0],
            to: parts[1],
            value: self ? _.d.get(self, parts[0]) : undefined,
        })
}

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

/**
 *  Run the block of code, making sure that
 *  self becomes immutable and that exceptions
 *  are properly trapped
 *
 *  .then(_.promise.block(sd => { [some code]  }))
 */
const block = f => Q.denodeify((_self, done) => {
    const self = Object.assign({}, _self);

    f(self)

    done(null, self);
})

/**
 */
const ops_series = (_self, done) => {
    const self = Object.assign({}, _self);

    assert.ok(self.ops, "_.promise.ops_series: self.ops is required");

    async.series(self.ops, (error, results) => {
        if (error) {
            return done(error);
        }

        self.results = results; // phase out "results" in favor of "outputs"
        self.outputs = results;

        done(null, self);
    })
}

/**
 *  This will take each object in `self.inputs`,
 *  pull a value out of the input using `select.pre_selector`
 *  (typically) a string and then run the promise
 *  or function `f` on it
 */
const each = (_self, pre_selector, f, post_selector) => {
    const _ = {
        d: require("./d").d,
        is: require("./is").is,
    }
    const self = _.d.clone.shallow(_self)

    console.log("WARNING: _.promise.each depreciated: replace with _.promise.series ASAP");

    return new Promise((resolve, reject) => {
        const ops = self.inputs.map(item => inner_done => {
            Q(self)
                .then(sd => {
                    if (_.is.String(pre_selector)) {
                        sd[pre_selector] = item;
                    } else if (_.is.Function(pre_selector)) {
                        sd = Object.assign({}, sd, pre_selector(item))
                    }

                    return sd;
                })
                .then(f)
                .then(sd => {
                    if (_.is.String(post_selector)) {
                        inner_done(null, sd[post_selector])
                    } else if (_.is.Function(post_selector)) {
                        inner_done(null, post_selector(sd))
                    } else {
                        inner_done(null, sd)
                    }
                    return null;
                })
                .catch(inner_done)
        })

        async.series(ops, (error, outputs) => {
            if (error) {
                return reject(error)
                // return done(error);
            }

            self.outputs = outputs;

            // done(null, self);
            return resolve(self)
        })
    })

}

/**
 *  ***This will replace 'each' and 'ops'***
 *
 *  d.inputs - produce an array of value objects to be fed to the method.
 *             this is always composited with 'self'!
 *             there is a string version shortcut, see example below
 *  d.input_filter - will be applied to the inputs (before self merging!)
 *  d.method - the promise or function to run on each entry
 *  d.output_selector - after the method has executed, this converts whatever
 *             it produces into what the result the called really wants.
 *             if not defined, it will end up being the enter 'self' result
 *  d.output_filter - applied after the output_selector
 *  d.outputs - after everything is run, all the results (e.g. from the output_selector)
 *             are in an array and put into the variable named by "outputs".
 *          
 *  d.roll_self - if true, the "self" from the last method executed will be used
 *              as the input to the next one
 *
 *      _.promise.make({
 *          values: [ 1, 2, 3, 4, 5 ],
 *      })
 *          .then(_.promise.series({
 *              method: sd => sd.value * sd.value,
 *              // inputs: sd => sd.values.map(value => ({ value: value })),
 *              inputs: "values:value",
 *              output_selector: result => result,
 *              outputs: "squares",
 *          }))
 *          .then(sd => console.log(sd.squares))
 *          .catch(error => {
 *              console.log(error)
 *          })
 */
const series = _d => Q.denodeify((_self, done) => {
    const self = Object.assign({}, _self);
    const method = "_.promise.series";

    const d = Object.assign({}, _d);
    d.input_filter = d.input_filter || (x => true);
    d.output_filter = d.output_filter || (x => true);

    d.inputs = d.inputs || (() => ({}));
    if (typeof d.inputs === 'string') {
        const parts = d.inputs.split(":")
        assert(parts.length === 2, `${method}: if series.inputs is a string, it must look like 'from:to'`);
        const from = parts[0];
        const to = parts[1];

        d.inputs = 
            (sd => sd[from]
                .filter(d.input_filter)
                .map(value => ({ [ to ]: value }))
            )(self);
    } else if (typeof d.inputs === "function") {
        d.inputs = d.inputs(self)
            .filter(d.input_filter);

        if (d.input_field) {
            d.inputs = d.inputs.map(input => ({ [ d.input_field ]: input }))
        }
    } else if (d.input_field) {
        assert.ok(Array.isArray(d.inputs), "self.inputs must be an Array or Function if self.input_field is used")
        d.inputs = d.inputs
            .filter(d.input_filter)
            .map(input => ({ [ d.input_field ]: input }));
    } else if (Array.isArray(d.inputs)) {
        assert.ok(false, "if self.inputs is an Array, you must use self.input_field")
    } else {
        assert.ok(false, "don't know how to handle self.inputs")
    }

    // console.log("HERE:XXX", d.inputs)
    // d.inputs = Array.isArray(d.inputs) ? d.inputs : d.inputs(self);

    d.outputs = d.outputs || "outputs";
    d.method = d.method || (x => x);

    d.output_selector = d.output_selector || (x => x);
    if (typeof d.output_selector === 'string') {
        const keys = d.output_selector.split(",")
        d.output_selector = _sd => {
            const rd = {};
            keys.forEach(key => {
                const value = _sd[key];
                if (value !== void 0) {
                    rd[key] = value;
                }
            })
            return rd;
        }
    }

    let next_self = self;
    const ops = d.inputs.map(input => inner_done => {
        if (d.verbose) {
            console.log(`${method}: verbose: fetch result`);
        }

        Q(Object.assign({}, next_self, input))
            .then(d.method)
            .then(sd => {
                if (d.roll_self) {
                    next_self = sd;
                }

                inner_done(null, d.output_selector(sd))
                return null;
            })
            .catch(inner_done)
    })

    async.series(ops, (error, outputs) => {
        if (error) {
            return done(error)
        }

        self[d.outputs] = outputs.filter(d.output_filter);
        done(null, next_self)
    })
})

/**
 *  This works with "pager" type requests, such as
 *  are created by aws.dynamodb, aws.s3, mongodb, etc.
 *
 *  XXX - we need a way of "breaking" loops too
 */
const page = _d => Q.denodeify((_self, done) => {
    const self = Object.assign({}, _self);
    const method = "_.promise.page";

    assert.ok(_d.batch, `${method}: self.batch is required`)

    const d = Object.assign({}, _d);
    d.inputs = d.inputs || "jsons:json";

    let accumulator = [];

    const _run = pager => {
        if (d.verbose) {
            console.log(`${method}: verbose: fetch page`);
        }
        Q(self)
            .then(sd => {
                sd = Object.assign(sd, {
                    pager: pager,
                })
                return sd;
            })
            .then(d.batch)
            .then(series(d))
            .then(sd => {
                assert.ok(Array.isArray(sd[d.outputs]), `${method}: the outputs should always be an array`)

                accumulator = accumulator.concat(sd[d.outputs])
                
                if (sd.cursor && sd.cursor.next) {
                    process.nextTick(() => {
                        _run(sd.cursor.next)
                    })
                } else {
                    self[d.outputs] = accumulator;
                    done(null, self)
                }

                return null;
            })
            .catch(done)
    }

    _run();
})

/**
 *  Option 1:
 *      .then(_.promise.done(done))
 *
 *  Option 2:
 *      .then(_.promise.done(done, self))
 *
 *  Option 3:
 *      .then(_.promise.done(done, self, "key1,key2"))
 *
 *      - in this this case, key1 and key2 are copied from 
 *        the actual_self to a clone of self
 */
const do_done = (actual_done, optional_self, ...keys) => actual_self => {
    if (optional_self && keys) { 
        const sd = Object.assign({}, optional_self)

        _split(actual_self, keys)
            .forEach(d => {
                if (d.value !== void 0) {
                    sd[d.to] = d.value;
                } else {
                    delete sd[d.to];
                }
            });

        actual_done(null, sd)
    } else if (optional_self) {
        actual_done(null, optional_self)
    } else {
        actual_done(null, actual_self);
    }

    return null;
};

/**
 *  Wait delay seconds. If not set, 1 second.
 */
const delay = (_self, done) => {
    const self = Object.assign({}, _self);

    setTimeout(() => done(null, self), self.delay ? self.delay * 1000 : 1000)
}

const delay_p = delay => Q.denodeify((_self, done) => setTimeout(() => done(null, _self), (delay || 1) * 1000));

/**
 *  Print the message and continue
 */
const log = (message, ...rest) => sd => { 
    if (rest.length) {
        const av = [ 
            (new Date()).toISOString(),
        ];

        if (message) {
            av.push(message);
        }

        _split(sd, rest)
            .filter(d => d.value !== void 0)
            .forEach(d => {
                av.push(d.to + ":")
                av.push(d.value)
            });

        console.log.apply(console, av)
    } else {
        console.log(message)
    }
}
const timestamp = (...rest) => sd => { console.log((new Date()).toISOString(), ...rest); return sd }

/**
 *  Add data. See test cases for variants
 */
const add = (first, ...rest) => _self => {
    const method = "_.promise.add";
    const _ = {
        d: require("./d").d,
        is: require("./is").is,
    }

    if (_.is.Function(first)) {
        assert.ok(!rest.length, `${method}: Function requires no further arguments`);

        return Object.assign({}, _self, first(_self))
    } else if (_.is.String(first)) {
        assert.ok(rest.length === 1, `${method}: String requires exactly two argument`);

        let value = rest[0];
        if (_.is.Function(value)) {
            value = rest[0](Object.assign({}, _self))
        }

        return Object.assign({}, _self, {
            [ first ]: value,
        })
    } else if (_.is.Array(first)) {
        assert.ok(false, `${method}: Array is not an expected argument`);
    } else if (_.is.Function(first)) {
        assert.ok(false, `${method}: Function as first argument is not implemented - yet`)
    } else if (_.is.Object(first)) {
        assert.ok(!rest.length, `${method}: Object requires no further arguments`);

        return Object.assign({}, _self, first);
    } else {
        assert.ok(false, `${method}: unexpected expected argument: ${first}`);
    }
}


/**
 *  See tests for use cases
 */
const make = (first, ...rest) => {
    const method = "_.promise.make";
    const _ = {
        is: require("./is").is,
    }

    if (first === void 0) {
        return Q({})
    } else if (_.is.Function(first) && (first.length === 2)) {
        return Q.denodeify((_self, done) => {
            const self = Object.assign({}, _self);

            first(self, (error, next_self) => {
                if (error && !error.self) {
                    error.self = self;
                }

                done(error, next_self)
            })
        })
    } else if (_.is.Function(first) && (first.length === 1)) {
        return Q.denodeify((_self, done) => {
            const self = Object.assign({}, _self);

            try {
                first(self);

                done(null, self);
            } 
            catch (error) {
                if (error && !error.self) {
                    error.self = self;
                }

                done(error);
            }
        })
    } else if (_.is.Dictionary(first)) {
        return Q(first);
    } else {
        assert.ok(false, `${method}: unexpected expected argument: ${first}`);
    }
}

/**
 *  Shallow Clone
 */
const clone = _self => Object.assign({}, _self);

/**
 *  Deep Clone - should be rewritten
 */
clone.deep = _self => {
    const _ = {
        d: require("./d").d,
    }

    return _.d.clone.deep(_self)
}

/**
 *  Print the message AND the current _self and continue
 */
const spy = (...rest) => sd => { console.log(...rest, sd); return sd }

exports.promise = {
    clone: clone,

    optional: optional,
    conditional: conditional,

    add: add,
    denodeify: Q.denodeify,
    block: block,
    // promise: promise,

    each: each,
    series: series,
    page: page,
    ops: {
        clear: sd => { sd.ops = []; return sd },
        series: Q.denodeify(ops_series),
    },
    log: log,
    timestamp: timestamp,
    spy: spy,
    delay: Q.denodeify(delay),
    make: make,
    done: do_done,
};

exports.promise.delay.p = delay_p;
