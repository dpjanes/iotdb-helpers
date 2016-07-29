/*
 *  test_is.js
 *
 *  David Janes
 *  IOTDB
 *  2015-04-15
 */

"use strict";

var assert = require("assert")
var _ = require("../helpers")

describe('test_is', function() {
    it('is.Dictionary', function() {

        assert.ok(!_.is.Dictionary(null));
        assert.ok(!_.is.Dictionary(undefined));
        assert.ok(!_.is.Dictionary(0));
        assert.ok(!_.is.Dictionary(1));
        assert.ok(!_.is.Dictionary(""));
        assert.ok(!_.is.Dictionary("string"));
        assert.ok(!_.is.Dictionary([ "a", ]));
        assert.ok(_.is.Dictionary({ "a": "n" }));
    });
    it('is.Object', function() {

        assert.ok(!_.is.Object(null));
        assert.ok(!_.is.Object(undefined));
        assert.ok(!_.is.Object(0));
        assert.ok(!_.is.Object(1));
        assert.ok(!_.is.Object(""));
        assert.ok(!_.is.Object("string"));
        assert.ok(_.is.Object([ "a", ]));
        assert.ok(_.is.Object({ "a": "n" }));
        assert.ok(_.is.Object(function() {}));
    });
    it('is.Null', function() {

        assert.ok(_.is.Null(null));
        assert.ok(!_.is.Null(undefined));
        assert.ok(!_.is.Null(0));
        assert.ok(!_.is.Null(1));
        assert.ok(!_.is.Null(""));
        assert.ok(!_.is.Null("string"));
        assert.ok(!_.is.Null([ "a", ]));
        assert.ok(!_.is.Null({ "a": "n" }));
        assert.ok(!_.is.Null(function() {}));
    });
    it('is.Undefined', function() {

        assert.ok(!_.is.Undefined(null));
        assert.ok(_.is.Undefined(undefined));
        assert.ok(!_.is.Undefined(0));
        assert.ok(!_.is.Undefined(1));
        assert.ok(!_.is.Undefined(""));
        assert.ok(!_.is.Undefined("string"));
        assert.ok(!_.is.Undefined([ "a", ]));
        assert.ok(!_.is.Undefined({ "a": "n" }));
        assert.ok(!_.is.Undefined(function() {}));
    });
    it('is.Boolean', function() {

        assert.ok(!_.is.Boolean(null));
        assert.ok(!_.is.Boolean(undefined));
        assert.ok(!_.is.Boolean(0));
        assert.ok(!_.is.Boolean(1));
        assert.ok(_.is.Boolean(false));
        assert.ok(_.is.Boolean(true));
        assert.ok(!_.is.Boolean(""));
        assert.ok(!_.is.Boolean("string"));
        assert.ok(!_.is.Boolean([ "a", ]));
        assert.ok(!_.is.Boolean({ "a": "n" }));
        assert.ok(!_.is.Boolean(function() {}));
    });
    it('is.Number', function() {

        assert.ok(!_.is.Number(null));
        assert.ok(!_.is.Number(undefined));
        assert.ok(_.is.Number(0));
        assert.ok(_.is.Number(1));
        assert.ok(_.is.Number(0.1));
        assert.ok(_.is.Number(1.2));
        assert.ok(!_.is.Number(false));
        assert.ok(!_.is.Number(true));
        assert.ok(!_.is.Number(""));
        assert.ok(!_.is.Number("string"));
        assert.ok(!_.is.Number([ "a", ]));
        assert.ok(!_.is.Number({ "a": "n" }));
        assert.ok(!_.is.Number(function() {}));
    });
    it('is.Integer', function() {

        assert.ok(!_.is.Integer(NaN));
        assert.ok(!_.is.Integer(new Date()));
        assert.ok(!_.is.Integer(/^hello world$/));
        assert.ok(!_.is.Integer(null));
        assert.ok(!_.is.Integer(undefined));
        assert.ok(_.is.Integer(0));
        assert.ok(_.is.Integer(1));
        assert.ok(!_.is.Integer(0.1));
        assert.ok(!_.is.Integer(1.2));
        assert.ok(!_.is.Integer(false));
        assert.ok(!_.is.Integer(true));
        assert.ok(!_.is.Integer(""));
        assert.ok(!_.is.Integer("string"));
        assert.ok(!_.is.Integer([ "a", ]));
        assert.ok(!_.is.Integer({ "a": "n" }));
        assert.ok(!_.is.Integer(function() {}));
    });
    it('is.Date', function() {

        assert.ok(!_.is.Date(NaN));
        assert.ok(_.is.Date(new Date()));
        assert.ok(!_.is.Date(/^hello world$/));
        assert.ok(!_.is.Date(null));
        assert.ok(!_.is.Date(undefined));
        assert.ok(!_.is.Date(0));
        assert.ok(!_.is.Date(1));
        assert.ok(!_.is.Date(0.1));
        assert.ok(!_.is.Date(1.2));
        assert.ok(!_.is.Date(false));
        assert.ok(!_.is.Date(true));
        assert.ok(!_.is.Date(""));
        assert.ok(!_.is.Date("string"));
        assert.ok(!_.is.Date([ "a", ]));
        assert.ok(!_.is.Date({ "a": "n" }));
        assert.ok(!_.is.Date(function() {}));
    });
    it('is.RegExp', function() {

        assert.ok(!_.is.RegExp(NaN));
        assert.ok(!_.is.RegExp(new Date()));
        assert.ok(_.is.RegExp(/^hello world$/));
        assert.ok(!_.is.RegExp(null));
        assert.ok(!_.is.RegExp(undefined));
        assert.ok(!_.is.RegExp(0));
        assert.ok(!_.is.RegExp(1));
        assert.ok(!_.is.RegExp(0.1));
        assert.ok(!_.is.RegExp(1.2));
        assert.ok(!_.is.RegExp(false));
        assert.ok(!_.is.RegExp(true));
        assert.ok(!_.is.RegExp(""));
        assert.ok(!_.is.RegExp("string"));
        assert.ok(!_.is.RegExp([ "a", ]));
        assert.ok(!_.is.RegExp({ "a": "n" }));
        assert.ok(!_.is.RegExp(function() {}));
    });
    it('is.NaN', function() {

        assert.ok(_.is.NaN(NaN));
        assert.ok(!_.is.NaN(new Date()));
        assert.ok(!_.is.NaN(/^hello world$/));
        assert.ok(!_.is.NaN(null));
        assert.ok(!_.is.NaN(undefined));
        assert.ok(!_.is.NaN(0));
        assert.ok(!_.is.NaN(1));
        assert.ok(!_.is.NaN(0.1));
        assert.ok(!_.is.NaN(1.2));
        assert.ok(!_.is.NaN(false));
        assert.ok(!_.is.NaN(true));
        assert.ok(!_.is.NaN(""));
        assert.ok(!_.is.NaN("string"));
        assert.ok(!_.is.NaN([ "a", ]));
        assert.ok(!_.is.NaN({ "a": "n" }));
        assert.ok(!_.is.NaN(function() {}));
    });
    it('is.AbsoluteURL', function() {

        assert.ok(!_.is.AbsoluteURL(NaN));
        assert.ok(!_.is.AbsoluteURL(new Date()));
        assert.ok(!_.is.AbsoluteURL(/^hello world$/));
        assert.ok(!_.is.AbsoluteURL(null));
        assert.ok(!_.is.AbsoluteURL(undefined));
        assert.ok(!_.is.AbsoluteURL(0));
        assert.ok(!_.is.AbsoluteURL(1));
        assert.ok(!_.is.AbsoluteURL(0.1));
        assert.ok(!_.is.AbsoluteURL(1.2));
        assert.ok(!_.is.AbsoluteURL(false));
        assert.ok(!_.is.AbsoluteURL(true));
        assert.ok(!_.is.AbsoluteURL(""));
        assert.ok(!_.is.AbsoluteURL("string"));
        assert.ok(!_.is.AbsoluteURL([ "a", ]));
        assert.ok(!_.is.AbsoluteURL({ "a": "n" }));
        assert.ok(!_.is.AbsoluteURL(function() {}));

        assert.ok(_.is.AbsoluteURL("ftp://example.com"));
        assert.ok(_.is.AbsoluteURL("ftp://example.com/sub#1"));
        assert.ok(_.is.AbsoluteURL("http://example.com"));
        assert.ok(_.is.AbsoluteURL("http://example.com/sub#1"));
        assert.ok(_.is.AbsoluteURL("https://example.com"));
        assert.ok(_.is.AbsoluteURL("https://example.com/sub#1"));
        assert.ok(!_.is.AbsoluteURL("example.com/hi"));
        assert.ok(_.is.AbsoluteURL("iot:xxx")); // don't love it
    });
})
