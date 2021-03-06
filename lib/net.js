/*
 *  net.js
 *
 *  David Janes
 *  IOTDB.org
 *  2015-12-14
 *
 *  Network functions
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

const os = require("os");

let unirest = null;

/**
 *  This is basically
 *  https://www.npmjs.com/package/url-join
 */
const _url_join = function () {
    function startsWith(str, searchString) {
        return str.substr(0, searchString.length) === searchString;
    }

    function normalize (str, options) {
        if (startsWith(str, 'file://')) {
            // make sure file protocol has max three slashes
            str = str.replace(/(\/{0,3})\/*/g, '$1');
        } else {
            // make sure protocol is followed by two slashes
            str = str.replace(/:\//g, '://');

            // remove consecutive slashes
            str = str.replace(/([^:\s\%\3\A])\/+/g, '$1/');
        }

        // remove trailing slash before parameters or hash
        str = str.replace(/\/(\?|&|#[^!])/g, '$1');

        // replace ? in parameters with &
        str = str.replace(/(\?.+)\?/g, '$1&');

        return str;
    }

    var input = arguments;
    var options = {};

    if (typeof arguments[0] === 'object') {
        // new syntax with array and options
        input = arguments[0];
        options = arguments[1] || {};
    }

    var joined = [].slice.call(input, 0).join('/');

    return normalize(joined, options);
};

function _scan(filter) { 
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
        var ads = ifaces[dev];
        for (var di in ads) {
            var ad = ads[di];
            var result = filter(ad);
            if (result) {
                return result;
            }
        }
    }

    return null;
}

var _ipv4 = function() {
    return _scan(function(ad) {
        if (ad.internal) {
            return null;
        } else if (ad.family !== 'IPv4') {
            return null;
        } else {
            return ad.address;
        }
    });
};

var _ipv6 = function() {
    return _scan(function(ad) {
        if (ad.internal) {
            return null;
        } else if (ad.family !== 'IPv6') {
            return null;
        } else {
            return ad.address;
        }
    });
};

var _mac = function() {
    return _scan(function(ad) {
        if (ad.internal) {
            return null;
        } else if (ad.mac) {
            return ad.mac;
        }
    });
};

var externalv4 = function(callback) {
    try {
        unirest = require("unirest")
    }
    catch (error) {
        console.log("#", "you must have 'unirest' installed")
        callback(error)
    }

    unirest
        .get('https://diagnostic.opendns.com/myip')
        .end(function (response) {
            if (response.error) {
                return callback(response.error);
            }

            callback(null, response.body.trim());
        });
};

const geo = done => {
    try {
        unirest = require("unirest")
    }
    catch (error) {
        console.log("#", "you must have 'unirest' installed")
        callback(error)
    }

    unirest
        .get("http://ip-api.com/json")
        .end(result => {
            if (!result.body) {
                return done(new Error("could not determine location (no response)"));
            } else if (result.body.status !== "success") {
                return done(new Error("could not determine location"));
            } else {
                return done(null, result.body);
            }
        });
};

/**
 *  This is to replace globally using url-join
 *  because it does strange things when you
 *  request a leading "/"
 */
var join = function(first) {
    if (first === "/") {
        return "/" + _url_join.apply(_url_join, [].splice.call(arguments, 1));
    } else {
        return _url_join.apply(_url_join, [].splice.call(arguments, 0));
    }
}

exports.net = {
    ipv4: _ipv4,
    ipv6: _ipv6,
    mac: _mac,

    external: {
        ipv4: externalv4,
        geo: geo,
    },

    url: {
        join: join,
    },
};
