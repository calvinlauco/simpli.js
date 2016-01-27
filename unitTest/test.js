"use strict";

QUnit.test('simpli', function(assert) {
    assert.notStrictEqual(typeof simpli, "undefined", "simpli exists in global");
});

QUnit.module("simpli.getClass()");
var self = this;
QUnit.test('getClass(this) === "Global"', function(assert) {
    assert.strictEqual(simpli.getClass(self), "Global");
});
QUnit.test('getClass(window) === "Global"', function(assert) {
    assert.strictEqual(simpli.getClass(window), "Global");
});
QUnit.test('getClass("string") === "String"', function(assert) {
    assert.strictEqual(simpli.getClass("string"), "String");
});
QUnit.test('getClass(1) === "Number"', function(assert) {
    assert.strictEqual(simpli.getClass(1), "Number");
});
QUnit.test('getClass([1,2,3]) === "Array"', function(assert) {
    assert.strictEqual(simpli.getClass([1,2,3]), "Array");
});
QUnit.test('getClass(document.getElementById("qunit-fixture")) === "HTMLDivElement"', function(assert) {
    assert.strictEqual(simpli.getClass(document.getElementById("qunit-fixture")), "HTMLDivElement");
    /* 
     * There is no HTMLDivElement in old IE browsers, in such case this test
     * always fail and return Object instead
     */
});

QUnit.module("simpli.isset()");
QUnit.test('isset({provided argument}) === true', function(assert) {
    (function(reqArg, optArg) {
        assert.strictEqual(simpli.isset(reqArg), true);
    })(true);
});
QUnit.test('isset({not provided argument}) === false', function(assert) {
    (function(reqArg, optArg) {
        assert.strictEqual(simpli.isset(optArg), false);
    })(true);
});
QUnit.test('isset(undefined) === false', function(assert) {
    (function(reqArg, optArg) {
        assert.strictEqual(simpli.isset(optArg), false);
    })(true, undefined);
});
QUnit.test('isset(null) === false', function(assert) {
    (function(reqArg, optArg) {
        assert.strictEqual(simpli.isset(optArg), false);
    })(true, null);
});

QUnit.module("simpli.isNan()");
QUnit.test('isNaN(NaN) === true', function(assert) {
    assert.strictEqual(simpli.isNaN(NaN), true);
});
QUnit.test('isNaN({}) === false', function(assert) {
    assert.strictEqual(simpli.isNaN({}), false);
});

QUnit.module("simpli.isInteger()");
QUnit.test('isInteger(1) === true', function(assert) {
    assert.strictEqual(simpli.isInteger(1), true);
});
QUnit.test('isInteger(1.1) === false', function(assert) {
    assert.strictEqual(simpli.isInteger(1.1), false);
});
QUnit.test('isInteger("string") === false', function(assert) {
    assert.strictEqual(simpli.isInteger("string"), false);
});

QUnit.module("simpli.isArray()");
QUnit.test('isArray([1,2,3]) === true', function(assert) {
    assert.strictEqual(simpli.isArray([1,2,3]), true);
});
QUnit.test('isArray({}) === false', function(assert) {
    assert.strictEqual(simpli.isArray({}), false);
});
QUnit.test('isArray("string") === false', function(assert) {
    assert.strictEqual(simpli.isArray("string"), false);
});
QUnit.test('isArray({length:0} === false)', function(assert) {
    assert.strictEqual(simpli.isArray({length:0}), false);
});
QUnit.test('isArray(document.querySelectorAll("div")) === false', function(assert) {
    assert.strictEqual(simpli.isArray(document.querySelectorAll("div")), false);
    /* 
     * There is no querySelectorAll in old IE browsers, in such case the
     * polyfill querySelectorAll is used  which gives an Array object, so 
     * this test case always fail in those browsers
     */
});

QUnit.module("simpli.isType() with implicit required flag: true");
QUnit.test('isType("string", simpli.STRING) === true', function(assert) {
    assert.strictEqual(simpli.isType("string", simpli.STRING), true);
});
QUnit.test('isType(1, simpli.NUMBER) === true', function(assert) {
    assert.strictEqual(simpli.isType(1, simpli.NUMBER), true);
});
QUnit.test('isType(1.1, simpli.NUMBER) === true', function(assert) {
    assert.strictEqual(simpli.isType(1.1, simpli.NUMBER), true);
});
QUnit.test('isType(true, simpli.BOOLEAN) === true', function(assert) {
    assert.strictEqual(simpli.isType(true, simpli.BOOLEAN), true);
});
QUnit.test('isType({}, simpli.OBJECT) === true', function(assert) {
    assert.strictEqual(simpli.isType({}, simpli.OBJECT), true);
});
QUnit.test('isType(function(){}, simpli.FUNCTION) === true', function(assert) {
    assert.strictEqual(simpli.isType(function(){}, simpli.FUNCTION), true);
});
QUnit.test('isType(1, simpli.INTEGER) === true', function(assert) {
    assert.strictEqual(simpli.isType(1, simpli.INTEGER), true);
});
QUnit.test('isType(1.1, simpli.INTEGER) === false', function(assert) {
    assert.strictEqual(simpli.isType(1.1, simpli.INTEGER), false);
});
QUnit.test('isType([1,2,3], simpli.ARRAY) === true', function(assert) {
    assert.strictEqual(simpli.isType([1,2,3], simpli.ARRAY), true);
});

