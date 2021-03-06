/*
 *  d.js
 *
 *  David Janes
 *  IOTDB.org
 *  2014-02-14
 *  "Valentines's Day"
 *
 *  Dictionary functions
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

const _subkeys = key => key.replace(/^[\/.]*/, '') /* */
    .split(/[.\/]/)
    .filter(x => x.length)

/**
 *  Slash and dotpaths
 */
const get = function(keystored, key, otherwise) {
    const _ = require("..")

    if (!keystored) {
        return otherwise;
    }
    if (!key) {
        return otherwise;
    }

    let d = keystored;
    const subkeys = _subkeys(key)
    if (subkeys.length === 0) {
        return keystored
    }
    let lastkey = subkeys[subkeys.length - 1];

    for (let ski = 0; ski < subkeys.length - 1; ski++) {
        let subkey = subkeys[ski];
        let subd = d[subkey];

        while (_.is.Array(subd) && subd.length) {
            subd = subd[0]
        }

        if (subd === undefined) {
            return otherwise;
        } else if (_.is.Object(subd)) {
            d = subd;
        } else {
            return otherwise;
        }
    }

    let value = d[lastkey];
    if (value === undefined) {
        return otherwise;
    }

    return value;
};

/**
 */
const first = function(keystored, key, otherwise) {
    const _ = require("..")

    let value = get(keystored, key, undefined);
    if (value === undefined) {
        return otherwise;
    } else if (_.is.Array(value)) {
        if (value.length) {
            return value[0];
        } else {
            return otherwise;
        }
    } else {
        return value;
    }
};

/**
 */
const list = function(keystored, key, otherwise) {
    const _ = require("..")

    let value = get(keystored, key, undefined);
    if (value === undefined) {
        return otherwise;
    } else if (_.is.Array(value)) {
        return value;
    } else {
        return [ value ];
    }
};

/**
 *  Slash-path oriented
 */
const set = function(keystored, key, value) {
    const _ = require("..")

    let d = keystored;
    const subkeys = _subkeys(key)
    if (subkeys.length === 0) {
        return
    }
    let lastkey = subkeys[subkeys.length - 1];

    for (let ski = 0; ski < subkeys.length - 1; ski++) {
        let subkey = subkeys[ski];
        let subd = d[subkey];
        if (!_.is.Object(subd)) {
            subd = {};
            d[subkey] = subd;
        }

        d = subd;
    }

    d[lastkey] = value;
};

/**
 *  Slash-path oriented
 */
const do_delete = function(keystored, key) {
    const _ = require("..")

    let d = keystored;
    const subkeys = _subkeys(key)
    if (subkeys.length === 0) {
        return keystored
    }
    let lastkey = subkeys[subkeys.length - 1];

    for (let ski = 0; ski < subkeys.length - 1; ski++) {
        let subkey = subkeys[ski];
        let subd = d[subkey];
        if (!_.is.Object(subd)) {
            return;
        }

        d = subd;
    }

    delete d[lastkey];
};

/*
 *  Apply a function to keys and values of a dictionary
 */
const transform = function(o, paramd) {
    const _ = require("..")

    paramd = _.defaults(paramd, {
        key: function(key, value, paramd) {
            return key;
        },
        value: function(value, paramd) {
            return value;
        },
        filter: function(value, paramd) {
            return (value !== undefined);
        },
        pre: function(value, paramd) {
            return value;
        },
        post: function(value, paramd) {
            return value;
        },
    });

    let _transform = function(v, paramd) {
        if (_.is.Array(v)) {
            let ovs = v;
            let nvs = [];
            for (let ovx in ovs) {
                let ov = ovs[ovx];
                let nv = _transform(ov, paramd);
                if (paramd.filter(nv)) {
                    nvs.push(nv);
                }
            }
            return nvs;
        } else if ((v !== null) && _.is.Date(v)) {
            return paramd.value(v, paramd);
        } else if ((v !== null) && _.is.Object(v)) {
            let ovd = paramd.pre(v, paramd);
            let nvd = {};
            for (let ovkey in ovd) {
                let ovvalue = ovd[ovkey];

                let nvkey = paramd.key(ovkey, ovvalue, paramd);
                if (!nvkey) {
                    continue;
                }

                let nparamd = _.d.clone.shallow(paramd);
                nparamd._key = nvkey;

                let nvvalue = _transform(ovvalue, nparamd);
                if (paramd.filter(nvvalue)) {
                    nvd[nvkey] = nvvalue;
                }
            }
            return nvd;
        } else {
            return paramd.value(v, paramd);
        }
    };


    o = paramd.pre(o, paramd);
    o = _transform(o, paramd);
    o = paramd.post(o, paramd);

    return o;
};

/**
 *  Return true iff everything in subd is in superd
 *  Note that not recursive on dictionaries
 */
