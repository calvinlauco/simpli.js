"use strict";

QUnit.test('simpli', function(assert) {
    assert.notStrictEqual(typeof simpli, "undefined", "simpli exists in global");
});

QUnit.module("simpli.BinaryTreeNode");
QUnit.test('new simpliBinaryTreeNode(2).getData() === 2', function(assert) {
    assert.strictEqual(new simpli.BinaryTreeNode(2).getData(), 2);
});
QUnit.test('new simpli.BinaryTreeNode(3).setLeftNode(new simpli.BinaryTreeNode(1)).getLeftNode().getData() === 1', function(assert) {
    assert.strictEqual(new simpli.BinaryTreeNode(3).setLeftNode(new simpli.BinaryTreeNode(1)).getLeftNode().getData(), 1);
});
QUnit.test('new simpli.BinaryTreeNode(4).setLeftNode(2).getLeftNode().getData() === 2', function(assert) {
    assert.strictEqual(new simpli.BinaryTreeNode(4).setLeftNode(2).getLeftNode().getData(), 2);
});
QUnit.test('new simpli.BinaryTreeNode(5).hasLeftNode() === false', function(assert) {
    assert.strictEqual(new simpli.BinaryTreeNode(5).hasLeftNode(), false);
});
QUnit.test('new simpli.BinaryTreeNode(6).setLeftNode(new simpli.BinaryTreeNode(3)).hasLeftNode() === true', function(assert) {
    assert.strictEqual(new simpli.BinaryTreeNode(6).setLeftNode(new simpli.BinaryTreeNode(3)).hasLeftNode(), true);
});
QUnit.test('new simpliBinaryTreeNode(7).getLeftNode() === {right node object} after setting left node', function(assert) {
    var vNode = new simpli.BinaryTreeNode(7);
    var vLeftNode = new simpli.BinaryTreeNode(4);
    vNode.setLeftNode(vLeftNode);
    assert.strictEqual(vNode.getLeftNode(), vLeftNode);
});
QUnit.test('new simpli.BinaryTreeNode(8).setRightNode(new simpli.BinaryTreeNode(5)).getRightNode().getData() === 5', function(assert) {
    assert.strictEqual(new simpli.BinaryTreeNode(8).setRightNode(new simpli.BinaryTreeNode(5)).getRightNode().getData(), 5);
});
QUnit.test('new simpli.BinaryTreeNode(9).setRightNode(6).getRightNode().getData() === 6', function(assert) {
    assert.strictEqual(new simpli.BinaryTreeNode(9).setRightNode(6).getRightNode().getData(), 6);
});
QUnit.test('new simpli.BinaryTreeNode(10).hasRightNode() === false', function(assert) {
    assert.strictEqual(new simpli.BinaryTreeNode(10).hasRightNode(), false);
});
QUnit.test('new simpli.BinaryTreeNode(11).setRightNode(new simpli.BinaryTreeNode(7)).hasRightNode() === true', function(assert) {
    assert.strictEqual(new simpli.BinaryTreeNode(11).setRightNode(new simpli.BinaryTreeNode(7)).hasRightNode(), true);
});
QUnit.test('new simpliBinaryTreeNode(12).getRightNode() === {right node object} after setting right node', function(assert) {
    var vNode = new simpli.BinaryTreeNode(12);
    var vRightNode = new simpli.BinaryTreeNode(8);
    vNode.setRightNode(vRightNode);
    assert.strictEqual(vNode.getRightNode(), vRightNode);
});

