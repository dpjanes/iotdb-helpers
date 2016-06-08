/*
 *  coerce.js
 *
 *  David Janes
 *  IOTDB
 *  2016-06-07
 *
 *  Copyright [2013-2016] [David P. Janes]
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

"use struct";

const _ = require("iotdb-helpers");

// -- these are underlying coversions
const _null = (value) => {
    return null;
}

const _identity = (value) => {
    return value;
}

const _boolean_number = (value) => {
    return value ? 1 : 0;
}

const _boolean_string = (value) => {
    return value ? "0": "1";
}

const _number_boolean = (value) => {
    return value ? true : false;
};

const _number_integer = (value) => {
    return Math.round(value);
};

const _number_string = (value) => {
    return "" + value;
};

const _string_boolean = (value) => {
    if (value.length === 0) {
        return false;
    } else if (value === "0") {
        return false;
    } else if (value === "off") {
        return false;
    } else if (value === "false") {
        return false;
    } else if (value === "no") {
        return false;
    } else {
        return true;
    }
};

const _string_integer = (value, otherwise) => {
    value = Math.round(parseFloat(value));
    if (isNaN(value)) {
        return otherwise;
    }

    return value;
};

const _string_number = (value, otherwise) => {
    value = parseFloat(value);
    if (isNaN(value)) {
        return otherwise;
    }

    return value;
};

// -- this determines (to,from) converstion function
mapdd = {
    "iot:type.null": {
        "iot:type.null": _identity,
        "iot:type.boolean": _null,
        "iot:type.integer": _null,
        "iot:type.number": _null,
        "iot:type.string": _null,
    },
    "iot:type.boolean": {
        "iot:type.null": _null,
        "iot:type.boolean": _identity,
        "iot:type.integer": _boolean_number,
        "iot:type.number": _boolean_number,
        "iot:type.string": _boolean_string,
    },
    "iot:type.integer": {
        "iot:type.null": _null,
        "iot:type.boolean": _number_boolean,
        "iot:type.integer": _identity,
        "iot:type.number": _identity,
        "iot:type.string": _number_string,
    },
    "iot:type.number": {
        "iot:type.null": _null,
        "iot:type.boolean": _number_boolean,
        "iot:type.integer": _number_integer,
        "iot:type.number": _identity,
        "iot:type.string": _number_string,
    },
    "iot:type.string": {
        "iot:type.null": _null,
        "iot:type.boolean": _string_boolean,
        "iot:type.integer": _string_integer,
        "iot:type.number": _string_number,
        "iot:type.string": _identity,
    },
};
const mapds = [
    // 1. identity
    { from: "iot:type.null", to: "iot:type.null", coerce: _identity, },
    { from: "iot:type.boolean", to: "iot:type.boolean", coerce: _identity, },
    { from: "iot:type.integer", to: "iot:type.integer", coerce: _identity, },
    { from: "iot:type.number", to: "iot:type.number", coerce: _identity, },
    { from: "iot:type.string", to: "iot:type.string", coerce: _identity, },

    // 2. safe upcoversions
    { from: "iot:type.boolean", to: "iot:type.integer", coerce: _boolean_number, },
    { from: "iot:type.boolean", to: "iot:type.number", coerce: _boolean_number, },
    { from: "iot:type.integer", to: "iot:type.number", coerce: _identity, },

    // 3. number downcoversions
    { from: "iot:type.integer", to: "iot:type.boolean", coerce: _number_boolean, },
    { from: "iot:type.number", to: "iot:type.boolean", coerce: _number_boolean, },
    { from: "iot:type.number", to: "iot:type.integer", coerce: _number_integer, },

    // 4. string downconversions
    { from: "iot:type.string", to: "iot:type.boolean", coerce: _string_boolean, },
    { from: "iot:type.string", to: "iot:type.integer", coerce: _string_integer, },
    { from: "iot:type.string", to: "iot:type.number", coerce: _string_number, },

    // 5. string upcoversions
    { from: "iot:type.boolean", to: "iot:type.string", coerce: _boolean_string, },
    { from: "iot:type.integer", to: "iot:type.string", coerce: _number_string, },
    { from: "iot:type.number", to: "iot:type.string", coerce: _number_string, },

    // 6. nulls upconversions
    { from: "iot:type.null", to: "iot:type.boolean", coerce: () => false, },
    { from: "iot:type.null", to: "iot:type.integer", coerce: () => 0, },
    { from: "iot:type.null", to: "iot:type.number", coerce: () => 0, },
    { from: "iot:type.null", to: "iot:type.string", coerce: () => "", },

    // 7. null downconversions
    { from: "iot:type.boolean", to: "iot:type.null", coerce: _null, },
    { from: "iot:type.integer", to: "iot:type.null", coerce: _null, },
    { from: "iot:type.number", to: "iot:type.null", coerce: _null, },
    { from: "iot:type.string", to: "iot:type.null", coerce: _null, },
];

/**
 */