const d_contains_d = function (superd, subd) {
    const _ = require("..")

    if (!_.is.Dictionary(superd)) {
        return false;
    }
    if (!_.is.Dictionary(subd)) {
        return false;
    }

    let subkeys = _.keys(subd);
    for (let sx in subkeys) {
        let subkey = subkeys[sx];
        let subvalue = subd[subkey];
        let supervalue = superd[subkey];
        if (!_.is.Equal(subvalue, supervalue)) {
            return false;
        }
    }

    return true;
};

/**
 *  Returns a JSON-scrubed version
 */
const to_json = function (xvalue) {
    const _ = require("..")

    if (xvalue === undefined) {
        return undefined;
    } else if (_.is.Function(xvalue)) {
        return undefined;
    } else if (_.is.NaN(xvalue)) {
        return undefined;
    } else if (_.is.Array(xvalue)) {
        let ns = [];
        xvalue.map(function(o) {
            let n = to_json(o);
            if (n !== undefined) {
                ns.push(n);
            }
        });
        return ns;
    } else if (_.is.Object(xvalue)) {
        let nd = {};
        _.mapObject(xvalue, function(o, key) {
            let n = to_json(o);
            if (n !== undefined) {
                nd[key] = n;
            }
        });
        return nd;
    } else {
        return xvalue;
    }
};

/**
 *  Remove all nulls and undefined
 */
const to_denull = o => {
    const _ = require("..")

    if (_.is.Dictionary(o)) {
        const no = {}
        _.mapObject(o, (sv, sk) => {
            if (!_.is.Nullish(sv)) {
                no[sk] = to_denull(sv)
            }
        })

        return no
    } else if (_.is.Array(o)) {
        return o.filter(so => !_.is.Nullish(so)).map(to_denull)
    } else {
        return o
    }
}

/**
 */
const to_underscore_case = xvalue => {
    const _ = require("..")

    if (_.is.Array(xvalue)) {
        return xvalue.map(o => to_underscore_case(o))
    } else if (_.is.Dictionary(xvalue)) {
        let nd = {}

        _.mapObject(xvalue, function(value, key) {
            nd[_.id.to_underscore_case(key, true)] = value
        })

        return nd
    } else {
        return xvalue
    }
}

/**
 *  Like compose, but will descend into dictionaries
 *  to merge those. The *first* thing seen always takes
 *  precidence in replacement
 */
const deep_compose = (...ods) => {
    const _ = require("..")
    const xd = {};

    ods
        .filter(od => _.is.Object(od))
        .forEach(od => {
            _.mapObject(od, ( y, key ) => {
                const x = xd[key];
                if (_.is.Dictionary(x) && _.is.Dictionary(y)) {
                    xd[key] = deep_compose(x, y);
                } else if (_.is.Null(x)) {
                    xd[key] = _.d.clone.deep(y);
                } else if (_.is.Undefined(x)) {
                    xd[key] = _.d.clone.deep(y);
                }
            });
        });

    return xd;
};

/**
 *  Return a new Object composed of all its
 *  arguments. A value is _only_ set if it's
 *  not already set from a preceeding argument.
 */
const shallow_compose = function () {
    const _ = require("..")
    let d = {};

    _.each(arguments, function (ad) {
        for (let key in ad) {
            if (d[key] === undefined) {
                d[key] = ad[key];
            }
        }
    });

    return d;
};

const shallow_clone = function (oldObj) {
    const _ = require("..")

    let newObj = {};
    for (let i in oldObj) {
        if (oldObj.hasOwnProperty(i)) {
            newObj[i] = oldObj[i];
        }
    }
    return newObj;
};

const deep_clone = function (oldObj) {
    const _ = require("..")

    let newObj = oldObj;
    if (oldObj && typeof oldObj === 'object') {
        newObj = Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
        for (let i in oldObj) {
            newObj[i] = deep_clone(oldObj[i]);
        }
    }
    return newObj;
};

const add = (d, key, value) => {
    d = shallow_clone(d);
    set(d, key, value);
    return d;
}

const update = (d, nd) => Object.assign({}, d, nd);

exports.d = {
    get: get,
    first: first,
    list: list,
    set: set,
    delete: do_delete,
    transform: transform,
    json: to_json,
    add: add,
    update: update,
    compose: shallow_compose,
    clone: shallow_clone,
    is: {
        superset: (a, b) => d_contains_d(a, b),
        subset: (a, b) => d_contains_d(b, a),
    }
};

exports.d.transform.json = to_json
exports.d.transform.underscore_case = to_underscore_case
exports.d.transform.denull = to_denull

exports.d.compose.shallow = shallow_compose;
exports.d.compose.deep = deep_compose;
exports.d.clone.shallow = shallow_clone;
exports.d.clone.deep = deep_clone;
