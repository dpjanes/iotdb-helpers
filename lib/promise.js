/*
 *  promise.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-02-15
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

"use strict";

const Q = require("bluebird-q")
const async = require("async")

const assert = require("assert")
const path = require("path")

const v = require("./validate")

const _split = (self, rest) => {
    const _ = require("..");

    return _.flatten(
            rest
                .filter(key => _.is.String(key))
                .map(key => key.split(","))
            )
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
 *  Call 'f'. If it succeeds, continue as normal. 
 *  Otherwise, call the checker with the `error`
 *  and if it it fails, throw the error. If there is
 *  no checker or the the checker returns `true`,
 *  ignore the error
 */
const optional = (f, checker) => Q.denodeify((self, done) => {
    Q(self)
        .then(f)
        .then(sd => {
            done(null, sd)
            return null;
        })
        .catch(error => {
            error.self = self;
            if (checker && !checker(error)) {
                return done(error);
            }

            done(null, self);
        })
})

/**
 *  Condtionally chose something to run
 */
const conditional = (test, if_true, if_false) => Q.denodeify((self, done) => {
    let call;

    if ((typeof test === "function") ? test(self) : !!test) {
        call = if_true;
    } else {
        call = if_false;
    }

    Q(self)
        .then(call || (sd => sd))
        .then(sd => {
            done(null, sd)
            return null;
        })
        .catch(done);
});

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
 *  ***This will replace 'each' and 'ops'***
 *
 *  d.inputs - produce an array of value objects to be fed to the method.
 *             this is always composited with 'self'!
 *             there is a string version shortcut, see example below
 *  d.n - number to run at once
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
    const _ = require("..")

    const d = Object.assign({}, _d);
    d.input_filter = d.input_filter || (x => true);
    d.output_filter = d.output_filter || (x => true);
    d.n = d.n || 1

    d.inputs = d.inputs || (() => ({}));
    if (typeof d.inputs === 'string') {
        const parts = d.inputs.split(":")
        assert(parts.length === 2, `${method}: if series.inputs is a string, it must look like 'from:to'`);
        const from = parts[0];
        const to = parts[1];

        d.inputs = 
            (sd => _.d.get(sd, from, [])
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
    const ops = d.inputs.map((input, index) => inner_done => {
        if (d.verbose) {
            console.log(`${method}: verbose: fetch result`);
        }

        const counter = {}
        if (d.index) {
            counter[d.index] = index
        }

        Q(Object.assign({}, next_self, input, counter))
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

    const _on_result = (error, outputs) => {
        if (error) {
            return done(error)
        }

        next_self[d.outputs] = outputs.filter(d.output_filter);

        if (d.output_flatten) {
            next_self[d.outputs] = _.flatten(next_self[d.outputs])
        }

        done(null, next_self)
    }

    if (d.n > 1) {
        async.parallelLimit(ops, d.n, _on_result)
    } else {
        async.series(ops, _on_result)
    }
})

/**
 *  This works with "pager" type requests, such as
 *  are created by aws.dynamodb, aws.s3, mongodb, etc.
 *
 *  XXX - we need a way of "breaking" loops too
 *
 *  d.output_limit (number) - try to hit a maximum of this many results
 *  d.output_extend (boolean) - keep adding to self[d.outputs] if it exists
 */
const page = _d => Q.denodeify((_self, done) => {
    const self = Object.assign({}, _self);
    const method = "_.promise.page";

    assert.ok(_d.batch, `${method}: self.batch is required`)

    const d = Object.assign({}, _d);
    d.inputs = d.inputs || "jsons:json";
    d.output_limit = d.output_limit || Number.MAX_SAFE_INTEGER;

    let rolling_self = self;

    let accumulator = [];
    if (d.output_extend) {
        accumulator = self[d.outputs] || []
    }

// console.log("HERE:A.start")
    const _run = pager => {
// console.log("HERE:A.run", pager)
        if (d.verbose) {
            console.log(`${method}: verbose: fetch page`);
        }

        Q(rolling_self)
            .then(sd => {
                sd = Object.assign(sd, {
                    pager: pager || null,
                })
                return sd;
            })
            .then(d.batch)
            .then(d.method ? series(d) : sd => sd)
            .then(sd => {
// console.log("HERE:B", sd.cursor)
                if (d.outputs) {
                    assert.ok(Array.isArray(sd[d.outputs]), `${method}: the outputs should always be an array`)
                    sd[d.outputs].forEach(o => accumulator.push(o))
                }
                
                rolling_self = self;
                if (d.roll_self) {
                    rolling_self = sd;
                }

                return sd
            })
            .then(d.page ? d.page : sd => sd)
            .then(sd => {
                let again = false
                if (sd.cursor && sd.cursor.next) {
                    again = true
                }

                if (accumulator.length >= d.output_limit) {
                    again = false
                }

                if (again) {
                    process.nextTick(() => {
                        _run(sd.cursor.next)
                    })
                } else {
                    if (d.outputs) {
                        rolling_self[d.outputs] = accumulator;
                    }

                    done(null, rolling_self)
                }

                return null;
            })
            .catch(done)
    }

    _run();
})

/**
 *  This will retry the method 
 */
const retry = _d => Q.denodeify((_self, done) => {
    const self = Object.assign({}, _self);
    const method = "_.promise.retry";

    assert.ok(_d.method, `${method}: d.method is required`)

    const d = Object.assign({
        retries: 4,
        delay: 1,
        test: error => true,
    }, _d)

    let count = 0

    const _doit = () => {
        count++

        Q(self)
            .then(d.method)
            .then(sd => {
                done(null, sd)
                return null
            })
            .catch(error => {
                if (count > d.retries) {
                    return done(error)
                }

                if (!d.test(error)) {
                    return done(error)
                }

                if (d.verbose || self.verbose) {
                    console.log(`${method}: verbose: will retry ${count}`)
                }

                setTimeout(_doit, d.delay * 1000)
            })
    }

    _doit()
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
    assert.ok(typeof actual_done === 'function', 
        "_.promise.done: first argument is not a function, likely you've swapped the first two arguments")

    if (optional_self && keys) { 
        const sd = Object.assign({}, optional_self)
        const _ = require("..")

        if (keys[0] && keys[0].produces) {
            const f = keys[0]

            _.forEach(f.produces, (_ignore, key) => {
                const value = actual_self[key]
                if (_.is.Undefined(value)) {
                    assert.ok(false, `_.promise.done: ${key} is required to be a value`)
                } else if (_.is.Null(value)) {
                    sd[key] = null
                } else {
                    sd[key] = actual_self[key]
                }
            })

            if (!f.__out) {
                f.__out = [].concat(
                    v.flatten(f.produces || {}, false),
                )
            }

            v.validate(sd, f, f.__out)
        } else {
            _split(actual_self, keys)
                .forEach(d => {
                    if (d.value !== void 0) {
                        _.d.set(sd, d.to, d.value);
                        // self[d.to] = d.value;
                    } else {
                        _.d.delete(sd, d.to)
                        // delete sd[d.to];
                    }
                });
        }

        actual_done(null, sd)
    } else if (optional_self) {
        actual_done(null, optional_self)
    } else {
        actual_done(null, actual_self);
    }

    return null;
};

/**
 *  Process.nextTick
 */
const tick = (self, done) => {
    process.nextTick(() => {
        done(null, self)
    })
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
const log = (message, ...rest) => self => { 
    const av = [ 
        (new Date()).toISOString(),
    ];

    if (message) {
        av.push(message);
    }

    _split(self, rest)
        .filter(d => d.value !== void 0)
        .forEach(d => {
            av.push(d.to + ":")
            try {
                av.push(JSON.stringify(d.value, null, 2))
            }
            catch (error) {
                av.push(d.value)
            }
        });

    console.log.apply(console, av)

    return self;
}
const timestamp = (...rest) => self => { console.log((new Date()).toISOString(), ...rest); return self }

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
        if (rest.length === 0) {
            const self = Object.assign({}, _self)

            _split(_self, [ first ])
                .forEach(d => {
                    if (d.value !== void 0) {
                        _.d.set(self, d.to, d.value);
                        // self[d.to] = d.value;
                    } else {
                        _.d.delete(self, d.to)
                        // delete self[d.to];
                    }
                });

            return self;
        } else if (rest.length === 1) {
            let value = rest[0];
            if (_.is.Function(value)) {
                value = rest[0](Object.assign({}, _self))
            }

            return Object.assign({}, _self, {
                [ first ]: value,
            })
        } else {
            assert.ok(false, `${method}: String requires exactly one or two arguments`);
        }
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

const _rebind = q => {
    q.then = (...rest) => {
        if (rest[0] === void 0) {
            // console.log("#", "_rebind: _.promise.then() invoked with undefined first argument")
        }

        return _rebind(q._then(...rest))
    }
    q.add = (...rest) => _rebind(q.then(add(...rest)))
    q.validate = (...rest) => _rebind(q.then(validate.promise(...rest)))
    q.make = (...rest) => _rebind(q.then(make(...rest)))
    q.each = (...rest) => _rebind(q.then(series(...rest)))
    q.page = (...rest) => _rebind(q.then(page(...rest)))
    q.log = (...rest) => _rebind(q.then(log(...rest)))
    q.conditional = (...rest) => _rebind(q.then(conditional(...rest)))
    q.end = (...rest) => _rebind(q.catch(unbail).then(do_done(...rest)).catch(rest[0]))
    q.except = (...rest) => _rebind(q.catch(...rest))

    return q
}

/**
 */
const validate = (self, f) => {
    if (self.trace) {
        self.__trace = [].concat(self.__trace || [], [ {
            method: f.method || f.name || "unknown",
            module: f.module || "unknown",
        }])

        if (f.method) {
            console.log("!", f.method)
        }
    }

    if (!f.__in) {
        f.__in = [].concat(
            v.flatten(f.required || {}, true),
            v.flatten(f.requires || {}, true),
            v.flatten(f.accepts || {}, false),
        )
    }

    v.validate(self, f, f.__in)
}

/**
 *  Normally use .validate() but if you need
 *  the promise her it is
 */
validate.promise = f => self => {
    validate(self, f);
    return self
}

/**
 *  See tests for use cases
 */
const make = (first, ...rest) => {
    const method = "_.promise.make";
    const _ = {
        is: require("./is").is,
    }

    /* -- for deep tracking errors --
    const where = {}
    Error.captureStackTrace(where); 
    */

    if (first === void 0) {
        return _rebind(Q({}))
    } else if (_.is.Function(first) && (first.length === 2)) {
        return Q.denodeify((_self, done) => {
            const self = Object.assign({}, _self);

            first(self, (error, next_self) => {
                if (error && !error.self) {
                    error.self = self;
                }
            
                /* -- for deep tracking errors --
                if (error && !(error instanceof Error)) {
                    console.log("====")
                    console.log("HERE:PROMISE", where.stack)
                    console.log("====")
                    console.trace()
                    console.log("====")
                    
                    setTimeout(() => process.exit(), 5 * 1000)
                }
                */

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
        return _rebind(Q(first));
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


const BAIL = {};

const bail = _self => {
    const error = new Error();
    error.self = _self;
    error.__bail = BAIL;

    throw error;
};

const bail_conditional = condition => _self => {
    const _ = {
        is: require("./is").is,
    }

    if (_.is.Function(condition)) {
        condition = condition(_self)
    }

    if (condition) {
        return bail(_self)
    } else {
        return _self;
    }
}

const unbail = error => {
    if (error.__bail === BAIL) {
        return error.self;
    } else {
        throw error;
    }
};

/**
 *  .then(_.promise.time(something, "message"))
 */
const time = (f, message) => Q.denodeify((_self, done) => {
    const start = new Date();

    Q(_self)
        .then(f)
        .then(sd => {
            const end = new Date()
            console.log("-", end.toISOString(), message, "delta:", (end.getTime() - start.getTime()) / 1000)

            done(null, sd)
            return null
        })
        .catch(error => {
            const end = new Date()
            console.log("#", end.toISOString(), message, "delta:", (end.getTime() - start.getTime()) / 1000)

            done(error)
        })
});

/**
 *  API
 */
exports.promise = make
exports.promise.clone = clone

exports.promise.optional = optional
exports.promise.conditional = conditional

exports.promise.add = add
exports.promise.denodeify = Q.denodeify
exports.promise.block = block

exports.promise.validate = validate
exports.promise.series = series
exports.promise.parallel = series
exports.promise.retry = retry
exports.promise.page = page
exports.promise.log = log
exports.promise.timestamp = timestamp
exports.promise.tick = Q.denodeify(tick)
exports.promise.delay = Q.denodeify(delay)
exports.promise.delay.p = delay_p
exports.promise.make = make
exports.promise.done = do_done
exports.promise.bail = bail
exports.promise.bail.conditional = bail_conditional
exports.promise.unbail = unbail
exports.promise.time = time
exports.promise.noop = self => self