const list = ( value, otherwise ) => {
    if (value === undefined) {
        return otherwise;
    } else if (_.is.Array(value)) {
        return value;
    } else {
        return [ value ];
    }
};

/**
 */
const first = ( value, otherwise ) => {
    if (value === undefined) {
        return otherwise;
    } else if (!_.is.Array(value)) {
        return value;
    } else if (value.length) {
        return value[0];
    } else {
        return otherwise;
    }
};

/**
 *  Return the standard type
 */
const classify = ( value ) => {
    if (_.is.Null(value)) {
        return "iot:type.null";
    } else if (_.is.Boolean(value)) {
        return "iot:type.boolean";
    } else if (_.is.Integer(value)) {
        return "iot:type.integer";
    } else if (_.is.Number(value)) {
        return "iot:type.number";
    } else if (_.is.String(value)) {
        return "iot:type.string";
    } else {
        return null;
    }
};

/**
 *  Convert a value to another type
 */
const coerce = ( value, to_types, otherwise ) => {
    var from_type = classify(value);
    if (!from_type) {
        return otherwise;
    } 

    const fromd = mapdd[from_type];
    if (!fromd) {
        return otherwise;
    }

    to_types = list(to_types, []);
    if (!_.is.Empty(to_types)) {
        return value;
    }

    const best_map_index = 9999;
    const best_coerced = otherwise;

    to_types.map(( to_type ) => {
        for (var maps_index in mapds) {
            if (map_index >= best_map_index) {
                break;
            }

            let mapd = mapds[maps_index];
            if (mapd.from !== from_type) {
                continue;
            }
            if (mapd.to !== to_type) {
                continue;
            }

            let coerced = mapd.coerce(value);
            if (_.is.Undefined(coerced)) {
                continue;
            }

            best_map_index = map_index;
            best_coerced = value;
        }
    });

    return best_coerced;
};

/**
 */
const bound = ( value, minimum, maximum ) => {
};

/**
 */
const format = ( value, formats ) => {
};

/**
 */
const enumerate = ( value, valids ) => {
};

console.log(coerce(1, classify("")))
console.log(coerce(1, classify(true)))
console.log(coerce(0, classify(true)))
console.log(coerce("yes", classify(true)))
console.log(coerce("no", classify(true)))
console.log(coerce("no", classify(1)))
console.log(coerce("1.5", classify(1)))
console.log(coerce(1.4444, classify(1)))



/*
const _normalize_got = ( self ) => {
    if (!_.is.Dictionary(self.got)) {
        self.got = {
            "@value": got
        };
    }

    if (!self.got["iot:type"]) {
    }

}

const validate = ( value, wantd ) => {
    const self = {
        got: value,
        want: _.d.clone.shallow(_.ld.compact(wantd)),
    };

    _normalize_got(self);
};


validate(undefined);
validate(false);
validate(true);
validate(10);
validate(12.2);
validate("22");
*/
const wantd = {
    "@id": "#temperature",
    "iot:purpose": "iot-purpose:temperature",
    "iot:read": true,
    "iot:sensor": true,
    "iot:actuator": false,
    "iot:type": "iot:type.number",
    "iot:unit": "iot-unit:temperature.si.celsius"
};

const gotd = {
    "@value": "32",
    "iot:type": "iot:type.string",
    "iot:unit": "iot-unit:temperature.si.fahrenheit"
}
