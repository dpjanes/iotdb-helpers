/*
 *  error.js
 *
 *  David Janes
 *  IOTDB.org
 *  2014-05-18
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

const _ = require("../helpers");

const message = function(error, otherwise) {
    if (error && (error.package === "seneca")) {
        return message({
            message: error.code,
        }, otherwise)
    }
    
    if (error && error.message) {
        return error.message;
    } else if (_.is.String(error)) {
        return error;
    } else if (error && error.name) {
        return error.name;
    } else if (otherwise) {
        return otherwise;
    } else {
        return null;
    }
};

const status = function(error, otherwise) {
    if (error && (error.package === "seneca")) {
        return code({
            message: error.code,
        }, otherwise)
    }
    
    if (error && error.statusCode && _.is.Number(error.statusCode)) {
        return error.statusCode;
    } else if (error && error.status && _.is.Number(error.status)) {
        return error.status;
    } else if (otherwise) {
        return otherwise;
    } else {
        return 500;
    }
};

/**
 *  This is a unique String identitier telling what an error is.
 */
const code_id = function(error, otherwise) {
    if (error && error.code_id) {
        return error.code_id;
    } else {
        return null;
    }
};

/**
 *  Which group does a the Status Code fall into, e.g. 2, 3, 4 or 5
 */
const group = function(error, otherwise) {
    return Math.floor(status(error, otherwise) / 100);
};

/**
 */
const log = error => {
    console.log("#", message(error))

    if (error.self && error.self.verbose) {
        console.trace()
    }
}

/**
 */
const otherwise = (test, f) => error => {
    const _ = require("..")

    if (_.is.Integer(test) && (test < 10)) {
        if (_.error.group(error) !== test) {
            throw error
        }
    } else if (_.is.Integer(test)) {
        if (_.error.code(error) !== test) {
            throw error
        }
    } else if (_.is.Function(test)) {
        if (!f(error)) {
            throw error
        }
    } else {
        console.log("#", "_.error.otherwise: first argument should be error code, error group or function")
        throw error
    }

    f(error.self, error)
    
    return error.self
}

exports.error = {
    message: message,
    code: status,       // obsolete
    code_id: code_id,
    status: status,
    group: group,
    log: log,
    otherwise: otherwise,
};
