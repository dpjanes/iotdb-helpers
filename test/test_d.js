/*
 *  test_d.js
 *
 *  David Janes
 *  IOTDB
 *  2015-12-26
 *  "Boxing Day"
 */

"use strict";

var assert = require("assert")
var sleep = require("sleep");
var _ = require("../helpers")

var d1d = {
    "string0": "",
    "string1": "hello",
    "string2": "world",

    "boolean0": false,
    "boolean1": true,

    "integer0": 0,
    "integer1": 1,
    "integer2": -1,

    "number0": 0.1,
    "number1": 3.14,
    "number2": -3.14,

    "array0": [
        "a",
        "b",
        "c",
    ],

    "dict0": {
        "string0": "the number 99",
        "integer0": 99,
        "number0": -99.9,
    }
};

describe('test_d:', function() {
    describe('get', function() {
        it('simple - no slash', function() {
            var keys = _.keys(d1d);
            keys.map(function(key) {
                var expect = d1d[key];
                var got = _.d.get(d1d, key, null);

                assert.deepEqual(expect, got);
            });
        });
        it('simple - slash', function() {
            var keys = _.keys(d1d);
            keys.map(function(key) {
                var expect = d1d[key];
                var got = _.d.get(d1d, "/" + key, null);

                assert.deepEqual(expect, got);
            });
        });
        it('path - no leading /', function() {
            {
                var expect = d1d["dict0"]["string0"];
                var got = _.d.get(d1d, "/dict0/string0", null);

                assert.deepEqual(expect, got);
            }
            {
                var expect = d1d["dict0"]["number0"];
                var got = _.d.get(d1d, "/dict0/number0", null);

                assert.deepEqual(expect, got);
            }
        });
        it('path - leading /', function() {
            {
                var expect = d1d["dict0"]["string0"];
                var got = _.d.get(d1d, "/dict0/string0", null);

                assert.deepEqual(expect, got);
            }
            {
                var expect = d1d["dict0"]["number0"];
                var got = _.d.get(d1d, "/dict0/number0", null);

                assert.deepEqual(expect, got);
            }
        });
        it('path - undefined head', function() {
            {
                var expect = "ABC";
                var got = _.d.get(d1d, "/undefined/undefined", expect);

                assert.deepEqual(expect, got);
            }
        });
        it('path - undefined tail', function() {
            {
                var expect = "ABC";
                var got = _.d.get(d1d, "/dict0/undefined", expect);

                assert.deepEqual(expect, got);
            }
        });
        it('path - not object', function() {
            {
                var expect = "ABC";
                var got = _.d.get(d1d, "/string0/undefined", expect);

                assert.deepEqual(expect, got);
            }
        });
    });
    describe('first', function() {
        it('simple - no slash', function() {
            var keys = _.keys(d1d);
            keys.map(function(key) {
                var expect = d1d[key];
                if (_.is.Array(expect) && expect.length) {
                    expect = expect[0];
                }
                var got = _.d.first(d1d, key, null);

                assert.deepEqual(expect, got);
            });
        });
        it('simple - slash', function() {
            var keys = _.keys(d1d);
            keys.map(function(key) {
                var expect = d1d[key];
                if (_.is.Array(expect) && expect.length) {
                    expect = expect[0];
                }
                var got = _.d.first(d1d, "/" + key, null);

                assert.deepEqual(expect, got);
            });
        });
        it('path - no leading /', function() {
            {
                var expect = d1d["dict0"]["string0"];
                var got = _.d.first(d1d, "/dict0/string0", null);

                assert.deepEqual(expect, got);
            }
            {
                var expect = d1d["dict0"]["number0"];
                var got = _.d.first(d1d, "/dict0/number0", null);

                assert.deepEqual(expect, got);
            }
        });
        it('path - leading /', function() {
            {
                var expect = d1d["dict0"]["string0"];
                var got = _.d.first(d1d, "/dict0/string0", null);

                assert.deepEqual(expect, got);
            }
            {
                var expect = d1d["dict0"]["number0"];
                var got = _.d.first(d1d, "/dict0/number0", null);

                assert.deepEqual(expect, got);
            }
        });
        it('path - undefined head', function() {
            {
                var expect = "ABC";
                var got = _.d.first(d1d, "/undefined/undefined", expect);

                assert.deepEqual(expect, got);
            }
        });
        it('path - undefined tail', function() {
            {
                var expect = "ABC";
                var got = _.d.first(d1d, "/dict0/undefined", expect);

                assert.deepEqual(expect, got);
            }
        });
        it('path - not object', function() {
            {
                var expect = "ABC";
                var got = _.d.first(d1d, "/string0/undefined", expect);

                assert.deepEqual(expect, got);
            }
        });
        it('nested inside array', function() {
            const d = {
                coord: { lon: -116.55, lat: 33.83 },
                weather: [
                    {
                        id: 804,
                        main: 'Clouds',
                        description: 'overcast clouds',
                        icon: '04n'
                    }
                ],
                base: 'stations',
            };
            const expect = "overcast clouds";
            const got = _.d.first(d, "/weather/description");

            assert.deepEqual(expect, got);
        })
    });
    describe('set', function() {
        it('set - simple, blank', function() {
            var d = {};
            var x1d = {
                "hi": "there",
            };
            var x2d = {
                "hi": "there",
                "yellow": 10,
            };

            _.d.set(d, "hi", "there");
            assert.deepEqual(d, x1d);
            
            _.d.set(d, "yellow", 10);
            assert.deepEqual(d, x2d);
            
        });
        it('set - slash, blank', function() {
            var d = {};
            var x1d = {
                "hi": {
                    "hello": "there",
                },
            };

            _.d.set(d, "/hi/hello", "there");
            assert.deepEqual(d, x1d);
        });
        it('set - slash, existing', function() {
            var d = {
                "hi": {
                    "a": "b",
                },
            };
            var x1d = {
                "hi": {
                    "a": "b",
                    "hello": "there",
                },
            };

            _.d.set(d, "/hi/hello", "there");
            assert.deepEqual(d, x1d);
        });
        it('set - slash, existing overwrite', function() {
            var d = {
                "hi": 99,
            };
            var x1d = {
                "hi": {
                    "hello": "there",
                }
            };

            _.d.set(d, "/hi/hello", "there");
            assert.deepEqual(d, x1d);
        });
    });
    describe('d_contains_d', function() {
        describe('superset', function() {
            it('superset - empty', function() {
                assert.ok(_.d.is.superset({}, {}));
            });
            it('superset - same', function() {
                var ad = _.d.clone.deep(d1d);
                var bd = _.d.clone.deep(d1d);

                assert.ok(_.d.is.superset(ad, bd));
                assert.ok(_.d.is.superset(bd, ad));
            });
            it('superset - different', function() {
                var ad = _.d.clone.deep(d1d);
                ad["something"] = "else";

                var bd = _.d.clone.deep(d1d);

                assert.ok(_.d.is.superset(ad, bd));
                assert.ok(!_.d.is.superset(bd, ad));
            });
            it('superset - bad', function() {
                assert.ok(!_.d.is.superset({}, 21));
                assert.ok(!_.d.is.superset("hi", {}));
            });
        });
        describe('subset', function() {
            it('superset - empty', function() {
                assert.ok(_.d.is.subset({}, {}));
            });
            it('subset - same', function() {
                var ad = _.d.clone.deep(d1d);
                var bd = _.d.clone.deep(d1d);

                assert.ok(_.d.is.subset(ad, bd));
                assert.ok(_.d.is.subset(bd, ad));
            });
            it('subset - different', function() {
                var ad = _.d.clone.deep(d1d);
                ad["something"] = "else";

                var bd = _.d.clone.deep(d1d);

                assert.ok(!_.d.is.subset(ad, bd));
                assert.ok(_.d.is.subset(bd, ad));
            });
            it('subset - bad', function() {
                assert.ok(!_.d.is.subset({}, 21));
                assert.ok(!_.d.is.subset("hi", {}));
            });
        });
    });
    describe('compose.deep', function() {
        it('call - empty', function() {
            var od = _.d.compose.deep({});
            const expectd = {};
            assert.deepEqual(od, expectd);
        });
        it('call - empty', function() {
            var od = _.d.compose.deep({}, {});
            const expectd = {};
            assert.deepEqual(od, expectd);
        });
        it('call - bad argument 1', function() {
            var od = _.d.compose.deep(1, { "a": "b" });
            const expectd = { "a": "b"};
            assert.deepEqual(od, expectd);
        });
        it('call - bad argument 2', function() {
            var od = _.d.compose.deep({ "a": "b" }, 222);
            const expectd = { "a": "b"};
            assert.deepEqual(od, expectd);
        });
        it('call - merge', function() {
            const startd = {};
            const updated = {
                "hi": "there",
            };
            const expectd = {
                "hi": "there",
            };
            const rd = _.d.compose.deep(startd, updated);

            assert.deepEqual(rd, expectd);
        });
        it('call - merge', function() {
            const startd = {
                "a": "b",
            };
            const updated = {
                "hi": "there",
            };
            const expectd = {
                "a": "b",
                "hi": "there",
            };
            const rd = _.d.compose.deep(startd, updated);

            assert.deepEqual(rd, expectd);
        });
        it('call - merge: dict in src', function() {
            const startd = {
                "hi": "there",
            };
            const updated = {
                "a": "b",
                "hi": {},
            };
            const expectd = {
                "a": "b",
                "hi": "there",
            };
            const rd = _.d.compose.deep(startd, updated);

            assert.deepEqual(rd, expectd);
        });
        it('call - merge: dict in update', function() {
            const startd = {
                "a": "b",
                "hi": {},
            };
            const updated = {
                "hi": "there",
            };
            const expectd = {
                "a": "b",
                "hi": {},
            };
            const rd = _.d.compose.deep(startd, updated);

            assert.deepEqual(rd, expectd);
        });
        it('call - merge subdictionary', function() {
            const startd = {
                "a": "b",
                "sub": {
                    "c": "d",
                    "e": "f",
                },
            };
            const updated = {
                "hi": "there",
                "sub": {
                    "e": "updatedated",
                    "g": "h",
                },
            };
            const expectd = {
                "a": "b",
                "hi": "there",
                "sub": {
                    "c": "d",
                    "e": "f",
                    "g": "h",
                },
            };
            const rd = _.d.compose.deep(startd, updated);

            assert.deepEqual(rd, expectd);
        });
        describe('arrays', function() {
            it('add array', function() {
                const startd = {
                    "A": "b",
                };
                const updated = {
                    "B": [ "a", "c", "c" ],
                };
                const expectd = {
                    "A": "b",
                    "B": [ "a", "c", "c" ],
                };
                const rd = _.d.compose.deep(startd, updated);

                assert.deepEqual(rd, expectd);
            });
            it('replace array with value (to fail)', function() {
                const startd = {
                    "A": "b",
                    "B": [ "a", "c", "c" ],
                };
                const updated = {
                    "B": 1,
                };
                const expectd = {
                    "A": "b",
                    "B": [ "a", "c", "c" ],
                };
                const rd = _.d.compose.deep(startd, updated);

                assert.deepEqual(rd, expectd);
            });
            it('replace array with array (to fail)', function() {
                const startd = {
                    "A": "b",
                    "B": [ "a", "c", "c" ],
                };
                const updated = {
                    "B": [ "1", "2" ],
                };
                const expectd = {
                    "A": "b",
                    "B": [ "a", "c", "c" ],
                };
                const rd = _.d.compose.deep(startd, updated);

                assert.deepEqual(rd, expectd);
            });
        });
    });
    describe('json', function() {
        it('call - empty', function() {
            var od = _.d.json({});
            const expectd = {};
            assert.deepEqual(od, expectd);
        });
        it('call - clean', function() {
            var od = _.d.json(d1d);
            assert.deepEqual(od, d1d);
        });
        it('call - dirty', function() {
            var sd = _.d.clone.deep(d1d);
            sd["function"] = function() {};
            sd["nan"] = NaN;
            sd["undefined"] = undefined;
            var od = _.d.json(sd);
            assert.deepEqual(od, d1d);
        });
        it('call - dirty subdictionary', function() {
            var sd = _.d.clone.deep(d1d);
            var ssd = {};
            ssd["function"] = function() {};
            ssd["nan"] = NaN;
            ssd["undefined"] = undefined;
            ssd["good"] = "times";
            sd["sub"] = ssd;
            var od = _.d.json(sd);

            const expectd = _.d.clone.deep(d1d);
            expectd["sub"] = { "good": "times" };

            // console.log("OD", od);
            // console.log("XD", expectd);

            assert.deepEqual(od, expectd);
        });
        it('call - dirty array', function() {
            var sd = _.d.clone.deep(d1d);
            var ssd = {};
            ssd["function"] = function() {};
            ssd["nan"] = NaN;
            ssd["undefined"] = undefined;
            ssd["good"] = "times";
            sd["sub"] = [ "hi", ssd, "there" ];
            var od = _.d.json(sd);

            const expectd = _.d.clone.deep(d1d);
            expectd["sub"] = [ "hi", { "good": "times" }, "there" ];

            assert.deepEqual(od, expectd);
        });
    });
    describe('transform', function() {
        it('call - empty', function() {
            var od = _.d.transform({});
            const expectd = {};
            assert.deepEqual(od, expectd);
        });
        it('call - empty', function() {
            var od = _.d.transform({}, {});
            const expectd = {};
            assert.deepEqual(od, expectd);
        });
        it('call - empty transform', function() {
            var od = _.d.transform(d1d, {});
            const expectd = d1d;
            assert.deepEqual(od, expectd);
        });
        it('call - upper case keys', function() {
            var od = _.d.transform(d1d, {
                key: function(value) {
                    return value.toUpperCase();
                },
            });
            const expectd = {
              STRING0: '',
              STRING1: 'hello',
              STRING2: 'world',
              BOOLEAN0: false,
              BOOLEAN1: true,
              INTEGER0: 0,
              INTEGER1: 1,
              INTEGER2: -1,
              NUMBER0: 0.1,
              NUMBER1: 3.14,
              NUMBER2: -3.14,
              ARRAY0: [ 'a', 'b', 'c' ],
              DICT0: { STRING0: 'the number 99', INTEGER0: 99, NUMBER0: -99.9 } };
            assert.deepEqual(od, expectd);
        });
        it('call - remove keys', function() {
            var od = _.d.transform(d1d, {
                key: function(value) {
                    if (value.match(/^(string|dict)/)) {
                        return value;
                    }
                },
            });
            const expectd = {
                string0: '',
                string1: 'hello',
                string2: 'world',
                dict0: { string0: 'the number 99' } };

            assert.deepEqual(od, expectd);
        });
        it('call - change value to null', function() {
            var od = _.d.transform(d1d, {
                value: function(value) {
                    return null;
                },
            });
            const expectd = {
                string0: null,
                string1: null,
                string2: null,
                boolean0: null,
                boolean1: null,
                integer0: null,
                integer1: null,
                integer2: null,
                number0: null,
                number1: null,
                number2: null,
                array0: [ null, null, null ],
                dict0: { string0: null, integer0: null, number0: null } };


            assert.deepEqual(od, expectd);
        });
        it('call - filter', function() {
            var sd = _.d.clone.deep(d1d);
            sd["array0"] = [ "a", 0, "b", 1, "c", 2 ];
            var od = _.d.transform(sd, {
                filter: function(value) {
                    if (_.is.String(value) || _.is.Array(value)) {
                        return true;
                    }
                },
            });
            const expectd = { string0: '', string1: 'hello', string2: 'world', "array0": [ "a", "b", "c", ],}

            assert.deepEqual(od, expectd);
        });
        it('call - pre', function() {
            var od = _.d.transform(d1d, {
                pre: function() {
                    return { "a": "b" };
                },
                key: function(value) {
                    return value.toUpperCase();
                },
            });
            const expectd = {
                "A": "b",
            };
            assert.deepEqual(od, expectd);
        });
        it('call - post', function() {
            var od = _.d.transform(d1d, {
                post: function() {
                    return { "a": "b" };
                },
                key: function(value) {
                    return value.toUpperCase();
                },
            });
            const expectd = {
                "a": "b",
            };
            assert.deepEqual(od, expectd);
        });
    });
})
