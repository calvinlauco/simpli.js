"use strict";

QUnit.module("simpli");
QUnit.test("simpli", function(assert) {
    assert.notStrictEqual(typeof simpli, "undefined", 
        "simpli is defined properly.");
});

QUnit.module("basic");
QUnit.test("simpli.getClass()", function(assert) {
    assert.strictEqual(simpli.getClass(new Error()), "Error", 
        "should return \"Error\" if argument is `new Error()`");
    assert.strictEqual(simpli.getClass(arguments), "Arguments", 
        "should return \"Arguments\" if argument is `arguments`");
});

QUnit.test("simpli.isA()", function(assert) {
    assert.strictEqual(simpli.isA("foo", "String"), true, 
        "should return true if (\"foo\", \"String\")");
	var Person = function() {};
	var peter = new Person();
	assert.strictEqual(simpli.isA(peter, Person), true, 
        "should return true if (`new Person()`, `Person`)");
});

QUnit.test("simpli.isArguments()", function(assert) {
    assert.strictEqual(simpli.isArguments(arguments), true, 
        "should return `true` if argument is `Arguments` object");
	assert.strictEqual(simpli.isArguments("foo"), false, 
        "should return `false` if arguments is \"foo\"");
});


QUnit.test("simpli.isDefined()", function(assert) {
    var foo = 1;
    assert.strictEqual(simpli.isDefined(foo), true, 
		"should return `true` if argument is defined");
	var bar;
    assert.strictEqual(simpli.isDefined(bar), false, 
		"should return `false` if argument is undefined");
});

QUnit.test("simpli.isSet()", function(assert) {
	var foo = 1;
    assert.strictEqual(simpli.isSet(foo), true, 
		"should return `true` if the argument is defined and is not `null`");
	var bar;
    assert.strictEqual(simpli.isSet(bar), false, 
		"should return `false` if the argument is undefined");
    assert.strictEqual(simpli.isSet(null), false, 
		"should return `false` if the argument is defined and is `null`");
});

QUnit.test("simpli.isNull()", function(assert) {
    assert.strictEqual(simpli.isNull(null), true, 
		"should return `true` if argument is `null`");
    assert.strictEqual(simpli.isNull("foo"), false, 
		"should return `false` if argument is \"foo\")");
});

QUnit.test("simpli.isNaN()", function(assert) {
    assert.strictEqual(simpli.isNaN("foo"%1), true, 
        "should return `true` if argument is `NaN`");
    assert.strictEqual(simpli.isNaN("foo"), false, 
		"should return `false` if argument is \"foo\"");
});

QUnit.test("simpli.isMixed()", function(assert) {
    var foo = {};
    assert.strictEqual(simpli.isMixed({}), true, 
		"should return `true` if the argument is defined");
    var bar;
    assert.strictEqual(simpli.isMixed(bar), false, 
		"should return `false` if targument is undefined");
});

QUnit.test("simpli.isObject()", function(assert) {
    assert.strictEqual(simpli.isObject({}), true, 
        "should return `true` if the argument is an object");
    assert.strictEqual(simpli.isObject("foo"), false, 
        "should return `false` if the argument is a string");
    assert.strictEqual(simpli.isObject(null), false, 
        "shoud return `false` if the argument is null");
});

QUnit.test("simpli.isNumber()", function(assert) {
    assert.strictEqual(simpli.isNumber(1), true, 
        "should return `true` if the argument is a number");
    assert.strictEqual(simpli.isNumber("foo"), false, 
        "should return `false` if the argument is a string");
});

QUnit.test("simpli.isFunction()", function(assert) {
    assert.strictEqual(simpli.isFunction(function() {}), true, 
        "should return `true` if the argument is a function");
    assert.strictEqual(simpli.isFunction("foo"), false, 
        "should return `false` if the argument is a string");
});

QUnit.test("simpli.isBoolean()", function(assert) {
    assert.strictEqual(simpli.isBoolean(true), true, 
        "should return `true` if the argument is a boolean");
    assert.strictEqual(simpli.isBoolean("foo"), false, 
        "should return `false` if the argument is a string");
});