QUnit.module("simpli.isType() with explicit required flag: true");
QUnit.test('isType("string", simpli.STRING, true) === true, true', function(assert) {
    assert.strictEqual(simpli.isType("string", simpli.STRING, true), true);
});
QUnit.test('isType(1, simpli.NUMBER, true) === true', function(assert) {
    assert.strictEqual(simpli.isType(1, simpli.NUMBER, true), true);
});
QUnit.test('isType(1.1, simpli.NUMBER, true) === true', function(assert) {
    assert.strictEqual(simpli.isType(1.1, simpli.NUMBER, true), true);
});
QUnit.test('isType(true, simpli.BOOLEAN, true) === true', function(assert) {
    assert.strictEqual(simpli.isType(true, simpli.BOOLEAN, true), true);
});
QUnit.test('isType({}, simpli.OBJECT, true) === true', function(assert) {
    assert.strictEqual(simpli.isType({}, simpli.OBJECT, true), true);
});
QUnit.test('isType(function(){}, simpli.FUNCTION, true) === true', function(assert) {
    assert.strictEqual(simpli.isType(function(){}, simpli.FUNCTION, true), true);
});
QUnit.test('isType(1, simpli.INTEGER, true) === true', function(assert) {
    assert.strictEqual(simpli.isType(1, simpli.INTEGER, true), true);
});
QUnit.test('isType(1.1, simpli.INTEGER, true) === false', function(assert) {
    assert.strictEqual(simpli.isType(1.1, simpli.INTEGER, true), false);
});
QUnit.test('isType([1,2,3], simpli.ARRAY, true) === true', function(assert) {
    assert.strictEqual(simpli.isType([1,2,3], simpli.ARRAY, true), true);
});

QUnit.module("simpli.isType() with explicit required flag: false");
QUnit.test('isType("string", simpli.STRING, false) === true, true', function(assert) {
    assert.strictEqual(simpli.isType("string", simpli.STRING, false), true);
});
QUnit.test('isType(1, simpli.NUMBER, false) === true', function(assert) {
    assert.strictEqual(simpli.isType(1, simpli.NUMBER, false), true);
});
QUnit.test('isType(1.1, simpli.NUMBER, false) === true', function(assert) {
    assert.strictEqual(simpli.isType(1.1, simpli.NUMBER, false), true);
});
QUnit.test('isType(true, simpli.BOOLEAN, false) === true', function(assert) {
    assert.strictEqual(simpli.isType(true, simpli.BOOLEAN, false), true);
});
QUnit.test('isType({}, simpli.OBJECT, false) === true', function(assert) {
    assert.strictEqual(simpli.isType({}, simpli.OBJECT, false), true);
});
QUnit.test('isType(function(){}, simpli.FUNCTION, false) === true', function(assert) {
    assert.strictEqual(simpli.isType(function(){}, simpli.FUNCTION, false), true);
});
QUnit.test('isType({not provided argument}, simpli.STRING, false) === true', function(assert) {
    (function(reqArg, optArg) {
        assert.strictEqual(simpli.isType(optArg, simpli.STRING, false), true);
    })(true);
});
QUnit.test('isType(undefined, simpli.STRING, false) === true', function(assert) {
    (function(reqArg, optArg) {
        assert.strictEqual(simpli.isType(optArg, simpli.STRING, false), true);
    })(true, undefined);
});
QUnit.test('isType(null, simpli.STRING, false) === true', function(assert) {
    (function(reqArg, optArg) {
        assert.strictEqual(simpli.isType(optArg, simpli.STRING, false), true);
    })(true, null);
});
QUnit.test('isType(1, simpli.INTEGER, false) === true', function(assert) {
    assert.strictEqual(simpli.isType(1, simpli.INTEGER, false), true);
});
QUnit.test('isType(1.1, simpli.INTEGER, false) === false', function(assert) {
    assert.strictEqual(simpli.isType(1.1, simpli.INTEGER, false), true);
});
QUnit.test('isType({not provided argument}, simpli.INTEGER, false) === true', function(assert) {
    (function(reqArg, optArg) {
        assert.strictEqual(simpli.isType(optArg, simpli.INTEGER, false), true);
    })(true);
});
QUnit.test('isType(undefined, simpli.INTEGER, false) === true', function(assert) {
    (function(reqArg, optArg) {
        assert.strictEqual(simpli.isType(optArg, simpli.INTEGER, false), true);
    })(true, undefined);
});
QUnit.test('isType(null, simpli.INTEGER, false) === true', function(assert) {
    (function(reqArg, optArg) {
        assert.strictEqual(simpli.isType(optArg, simpli.INTEGER, false), true);
    })(true, null);
});
QUnit.test('isType([1,2,3], simpli.ARRAY, false) === true', function(assert) {
    assert.strictEqual(simpli.isType([1,2,3], simpli.ARRAY, false), true);
});
QUnit.test('isType({not provided argument}, simpli.ARRAY, false) === true', function(assert) {
    (function(reqArg, optArg) {
        assert.strictEqual(simpli.isType(optArg, simpli.INTEGER, false), true);
    })(true);
});
QUnit.test('isType(undefined, simpli.ARRAY, false) === true', function(assert) {
    (function(reqArg, optArg) {
        assert.strictEqual(simpli.isType(optArg, simpli.ARRAY, false), true);
    })(true, undefined);
});
QUnit.test('isType(null, simpli.ARRAY, false) === true', function(assert) {
    (function(reqArg, optArg) {
        assert.strictEqual(simpli.isType(optArg, simpli.ARRAY, false), true);
    })(true, null);
});