QUnit.module("simpli.BinaryTree");
QUnit.test('new simpli.BinaryTree(15).getRoot().getData() === 15', function(assert) {
    assert.strictEqual(new simpli.BinaryTree(15).getRoot().getData(), 15);
});
QUnit.test('new simpli.BinaryTree(new simpli.BinaryTreeNode(15)).getRoot().getData() === 15', function(assert) {
    assert.strictEqual(new simpli.BinaryTree(new simpli.BinaryTreeNode(15)).getRoot().getData(), 15);
});
QUnit.test('new simpli.BinaryTree(new simpli.BinaryTreeNode(...)).preOrder()', function(assert) {
    assert.deepEqual(new simpli.BinaryTree(
        new simpli.BinaryTreeNode(1).
        setLeftNode(
            new simpli.BinaryTreeNode(2).
                setLeftNode(new simpli.BinaryTreeNode(4)).
                setRightNode(new simpli.BinaryTreeNode(5))
        ).
        setRightNode(3)
    ).preOrder(), [1,2,4,5,3]);
});
QUnit.test('new simpli.BinaryTree(1).insert(2).insert(3).insert(4).insert(5)).getSize() === 5', function(assert) {
    assert.strictEqual(new simpli.BinaryTree(1).insert(2).insert(3).insert(4).insert(5).getSize(), 5);
});
QUnit.test('new simpli.BinaryTree(new simpli.BinaryTreeNode(...)).getSize()', function(assert) {
    assert.strictEqual(new simpli.BinaryTree(
        new simpli.BinaryTreeNode(1).
        setLeftNode(
            new simpli.BinaryTreeNode(2).
                setLeftNode(new simpli.BinaryTreeNode(4)).
                setRightNode(new simpli.BinaryTreeNode(5))
        ).
        setRightNode(3)
    ).getSize(), 5);
});
QUnit.test('new simpli.BinaryTree(new simpli.BinaryTreeNode(...)).insert() can fill the upper-most vacancy', function(assert) {
    assert.deepEqual(new simpli.BinaryTree(
        new simpli.BinaryTreeNode(1).
        setLeftNode(
            new simpli.BinaryTreeNode(2).
                setLeftNode(new simpli.BinaryTreeNode(4).
                    setLeftNode(new simpli.BinaryTreeNode(8))
                )
        ).
        setRightNode(3)
    ).insert(5).insert(6).preOrder(), [1,2,4,8,5,3,6]);
});
QUnit.test('new simpli.BinaryTree(1).insert(2).insert(3).insert(4).insert(5)).getSize().preOrder() == [1,2,4,5,3]', function(assert) {
    assert.deepEqual(new simpli.BinaryTree(1).insert(2).insert(3).insert(4).insert(5).preOrder(), [1,2,4,5,3]);
});
QUnit.test('new simpli.BinaryTree(new simpli.BinaryTreeNode(...)).insert() can fill the upper-most vacancy', function(assert) {
    assert.deepEqual(new simpli.BinaryTree(
        new simpli.BinaryTreeNode(1).
        setLeftNode(
            new simpli.BinaryTreeNode(2).
                setLeftNode(new simpli.BinaryTreeNode(4).
                    setLeftNode(new simpli.BinaryTreeNode(8))
                )
        ).
        setRightNode(3)
    ).insert(5).insert(6).inOrder(), [8,4,2,5,1,6,3]);
});
QUnit.test('new simpli.BinaryTree(1).insert(2).insert(3).insert(4).insert(5)).getSize().preOrder() == [4,2,5,1,3]', function(assert) {
    assert.deepEqual(new simpli.BinaryTree(1).insert(2).insert(3).insert(4).insert(5).inOrder(), [4,2,5,1,3]);
});