QUnit.test("simpli.isArray()", function(assert) {
    assert.strictEqual(simpli.isArray([1,2,3,4]), true, 
        "should return `true` if the argument is array");
    assert.strictEqual(simpli.isArray("bar"), false, 
        "should return `false` if the argument is a string");
});

QUnit.test("simpli.isString()", function(assert) {
    assert.strictEqual(simpli.isString("foo"), true, 
        "should return `true` if the argument is a string");
    assert.strictEqual(simpli.isString(1), false, 
        "should return `false` if the argument is an integer");
});

QUnit.test("simpli.isInteger()", function(assert) {
    assert.strictEqual(simpli.isInteger(1), true, 
        "should return `true` if the argument is an integer");
    assert.strictEqual(simpli.isInteger("foo"), false, 
        "should return `false` if the argument is a string");
});

QUnit.test("simpli.isDecimal()", function(assert) {
    assert.strictEqual(simpli.isDecimal(1.1), true, 
        "should return `true` if it is decimal number");
    assert.strictEqual(simpli.isDecimal(1e-2), true, 
        "should return `true` if the argument is decimal number in "+
        "scientific notation");
    assert.strictEqual(simpli.isDecimal(12.1, 2), true, 
        "should return `true` if the argument matches length of whole "+
        "part");
    assert.strictEqual(simpli.isDecimal(12.123, 2, 3), true, 
        "should return `true` if the argument matches length of whole part"+
        "and length of decimal part");
    assert.strictEqual(simpli.isDecimal(12.123, 1, 3), false, 
        "should return `false` if the argument does not match length of "+
        "whole part");
    assert.strictEqual(simpli.isDecimal(12.123, 1, 1), false, 
        "should return `false` if the argument does not match length of "+
        "whole part and length of decimal part");

    assert.strictEqual(simpli.isDecimal(1), true, 
        "should return `true` if the argument is integer ");
    assert.strictEqual(simpli.isDecimal(1, 1), true, 
        "should return `true` if the integer argument matches the length of "+
        "whole part");
    assert.strictEqual(simpli.isDecimal(1, 2), false, 
        "should return `false` if the integer argument does not match the "+
        " length of whole part");
    assert.strictEqual(simpli.isDecimal(1, 1, 15), true, 
        "should return `true` if the integer argument with any length of "+
        "decimal part");

    assert.strictEqual(simpli.isDecimal("foo"), false, 
        "should return `false` if the argument is a string");

    assert.raises(function() { simpli.isDecimal(1.1, "foo"); },  
        "should raised TypeError if 2nd arugment is string");
    assert.raises(function() { simpli.isDecimal(1.1, 1, "foo"); },  
        "simpli.isDecimal(1.1, 1, \"foo\")");
    assert.raises(function() { simpli.isDecimal(1.1, 1.1); },  
        "should raised TypeError if 2nd arugment is decimal");
    assert.raises(function() { simpli.isDecimal(1.1, 1, 1.1); },  
        "should raised TypeError if 3rd arugment is decimal");
});

QUnit.test("simpli.isChar()", function(assert) {
    assert.strictEqual(simpli.isChar('a'), true, 
        "should return `true` if the argument is a character");
    assert.strictEqual(simpli.isChar("foo"), false, 
        "should return `false` if the argument is a string");
});

QUnit.test("simpli.isObjectArray()", function(assert) {
    assert.strictEqual(simpli.isObjectArray([{},{},{}]), true, 
        "should return `true` if argument is object array");
    assert.strictEqual(simpli.isObjectArray([{},{},{}], 3), true, 
        "should return `true` if 1st argument has less element than size");
    assert.strictEqual(simpli.isObjectArray(["foo", {}]), false, 
        "should return `false` if 1st argument is not object array");
    assert.strictEqual(simpli.isObjectArray(["foo", {}], 2), false, 
        "should return `false` if 1st argument is not object array");
    assert.strictEqual(simpli.isObjectArray([{},{},{}], 2), false, 
        "should return `false` if 1st argument has more element than size");
});

