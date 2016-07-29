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

/*
var model = require("../model");
var thing_array = require("../thing_array");
var transporter = require("../transporter");
var bridge = require("../bridge");

describe('test_is', function() {
    describe('iotdb functions', function() {
        var testModel = undefined; // model.make_model().code('a').make();
        var testThing = undefined; // new testModel();
        var testThingArray0 = undefined; // new thing_array.ThingArray();
        var testThingArray1 = undefined; // new thing_array.ThingArray();
        // testThingArray1.push(testThing);

        var testBridge = undefined; // new bridge.Bridge();
        var testTransport = function() {};
        testTransport._isTransport = true;

        it('is.Model', function() {
            assert.ok(_.is.Model(testModel));
            assert.ok(!_.is.Model(testThing));
            assert.ok(!_.is.Model(testThingArray0));
            assert.ok(!_.is.Model(testThingArray1));
            assert.ok(!_.is.Model(testTransport));
            assert.ok(!_.is.Model(testBridge));
        });
        it('is.Thing', function() {
            assert.ok(!_.is.Thing(testModel));
            assert.ok(_.is.Thing(testThing));
            assert.ok(!_.is.Thing(testThingArray0));
            assert.ok(!_.is.Thing(testThingArray1));
            assert.ok(!_.is.Thing(testTransport));
            assert.ok(!_.is.Thing(testBridge));
        });
        it('is.ThingArray', function() {
            assert.ok(!_.is.ThingArray(testModel));
            assert.ok(!_.is.ThingArray(testThing));
            assert.ok(_.is.ThingArray(testThingArray0));
            assert.ok(_.is.ThingArray(testThingArray1));
            assert.ok(!_.is.ThingArray(testTransport));
            assert.ok(!_.is.ThingArray(testBridge));
        });
        it('is.Transport', function() {
            assert.ok(!_.is.Transport(testModel));
            assert.ok(!_.is.Transport(testThing));
            assert.ok(!_.is.Transport(testThingArray0));
            assert.ok(!_.is.Transport(testThingArray1));
            assert.ok(_.is.Transport(testTransport));
            assert.ok(!_.is.Transport(testBridge));
        });
        it('is.Bridge', function() {
            assert.ok(!_.is.Bridge(testModel));
            assert.ok(!_.is.Bridge(testThing));
            assert.ok(!_.is.Bridge(testThingArray0));
            assert.ok(!_.is.Bridge(testThingArray1));
            assert.ok(!_.is.Bridge(testTransport));
            assert.ok(_.is.Bridge(testBridge));
        });
        it('is.Dictionary', function() {
            assert.ok(!_.is.Dictionary(testModel));
            assert.ok(!_.is.Dictionary(testThing));
            assert.ok(!_.is.Dictionary(testThingArray0));
            assert.ok(!_.is.Dictionary(testThingArray1));
            assert.ok(!_.is.Dictionary(testTransport));
            assert.ok(!_.is.Dictionary(testBridge));
        });
        it('is.Object', function() {
            assert.ok(_.is.Object(testModel));
            assert.ok(_.is.Object(testThing));
            assert.ok(_.is.Object(testThingArray0));
            assert.ok(_.is.Object(testThingArray1));
            assert.ok(_.is.Object(testTransport));
            assert.ok(_.is.Object(testBridge));
        });
        it('is.Null', function() {
            assert.ok(!_.is.Null(testModel));
            assert.ok(!_.is.Null(testThing));
            assert.ok(!_.is.Null(testThingArray0));
            assert.ok(!_.is.Null(testThingArray1));
            assert.ok(!_.is.Null(testTransport));
            assert.ok(!_.is.Null(testBridge));
        });
        it('is.Undefined', function() {
            assert.ok(!_.is.Undefined(testModel));
            assert.ok(!_.is.Undefined(testThing));
            assert.ok(!_.is.Undefined(testThingArray0));
            assert.ok(!_.is.Undefined(testThingArray1));
            assert.ok(!_.is.Undefined(testTransport));
            assert.ok(!_.is.Undefined(testBridge));
        });
        it('is.Boolean', function() {
            assert.ok(!_.is.Boolean(testModel));
            assert.ok(!_.is.Boolean(testThing));
            assert.ok(!_.is.Boolean(testThingArray0));
            assert.ok(!_.is.Boolean(testThingArray1));
            assert.ok(!_.is.Boolean(testTransport));
            assert.ok(!_.is.Boolean(testBridge));
        });
        it('is.Number', function() {
            assert.ok(!_.is.Number(testModel));
            assert.ok(!_.is.Number(testThing));
            assert.ok(!_.is.Number(testThingArray0));
            assert.ok(!_.is.Number(testThingArray1));
            assert.ok(!_.is.Number(testTransport));
            assert.ok(!_.is.Number(testBridge));
        });
        it('is.Integer', function() {
            assert.ok(!_.is.Integer(testModel));
            assert.ok(!_.is.Integer(testThing));
            assert.ok(!_.is.Integer(testThingArray0));
            assert.ok(!_.is.Integer(testThingArray1));
            assert.ok(!_.is.Integer(testTransport));
            assert.ok(!_.is.Integer(testBridge));
        });
        it('is.Date', function() {
            assert.ok(!_.is.Date(testModel));
            assert.ok(!_.is.Date(testThing));
            assert.ok(!_.is.Date(testThingArray0));
            assert.ok(!_.is.Date(testThingArray1));
            assert.ok(!_.is.Date(testTransport));
            assert.ok(!_.is.Date(testBridge));
        });
        it('is.RegExp', function() {
            assert.ok(!_.is.RegExp(testModel));
            assert.ok(!_.is.RegExp(testThing));
            assert.ok(!_.is.RegExp(testThingArray0));
            assert.ok(!_.is.RegExp(testThingArray1));
            assert.ok(!_.is.RegExp(testTransport));
            assert.ok(!_.is.RegExp(testBridge));
        });
        it('is.NaN', function() {
            assert.ok(!_.is.NaN(testModel));
            assert.ok(!_.is.NaN(testThing));
            assert.ok(!_.is.NaN(testThingArray0));
            assert.ok(!_.is.NaN(testThingArray1));
            assert.ok(!_.is.NaN(testTransport));
            assert.ok(!_.is.NaN(testBridge));
        });
        it('is.AbsoluteURL', function() {
            assert.ok(!_.is.AbsoluteURL(testModel));
            assert.ok(!_.is.AbsoluteURL(testThing));
            assert.ok(!_.is.AbsoluteURL(testThingArray0));
            assert.ok(!_.is.AbsoluteURL(testThingArray1));
            assert.ok(!_.is.AbsoluteURL(testTransport));
            assert.ok(!_.is.AbsoluteURL(testBridge));
        });
        it('is.FindKey', function() {
            assert.ok(!_.is.FindKey(testModel));
            assert.ok(!_.is.FindKey(testThing));
            assert.ok(!_.is.FindKey(testThingArray0));
            assert.ok(!_.is.FindKey(testThingArray1));
            assert.ok(!_.is.FindKey(testTransport));
            assert.ok(!_.is.FindKey(testBridge));
        });
    })
})
*/