QUnit.module("simpli.binarySearch()");
QUnit.test('simpli.binarySearch([1,3,5,7,9,11,13,15,17,19], 15) === true', function(assert) {
    assert.strictEqual(simpli.binarySearch([1,3,5,7,9,11,13,15,17,19], 15), true);
});
QUnit.test('simpli.binarySearch([1,3,5,7,9,11,13,15,17,19], 11) === true', function(assert) {
    assert.strictEqual(simpli.binarySearch([1,3,5,7,9,11,13,15,17,19], 11), true);
});
QUnit.test('simpli.binarySearch([1,3,5,7,9,11,13,15,17,19], 12) === false', function(assert) {
    assert.strictEqual(simpli.binarySearch([1,3,5,7,9,11,13,15,17,19], 12), false);
});
QUnit.test('simpli.binarySearch([1,3,5,7,9,11,13,15,17,19,21], 15) === true', function(assert) {
    assert.strictEqual(simpli.binarySearch([1,3,5,7,9,11,13,15,17,19,21], 15), true);
});
QUnit.test('simpli.binarySearch([1,3,5,7,9,11,13,15,17,19,21], 11) === true', function(assert) {
    assert.strictEqual(simpli.binarySearch([1,3,5,7,9,11,13,15,17,19,21], 11), true);
});
QUnit.test('simpli.binarySearch([1,3,5,7,9,11,13,15,17,19,21], 12) === false', function(assert) {
    assert.strictEqual(simpli.binarySearch([1,3,5,7,9,11,13,15,17,19,21], 12), false);
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
QUnit.test('simpli.getClass(new simpli.BinaryTreeNode(1)) === "simpli.BinaryTreeNode"', function(assert) {
    assert.strictEqual(simpli.getClass(new simpli.BinaryTreeNode(1)), "simpli.BinaryTreeNode");
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
QUnit.test('isType([1,2,3], [simpli.STRING, simpli.ARRAY]) === true', function(assert) {
    assert.strictEqual(simpli.isType([1,2,3], [simpli.STRING, simpli.ARRAY]), true);
});
QUnit.test('isType([1,2,3], {Array:simpli.INTEGER}) === true', function(assert) {
    assert.strictEqual(simpli.isType([1,2,3], {Array:simpli.INTEGER}), true);
});
QUnit.test('isType([1,2,3], {Array:simpli.STRING}) === true', function(assert) {
    assert.strictEqual(simpli.isType([1,2,3], {Array:simpli.STRING}), false);
});
QUnit.test('isType([1,2,3], {Object:simpli.ARRAY}) === true', function(assert) {
    assert.strictEqual(simpli.isType([1,2,3], {Object:simpli.ARRAY}), true);
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
QUnit.test('isType([1,2,3], [simpli.STRING, simpli.ARRAY], true) === true', function(assert) {
    assert.strictEqual(simpli.isType([1,2,3], [simpli.STRING, simpli.ARRAY], true), true);
});
QUnit.test('isType([1,2,3], {Array:simpli.INTEGER}, true) === true', function(assert) {
    assert.strictEqual(simpli.isType([1,2,3], {Array:simpli.INTEGER}, true), true);
});
QUnit.test('isType([1,2,3], {Array:simpli.STRING}, true) === true', function(assert) {
    assert.strictEqual(simpli.isType([1,2,3], {Array:simpli.STRING}, true), false);
});
QUnit.test('isType([1,2,3], {Object:simpli.ARRAY}, true) === true', function(assert) {
    assert.strictEqual(simpli.isType([1,2,3], {Object:simpli.ARRAY}, true), true);
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
    assert.strictEqual(simpli.isType(1.1, simpli.INTEGER, false), false);
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
QUnit.test('isType([1,2,3], [simpli.STRING, simpli.ARRAY], false) === true', function(assert) {
    assert.strictEqual(simpli.isType([1,2,3], [simpli.STRING, simpli.ARRAY], false), true);
});
QUnit.test('isType([1,2,3], {Array:simpli.INTEGER}, false) === true', function(assert) {
    assert.strictEqual(simpli.isType([1,2,3], {Array:simpli.INTEGER}, false), true);
});
QUnit.test('isType([1,2,3], {Array:simpli.STRING}, false) === true', function(assert) {
    assert.strictEqual(simpli.isType([1,2,3], {Array:simpli.STRING}, false), false);
});
QUnit.test('isType([1,2,3], {Object:simpli.ARRAY}, false) === true', function(assert) {
    assert.strictEqual(simpli.isType([1,2,3], {Object:simpli.ARRAY}, false), true);
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