// TODO
QUnit.test("simpli.isNumberArray()", function(assert) {
    assert.strictEqual(simpli.isNumberArray([1, 2, 3]), true, 
        "should return `true` if argument is integer array");
    assert.strictEqual(simpli.isNumberArray([1, 2, 3], 3), true, 
        "should return `true` if argument matches the size");
    assert.strictEqual(simpli.isNumberArray(["foo", "bar"]), false, 
        "should return `false` if argument is string array");
    assert.strictEqual(simpli.isNumberArray([1, "foo"], 2), false, 
        "should return `false` if argument is mixed array");
});

QUnit.test("simpli.isFunctionArray()", function(assert) {
    assert.strictEqual(simpli.isFunctionArray(
        [function() {}, function() {}]), true, 
        "should return `true` if argument is function array");
    assert.strictEqual(simpli.isFunctionArray(
        [function() {}, function() {}], 2), true, 
        "should return `true` if argument matches the size");
    assert.strictEqual(simpli.isFunctionArray(["foo", "bar"]), false, 
        "should return `false` if argument is string array");
    assert.strictEqual(simpli.isFunctionArray([function() {}, "foo"], 2), false, 
        "should return `false` if argument is mixed array");
});

QUnit.test("simpli.isBooleanArray()", function(assert) {
    assert.strictEqual(simpli.isBooleanArray([true, true, false]), true, 
        "should return `true` if argument is boolean array");
    assert.strictEqual(simpli.isBooleanArray([true, true, false], 3), true, 
        "should return `true` if argument matches the size");
    assert.strictEqual(simpli.isBooleanArray(["foo", "bar"]), false, 
        "should return `false` if argument is string array");
    assert.strictEqual(simpli.isBooleanArray([true, "foo"], 2), false, 
        "should return `false` if argument is mixed array");
});

QUnit.test("simpli.isIntegerArray()", function(assert) {
    assert.strictEqual(simpli.isIntegerArray([1, 2, 3]), true, 
        "should return `true` if argument is integer array");
    assert.strictEqual(simpli.isIntegerArray([1, 2, 3], 3), true, 
        "should return `true` if argument matches the size");
    assert.strictEqual(simpli.isIntegerArray(["foo", "bar"]), false, 
        "should return `false` if argument is string array");
    assert.strictEqual(simpli.isIntegerArray([1, "foo"], 2), false, 
        "should return `false` if argument is mixed array");
});

QUnit.test("simpli.isDecimalArray()", function(assert) {
    assert.strictEqual(simpli.isDecimalArray([1.1, 2.1, 3.1]), true, 
        "should return `true` if argument is decimal array");
    assert.strictEqual(simpli.isDecimalArray([1, 2, 3.1, 4.1, 5]), true, 
        "should return `true` if argument is mixed array of integer and " +
        "decimal");
    assert.strictEqual(simpli.isDecimalArray([1.1, 2.1, 3.1], 3), true, 
        "should return `true` if argument matches the size");
    assert.strictEqual(simpli.isDecimalArray(["foo", "bar"]), false, 
        "should return `false` if argument is string array");
    assert.strictEqual(simpli.isDecimalArray([1.1, "foo"], 2), false, 
        "should return `false` if argument is mixed array");
});

QUnit.test("simpli.isStringArray()", function(assert) {
    assert.strictEqual(simpli.isStringArray(["foo", "bar", "baz"]), true, 
        "should return `true` if argument is string array");
    assert.strictEqual(simpli.isStringArray(["foo", "bar", "baz"], 3), true, 
        "should return `true` if argument matches the size");
    assert.strictEqual(simpli.isStringArray([1, 2]), false, 
        "should return `false` if argument is integer array");
    assert.strictEqual(simpli.isStringArray(["foo", {}], 2), false, 
        "should return `false` if argument is mixed array");
});
