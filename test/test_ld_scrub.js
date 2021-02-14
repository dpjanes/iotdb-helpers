/*
 *  test_ld_scrub.js
 *
 *  David Janes
 *  IOTDB
 *  2017-12-16
 */

"use strict";

var assert = require("assert")
var _ = require("../helpers")

/* --- tests --- */
describe('test_ld', function() {
    describe('scrub', function() {
        it('empty', function() {
            const input = {};
            const result = _.ld.scrub(input);
            const expected = {};

            assert.deepEqual(expected, result);
        })
        it('no @context', function() {
            const input = {
                "schema:name": "David",
            };
            const result = _.ld.scrub(input);
            const expected = {
                "schema:name": "David",
            };

            assert.deepEqual(expected, result);
        })
        it('@context with match', function() {
            const input = {
                "@context": {
                    "schema": "http://schema.org/",
                    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
                },
                "schema:name": "David",
            };
            const result = _.ld.scrub(input);
            const expected = {
                "@context": {
                    "schema": "http://schema.org/",
                },
                "schema:name": "David",
            };

            assert.deepEqual(expected, result);
        })
        it('@context - doesnt make an effort to convert expanded strings', function() {
            const input = {
                "@context": {
                    "schema": "http://schema.org/",
                    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
                },
                "http://schema.org/name": "David",
            };
            const result = _.ld.scrub(input);
            const expected = {
                "@context": {},
                "http://schema.org/name": "David",
            };

            assert.deepEqual(expected, result);
        })
        it('@context with @type', function() {
            const input = {
                "@context": {
                    "schema": "http://schema.org/",
                    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
                },
                "@type": "schema:Bla",
            };
            const result = _.ld.scrub(input);
            const expected = {
                "@context": {
                    "schema": "http://schema.org/",
                },
                "@type": "schema:Bla",
            };

            assert.deepEqual(expected, result);
        })
    });
});
