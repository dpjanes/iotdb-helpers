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

        assert.ok(!_.is.Number(NaN));
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
    it('is.AbsoluteURL', function() {
        assert.ok(!_.is.IPv4(NaN));
        assert.ok(!_.is.IPv4(new Date()));
        assert.ok(!_.is.IPv4(/^hello world$/));
        assert.ok(!_.is.IPv4(null));
        assert.ok(!_.is.IPv4(undefined));
        assert.ok(!_.is.IPv4(0));
        assert.ok(!_.is.IPv4(1));
        assert.ok(!_.is.IPv4(0.1));
        assert.ok(!_.is.IPv4(1.2));
        assert.ok(!_.is.IPv4(false));
        assert.ok(!_.is.IPv4(true));
        assert.ok(!_.is.IPv4(""));
        assert.ok(!_.is.IPv4("string"));
        assert.ok(!_.is.IPv4([ "a", ]));
        assert.ok(!_.is.IPv4({ "a": "n" }));
        assert.ok(!_.is.IPv4(function() {}));

        assert.ok(_.is.IPv4("0.0.0.0"))
        assert.ok(_.is.IPv4("1.1.1.1"))
        assert.ok(_.is.IPv4("255.255.255.255"))

        assert.ok(!_.is.IPv4("0.0.0.0.0"))
        assert.ok(!_.is.IPv4("1.1.1.1.1"))
        assert.ok(!_.is.IPv4("255.255.255.255.255"))

        assert.ok(!_.is.IPv4("0.0.0"))
        assert.ok(!_.is.IPv4("1.1.1"))
        assert.ok(!_.is.IPv4("255.255.255"))

        assert.ok(!_.is.IPv4("256.0.0.0"))
        assert.ok(!_.is.IPv4("0.256.0.0"))
        assert.ok(!_.is.IPv4("0.0.256.0"))
        assert.ok(!_.is.IPv4("0.0.0.256"))
    });
    it('is.Array.of.String', function() {
        // guarantee fails
        assert.ok(!_.is.Array.of.String(NaN));
        assert.ok(!_.is.Array.of.String(new Date()));
        assert.ok(!_.is.Array.of.String(/^hello world$/));
        assert.ok(!_.is.Array.of.String(null));
        assert.ok(!_.is.Array.of.String(undefined));
        assert.ok(!_.is.Array.of.String(0));
        assert.ok(!_.is.Array.of.String(1));
        assert.ok(!_.is.Array.of.String(0.1));
        assert.ok(!_.is.Array.of.String(1.2));
        assert.ok(!_.is.Array.of.String(false));
        assert.ok(!_.is.Array.of.String(true));
        assert.ok(!_.is.Array.of.String(""));
        assert.ok(!_.is.Array.of.String("string"));
        // assert.ok(!_.is.Array.of.String([ "a", ]));
        assert.ok(!_.is.Array.of.String({ "a": "n" }));
        assert.ok(!_.is.Array.of.String(function() {}));
    })
    it('is.Array.of.Object', function() {
        // guarantee fails
        assert.ok(!_.is.Array.of.Object(NaN));
        assert.ok(!_.is.Array.of.Object(new Date()));
        assert.ok(!_.is.Array.of.Object(/^hello world$/));
        assert.ok(!_.is.Array.of.Object(null));
        assert.ok(!_.is.Array.of.Object(undefined));
        assert.ok(!_.is.Array.of.Object(0));
        assert.ok(!_.is.Array.of.Object(1));
        assert.ok(!_.is.Array.of.Object(0.1));
        assert.ok(!_.is.Array.of.Object(1.2));
        assert.ok(!_.is.Array.of.Object(false));
        assert.ok(!_.is.Array.of.Object(true));
        assert.ok(!_.is.Array.of.Object(""));
        assert.ok(!_.is.Array.of.Object("string"));
        assert.ok(!_.is.Array.of.Object([ "a", ]));
        assert.ok(!_.is.Array.of.Object({ "a": "n" }));
        assert.ok(!_.is.Array.of.Object(function() {}));
    })
    it('is.Array.of.Dictionary', function() {
        // guarantee fails
        assert.ok(!_.is.Array.of.Dictionary(NaN));
        assert.ok(!_.is.Array.of.Dictionary(new Date()));
        assert.ok(!_.is.Array.of.Dictionary(/^hello world$/));
        assert.ok(!_.is.Array.of.Dictionary(null));
        assert.ok(!_.is.Array.of.Dictionary(undefined));
        assert.ok(!_.is.Array.of.Dictionary(0));
        assert.ok(!_.is.Array.of.Dictionary(1));
        assert.ok(!_.is.Array.of.Dictionary(0.1));
        assert.ok(!_.is.Array.of.Dictionary(1.2));
        assert.ok(!_.is.Array.of.Dictionary(false));
        assert.ok(!_.is.Array.of.Dictionary(true));
        assert.ok(!_.is.Array.of.Dictionary(""));
        assert.ok(!_.is.Array.of.Dictionary("string"));
        assert.ok(!_.is.Array.of.Dictionary([ "a", ]));
        assert.ok(!_.is.Array.of.Dictionary({ "a": "n" }));
        assert.ok(!_.is.Array.of.Dictionary(function() {}));
    })
    it('is.Timestamp', function() {
        // guarantee fails
        assert.ok(!_.is.Timestamp(NaN));
        assert.ok(!_.is.Timestamp(new Date()));
        assert.ok(!_.is.Timestamp(/^hello world$/));
        assert.ok(!_.is.Timestamp(null));
        assert.ok(!_.is.Timestamp(undefined));
        assert.ok(!_.is.Timestamp(0));
        assert.ok(!_.is.Timestamp(1));
        assert.ok(!_.is.Timestamp(0.1));
        assert.ok(!_.is.Timestamp(1.2));
        assert.ok(!_.is.Timestamp(false));
        assert.ok(!_.is.Timestamp(true));
        assert.ok(!_.is.Timestamp(""));
        assert.ok(!_.is.Timestamp("string"));
        assert.ok(!_.is.Timestamp([ "a", ]));
        assert.ok(!_.is.Timestamp({ "a": "n" }));
        assert.ok(!_.is.Timestamp(function() {}));

        assert.ok(_.is.Timestamp(_.timestamp.make()))
        assert.ok(_.is.Timestamp('2016-12-02T15:49:56.526Z'))
    })
    it('is.Dictionary', function() {
        assert.ok(!_.is.Dictionary(NaN));
        assert.ok(!_.is.Dictionary(new Date()));
        assert.ok(!_.is.Dictionary(/^hello world$/));
        assert.ok(!_.is.Dictionary(null));
        assert.ok(!_.is.Dictionary(undefined));
        assert.ok(!_.is.Dictionary(0));
        assert.ok(!_.is.Dictionary(1));
        assert.ok(!_.is.Dictionary(0.1));
        assert.ok(!_.is.Dictionary(1.2));
        assert.ok(!_.is.Dictionary(false));
        assert.ok(!_.is.Dictionary(true));
        assert.ok(!_.is.Dictionary(""));
        assert.ok(!_.is.Dictionary("string"));
        assert.ok(!_.is.Dictionary([ "a", ]));
        assert.ok(!_.is.Dictionary(function() {}));

        assert.ok(!_.is.JSON({ something: NaN }));
        assert.ok(!_.is.JSON({ something: new Date() }));
        assert.ok(!_.is.JSON({ something: /^hello world$/ }));
        assert.ok(!_.is.JSON({ something: undefined }));
        assert.ok(!_.is.JSON({ something: function() {} }));

        assert.ok(_.is.Dictionary({ "a": "n" }));
        assert.ok(_.is.Dictionary({ "a": [ "b", "c", "d", { "e": "f", "g": [ "hi", "hi", 1, null, true ]}]} ));
    })
    it('is.JSON', function() {
        assert.ok(!_.is.JSON(NaN));
        assert.ok(!_.is.JSON(new Date()));
        assert.ok(!_.is.JSON(/^hello world$/));
        assert.ok(!_.is.JSON(undefined));
        assert.ok(!_.is.JSON(function() {}));

        assert.ok(!_.is.JSON([ NaN ]));
        assert.ok(!_.is.JSON([ new Date() ]));
        assert.ok(!_.is.JSON([ /^hello world$/ ]));
        assert.ok(!_.is.JSON([ undefined ]));
        assert.ok(!_.is.JSON([ function() {} ]));

        assert.ok(!_.is.JSON({ something: NaN }));
        assert.ok(!_.is.JSON({ something: new Date() }));
        assert.ok(!_.is.JSON({ something: /^hello world$/ }));
        assert.ok(!_.is.JSON({ something: undefined }));
        assert.ok(!_.is.JSON({ something: function() {} }));

        assert.ok(_.is.JSON(null));
        assert.ok(_.is.JSON(0));
        assert.ok(_.is.JSON(1));
        assert.ok(_.is.JSON(0.1));
        assert.ok(_.is.JSON(1.2));
        assert.ok(_.is.JSON(false));
        assert.ok(_.is.JSON(true));
        assert.ok(_.is.JSON(""));
        assert.ok(_.is.JSON("string"));
        assert.ok(_.is.JSON([ "a", ]));
        assert.ok(_.is.JSON({ "a": "n" }));

        assert.ok(_.is.JSON({ "a": [ "b", "c", "d", { "e": "f", "g": [ "hi", "hi", 1, null, true ]}]} ));
    })
    it('is.Atomic', function() {
        assert.ok(!_.is.Atomic(NaN));
        assert.ok(!_.is.Atomic(new Date()));
        assert.ok(!_.is.Atomic(/^hello world$/));
        assert.ok(!_.is.Atomic(undefined));
        assert.ok(!_.is.Atomic([ "a", ]));
        assert.ok(!_.is.Atomic({ "a": "n" }));
        assert.ok(!_.is.Atomic(function() {}));

        assert.ok(_.is.Atomic(null));
        assert.ok(_.is.Atomic(0));
        assert.ok(_.is.Atomic(1));
        assert.ok(_.is.Atomic(0.1));
        assert.ok(_.is.Atomic(1.2));
        assert.ok(_.is.Atomic(false));
        assert.ok(_.is.Atomic(true));
        assert.ok(_.is.Atomic(""));
        assert.ok(_.is.Atomic("string"));
    })
    it('is.unsorted', function() {
        assert.strictEqual(_.is.unsorted("a", "b"), -1)
        assert.strictEqual(_.is.unsorted("b", "a"), 1)
        assert.strictEqual(_.is.unsorted("b", "b"), 0)

        assert.strictEqual(_.is.unsorted(1, 2), -1)
        assert.strictEqual(_.is.unsorted(2, 1), 1)
        assert.strictEqual(_.is.unsorted(2, 2), 0)

        assert.strictEqual(_.is.unsorted(false, true), -1)
        assert.strictEqual(_.is.unsorted(true, false), 1)
        assert.strictEqual(_.is.unsorted(true, true), 0)
        assert.strictEqual(_.is.unsorted(false, false), 0)
    })
    it('is.QName', function() {

        assert.ok(!_.is.QName(NaN));
        assert.ok(!_.is.QName(new Date()));
        assert.ok(!_.is.QName(/^hello world$/));
        assert.ok(!_.is.QName(null));
        assert.ok(!_.is.QName(undefined));
        assert.ok(!_.is.QName(0));
        assert.ok(!_.is.QName(1));
        assert.ok(!_.is.QName(0.1));
        assert.ok(!_.is.QName(1.2));
        assert.ok(!_.is.QName(false));
        assert.ok(!_.is.QName(true));
        assert.ok(!_.is.QName(""));
        assert.ok(!_.is.QName("string"));
        assert.ok(!_.is.QName([ "a", ]));
        assert.ok(!_.is.QName({ "a": "n" }));
        assert.ok(!_.is.QName(function() {}));

        assert.ok(!_.is.QName("ftp://example.com"));
        assert.ok(!_.is.QName("ftp://example.com/sub#1"));
        assert.ok(!_.is.QName("http://example.com"));
        assert.ok(!_.is.QName("http://example.com/sub#1"));
        assert.ok(!_.is.QName("https://example.com"));
        assert.ok(!_.is.QName("https://example.com/sub#1"));
        assert.ok(!_.is.QName("example.com/hi"));
        assert.ok(_.is.QName("iot:xxx")); 
        assert.ok(_.is.QName("iot000:xxx")); 
        assert.ok(_.is.QName("IOT-000:xxx-ABC000_")); 
    });
})
