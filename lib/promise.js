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

const assert = require("assert")
const path = require("path")

/**
 *  replaces Q({})
 */
const q_wrap = o => {
    const h = new Promise((resolve, reject) => {
        resolve(o)
    })

    h._then = h.then
    h._catch = h.catch

    return h
}

/**
 *  replaces Q.denodeify
 */
const q_denodeify = f => {
    return self => {
        const h = new Promise((resolve, reject) => {
            f(self, (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            })
        })

        h._then = h.then
        h._catch = h.catch

        return h
    }
}

/**
 */
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
const optional = (f, checker) => q_denodeify((self, done) => {
    q_wrap(self)
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
const conditional = (test, if_true, if_false) => q_denodeify((self, done) => {
    let call;

    if ((typeof test === "function") ? test(self) : !!test) {
        call = if_true;
    } else {
        call = if_false;
    }

    q_wrap(self)
        .then(call || (sd => sd))
        .then(sd => {
            done(null, sd)
            return null;
        })
        .catch(done);
});

/**
 */
const _async = (call, after) => q_denodeify((self, done) => {
    done(null, self)

    q_wrap(self)
        .then(call || (sd => sd))
        .then(sd => {
            if (after) {
                after(null, sd)
            }
        })
        .catch(error => {
            if (after) {
                after(error)
            }
        })
});

/**
 *  Run the block of code, making sure that
 *  self becomes immutable and that exceptions
 *  are properly trapped
 *
 *  .then(_.promise.block(sd => { [some code]  }))
 */
const block = f => q_denodeify((_self, done) => {
    const self = Object.assign({}, _self);

    f(self)

    done(null, self);
})

/**
 *  rx integration
 */
const observe = _paramd => q_denodeify((_self, done) => {
    const self = Object.assign({}, _self)
    const method = "_.promise.observe"
    const _ = require("..")
    const rx = require("rxjs")
    const rxops = require("rxjs/operators")

    const paramd = Object.assign({}, _paramd);
    paramd.input_filter = paramd.input_filter || (x => true);
    paramd.n = paramd.n || 1
    paramd.wait = !!paramd.wait

    if (!_.is.String(paramd.inputs)) {
        assert.ok(false, `${method}: observe.inputs must be a String`)
    }

    // we could be more flexible here and let a string do the work?
    assert.ok(_.is.Function(paramd.method), `${method}: observe.method must be a Function`)

    const parts = paramd.inputs.split(":")
    assert(parts.length === 2, `${method}: observe.inputs must look like "from:to"`)
    const input_from = parts[0]
    const input_to = parts[1]

    const observable = _.d.first(self, input_from)
    assert.ok(_.is.rx.Observable(observable), `${method}: observe.inputs="${input_from}" must point to an Observable`)

    const _worker = x => new rx.Observable(subscriber => {
        _.d.set(self, input_to, x)

        _.promise(self)
            .then(paramd.method)
            .make(sd => {
                subscriber.next(x)
                subscriber.complete()
            })
            .except(error => {
                if (_.is.Function(paramd.error)) {
                    error.self = self
                    paramd.error(error, self)

                    subscriber.complete()
                } else {
                    console.log("#", method, _.error.message(error))
                    subscriber.error(error)
                }
            })
    })

    const subscription = observable
        .pipe(
            rxops.filter(paramd.input_filter),
            rxops.concatMap(_worker),
        )
        .subscribe(
            x => {},
            error => done(error),
            () => done(null, self),
        )

    if (paramd.subscription) {
        _.d.set(self, paramd.subscription, subscription)
    }

    if (!paramd.wait) {
        const _done = done
        done(null, self)
        _done = _.noop
    }
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
 *  d.delay - if set, delay this many seconds between commands
 *  d.error - handle errors. if not present, errors will be propigated
 *
 *      _.promise({
 *          values: [ 1, 2, 3, 4, 5 ],
 *      })
 *          .each({
 *              method: sd => sd.value * sd.value,
 *              // inputs: sd => sd.values.map(value => ({ value: value })),
 *              inputs: "values:value",
 *              output_selector: result => result,
 *              outputs: "squares",
 *          })
 *          .then(sd => console.log(sd.squares))
 *          .catch(error => {
 *              console.log(error)
 *          })
 */
const series = _d => q_denodeify((_self, done) => {
    const self = Object.assign({}, _self)
    const method = "_.promise.each"
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

    d.outputs = d.outputs || null
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

    let outputs = []

    const _doit = (self, inputx) => {
        if (inputx >= d.inputs.length) {
            if (_.is.Function(d.output_flatten)) {
                outputs = d.output_flatten(outputs)
            } else if (!!d.output_flatten) {
                outputs = _.flatten(outputs)
            }

            outputs = outputs.filter(d.output_filter)
            
            if (d.outputs) {
                self[d.outputs] = outputs
            }

            done(null, self)
            done = exports.promise.noop

            return
        }

        const _result = sd => {
            if (d.outputs) {
                outputs[inputx] = d.output_selector(sd)
            }

            process.nextTick(() => {
                _doit(d.roll_self ? sd : self, inputx + 1)
            })
        }

        const input = d.inputs[inputx]
        
        if (d.verbose) {
            console.log(`- ${method}: verbose: fetch result`)
        }

        const start = Object.assign({}, self, input)
        if (d.index) {
            start[d.index] = inputx
        }

        q_wrap(start)
            .then(d.method)
            .then(sd => {
                if (d.delay && (inputx < d.inputs.length - 1)) {
                    if (d.verbose) {
                        console.log(`- ${method}: verbose: delay ${d.delay}`)
                    }

                    setTimeout(() => {
                        _result(sd)
                    }, d.delay * 1000)
                } else {
                    _result(sd)
                }
            })
            .catch(error => {
                if (d.error) {
                    _result(d.error(error, self) || null)
                } else {
                    done(error)
                    done = exports.promise.noop
                }
            })
    }

    _doit(self, 0)
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
const page = _d => q_denodeify((_self, done) => {
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

        q_wrap(rolling_self)
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
const retry = _d => q_denodeify((_self, done) => {
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

        q_wrap(self)
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
                    assert.ok(false, `_.promise.done: ${f.method}: ${key} is required to be a value`)
                } else {
                    sd[key] = value
                }
            })

            if (!f.__out) {
                f.__out = [].concat(
                    _.validate.flatten(f.produces || {}, false),
                )
            }

            _.validate.validate(sd, f, f.__out)
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

const delay_p = delay => q_denodeify((_self, done) => setTimeout(() => done(null, _self), (delay || 1) * 1000));

/**
 *  Print the message and continue
 */
const log = (message, ...rest) => self => { 
    if (self.logger) {
        const logd = {}

        _split(self, rest)
            .filter(d => d.value !== void 0)
            .forEach(d => {
                try {
                    logd[d.to] = JSON.stringify(d.value, null, 2)
                }
                catch (error) {
                    logd[d.to] = d.value
                }
            })

        self.logger.info(logd, message)

        return self
    }

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
    const q_then = q.then.bind(q)
    q.then = (...rest) => {
        return _rebind(q_then(...rest))
    }
    q.add = (...rest) => _rebind(q.then(add(...rest)))
    q.validate = (...rest) => _rebind(q.then(validate.promise(...rest)))
    q.make = (...rest) => _rebind(q.then(make(...rest)))
    q.wrap = (...rest) => _rebind(q.then(wrap(...rest)))
    q.each = (...rest) => _rebind(q.then(series(...rest)))
    q.observe = (...rest) => _rebind(q.then(observe(...rest)))
    q.page = (...rest) => _rebind(q.then(page(...rest)))
    q.log = (...rest) => _rebind(q.then(log(...rest)))
    q.conditional = (...rest) => _rebind(q.then(conditional(...rest)))
    q.async = (...rest) => _rebind(q.then(_async(...rest)))
    q.end = (...rest) => _rebind(q.catch(error => {
        if (error.__bail === BAIL) {
            return error.self
        } else if (!rest[1]) {
            console.log("#######")
            console.log("#", "--- cannot properly recover from error when done does not have 'self' not defined. careful!")
            console.log("#######")
            throw error;
        } else {
            error.self = rest[1]
            throw error;
        }
    }).then(do_done(...rest)).catch(rest[0]))
    q.except = (...rest) => _rebind(q.catch(...rest))

    return q
}

/**
 */
const validate = (self, f) => {
    const _ = require("..")

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
            _.validate.flatten(f.required || {}, true),
            _.validate.flatten(f.requires || {}, true),
            _.validate.flatten(f.accepts || {}, false),
        )
    }

    _.validate.validate(self, f, f.__in)
}

/**
 *  Normally use .validate() but if you need
 *  the promise here it is
 */
validate.promise = f => self => {
    validate(self, f);
    return self
}

/**
 *  Wrap a standard async functions.
 *
 *  Option 1: Pull arguments from self
 *      .wrap(fs.readdir, "path,options", "paths")
 *
 *  Option 2: Directly list arguments (triggered by null)
 *      .wrap(fs.readdir, null, "/", "paths")
 *
 *  Last argument is always the outputs
 */
const wrap = (f, ...rest) => {
    const method = "_.promise.wrap"
    const _ = require("..")

    if (!_.is.Function(f)) {
        console.log("#", "error: wrap: argument 1 must be function")
        return _rebind(q_wrap({}))
    }

    if (rest.length !== 2) {
        console.log("#", "error: wrap: exactly 3 arguments required")
        return _rebind(q_wrap({}))
    }

    if (_.is.String(rest[0])) {
    } else if (_.is.Array(rest[0])) {
    } else if (_.is.Dictionary(rest[0])) {
    } else {
        console.log("#", "error: wrap: argument 2 must be String, Array or Dictionary")
        return _rebind(q_wrap({}))
    }

    if (_.is.String(rest[1])) {
    } else {
        console.log("#", "error: wrap: argument 3 must be String")
        return _rebind(q_wrap({}))
    }

    return q_denodeify((_self, done) => {
        const self = Object.assign({}, _self);

        let inputs = []
        if (_.is.String(rest[0])) {
            inputs = _split(self, [ rest[0] ]).map(x => x.value)
        } else if (_.is.Array(rest[0])) {
            inputs = rest[0]
        } else if (_.is.Dictionary(rest[0])) {
        }

        f(...inputs, (error, ...results) => {
            if (error) {
                error.self = self
                return done(error)
            }

            _split({}, [ rest[1] ])
                .forEach((d, x) => {
                    if (x < results.length) {
                        _.d.set(self, d.to, results[x])
                    } else {
                        _.d.delete(self, d.to)
                    }
                })

            return done(null, self)
        })
    })
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
        return _rebind(q_wrap({}))
    } else if (_.is.Async(first)) {
        return q_denodeify((_self, done) => {
            const self = Object.assign({}, _self);

            first(self)
                .then(() => {
                    done(null, self)
                })
                .catch(error => {
                    if (error && !error.self) {
                        error.self = self
                    }

                    done(error, self)
                })
        })
    } else if (_.is.Function(first) && (first.length === 2)) {
        return q_denodeify((_self, done) => {
            const self = Object.assign({}, _self);

            first(self, (error, next_self) => {
                if (error && !error.self) {
                    error.self = self;
                }
            
                done(error, next_self)
            })
        })
    } else if (_.is.Function(first) && (first.length === 1)) {
        return q_denodeify((_self, done) => {
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
        return _rebind(q_wrap(first));
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


const BAIL = {}

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
const time = (f, message) => q_denodeify((_self, done) => {
    const start = new Date();

    q_wrap(_self)
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
exports.promise.denodeify = q_denodeify
exports.promise.block = block

exports.promise.validate = validate
exports.promise.series = series
exports.promise.parallel = series
exports.promise.retry = retry
exports.promise.page = page
exports.promise.log = log
exports.promise.timestamp = timestamp
exports.promise.tick = q_denodeify(tick)
exports.promise.delay = q_denodeify(delay)
exports.promise.delay.p = delay_p
exports.promise.make = make
exports.promise.wrap = wrap
exports.promise.done = do_done
exports.promise.bail = bail
exports.promise.bail.conditional = bail_conditional
exports.promise.unbail = unbail
exports.promise.time = time
exports.promise.async = _async
exports.promise.noop = self => self
exports.promise.BAIL = BAIL
exports.promise.observe = observe
