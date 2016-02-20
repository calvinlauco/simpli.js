"use strict";
/**
 * SimpliJS
 * A small library consists of some useful and shorthand function
 *
 * Copyright (c) 2016 Lau Yu Hei
 * 
 * @author Lau Yu Hei
 * @version 1.0.6
 * @license The MIT License (MIT)
 * https://opensource.org/licenses/MIT
 **/

/*
 * Essential Polyfill
 * adapted from https://github.com/inexorabletash/polyfill
 */
// Document.querySelectorAll method
// http://ajaxian.com/archives/creating-a-queryselector-for-ie-that-runs-at-native-speed
// Needed for: IE7-
if (typeof document.querySelectorAll === "undefined") {
    document.querySelectorAll = function(selectors) {
        var style = document.createElement('style'), elements = [], element;
        document.documentElement.firstChild.appendChild(style);
        document._qsa = [];

        style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
        window.scrollBy(0, 0);
        style.parentNode.removeChild(style);

        while (document._qsa.length) {
            element = document._qsa.shift();
            element.style.removeAttribute('x-qsa');
            elements.push(element);
        }
        document._qsa = null;
        return elements;
    };
}
// Document.querySelector method
// Needed for: IE7-
if (typeof document.querySelector === "undefined") {
    document.querySelector = function(selectors) {
        var elements = document.querySelectorAll(selectors);
        return (elements.length) ? elements[0] : null;
    };
}
// Document.getElementsByClassName method
// Needed for: IE8-
if (typeof document.getElementsByClassName === "undefined") {
    document.getElementsByClassName = function(classNames) {
        classNames = String(classNames).replace(/^|\s+/g, '.');
        return document.querySelectorAll(classNames);
    };
}
// Document.getElementsByClassName method
// Needed for: IE8-
if (typeof Object.create === "undefined") {
    Object.create = function(prototype) {
        function C() {}
        C.prototype = prototype;
        return new C();
    };
}

/**
 * Define simpli in global scope
 */
var simpli;
/**
 * @name global
 * @namespace
 */
(function(global) {
    var _obj = ({});
    var toString = _obj.toString;
    /*
     * In Internet Explorer 11, "use strict" will create a different Window
     * object from the non-strict environment. The Window under non-strict
     * environment can be referred by variable window
     */
    var _IE11Window = (typeof window !== "undefined")? window: global;

    /**
     * Simplify an object by adding additional functions
     */
    var simplify = function(pObject) {
        /*
         * Since a HTMLCollection may contain different types of HTML 
         * elements, it is impossible to simplify the collection using any
         * of the element type other than HTMLElement
         */
        if (pObject.length == 1) {
            // single element
            if (pObject.nodeType === simpli.nodeType.DOCUMENT) {
                 _DOMCollection.simplify("document", pObject, _DOMCollection.ELEMENT);
            } else {
                 _DOMCollection.simplify("HTMLElement", pObject, _DOMCollection.ELEMENT);
                _DOMCollection.simplify(pObject[0].nodeName, pObject, _DOMCollection.ELEMENT);
            }
            pObject.toString = function() {
                return "[object simpliElement]";
            }
        } else {
            _DOMCollection.simplify("HTMLElement", pObject, _DOMCollection.COLLECTION);
            pObject.toString = function() {
                return "[object simpliCollection]";
            }
        }

        return pObject;
    }

    /**
     * @name simpli
     * @namespace
     * @memberof global
     */
    /**
     * simpli() is a function that accepts an DOM object and append additional 
     * functions to it. Instead of directly appending functions to the 
     * "prototype" property of the desired class, feeding an object to
     * simpli() has the advantage of adapting to future ECMAScript development.
     *
     * Even if the added functions are implemented as standard in the future, 
     * the simpli() is treated as a standalone object and will always override
     * the "instantiated" version of the object to gurantee the consistency of 
     * the behaviour of your program.
     *
     * @function simpli
     * @param {string|object} pSelector   selector string or a DOM object
     * @return {object}                     the simpli DOM object
     * @memberof simpli
     */
    simpli = function(pSelector) {
        var vObject;
        if (simpli.isType(pSelector, simpli.STRING)) {
            // CSS selector string
            try {
                vObject = document.querySelectorAll(pSelector);
            }catch(e) {
                throw new TypeError("Invalid selector, it should be a valid CSS selector");
            }
        } else if (simpli.isType(pSelector, simpli.OBJECT)) {
            if (simpli.getClass(pSelector) === "HTMLCollection" || simpli.isArray(pSelector)) {
                // result from document.querySelectorAll() polyfill included
                vObject = pSelector;
            } else if (typeof pSelector.nodeType !== "undefined") {
                // single element
                if (pSelector.nodeType === simpli.nodeType.ELEMENT) {
                    // condition for HTMLElement node
                    /*
                     * user provide with a HTMLElement, wrap it in an Array to 
                     * make the objec consistent with result of 
                     * document.querySelectorAll()
                     */
                    vObject = [pSelector];
                } else if (pSelector.nodeType === simpli.nodeType.DOCUMENT) {
                    // condition for document node
                    vObject = pSelector
                }
            } else {
                throw new TypeError("Invalid DOM object, it should be a DOM collection or element")
            }
        } else {
            throw new TypeError("Invalid selector, it should be a string or DOM object");
        }

        // simplify the object
        vObject = simplify(vObject);
        
        return vObject;
    };
    simpli.prototype.toString = function() {
        return "[object simpli]";
    };

    simpli.nodeType = {
        ELEMENT: 1, 
        TEXT: 3,
        COMMENT: 8, 
        DOCUMENT: 9, 
        DOCUMENT_TYPE: 10 
    };

    // data structure
    /**
     * simpli.queue is a simple queue structure
     *
     * @class Queue
     * @memberof simpli
     */
    (function() {
        simpli.Queue = function() {
            // make simpli.Queue() new-Agnostic
            if (!(this instanceof simpli.Queue)) {
                return new simpli.Queue();
            }
            this._struct = [];
            this._head = 0;
            this._tail = 0;
        };
        simpli.Queue.prototype.isEmpty = function() {
            return (this._tail === this._head);
        };
        simpli.Queue.prototype.enqueue = function(element) {
            if (!simpli.isset(element)) {
                throw new TypeError("Missing element, it should be presented");
            }
            this._struct[this._tail++] = element;
        };
        simpli.Queue.prototype.dequeue = function() {
            if (this.isEmpty()) {
                return null;
            }
            var vResult = this._struct[this._head];
            this._struct[this._head++] = null;
            return vResult;
        };
        simpli.Queue.prototype.front = function() {
            if (this.isEmpty()) {
                return null;
            }
            return this._struct[this._head];
        };
        simpli.Queue.prototype.toString = function() {
            return "[object simpli.Queue]";
        }
    })();

    /**
     * simpli.queue is a simple queue structure
     *
     * @class Stack
     * @memberof simpli
     */
    (function() {
        simpli.Stack = function() {
            if(!(this instanceof simpli.Stack)) {
                return new simpli.Stack();
            }
            this._struct = [];
            this._top = 0;
        };
        simpli.Stack.prototype.isEmpty = function() {
            return (this._top === 0);
        };
        simpli.Stack.prototype.push = function(element) {
            if (!simpli.isset(element)) {
                throw new TypeError("Missing element, it should be presented");
            }
            this._struct[++this._top] = element;
        };
        simpli.Stack.prototype.pop = function() {
            if (this.isEmpty()) {
                return null;
            }
            var vResult = this._struct[this._top];
            this._struct[this._top--] = null;
            return vResult;
        };
        simpli.Stack.prototype.top = function() {
            if (this.isEmpty()) {
                return null;
            }
            return this._struct[this._top];
        };
        simpli.Stack.prototype.toString = function() {
            return "[object simpli.Stack]";
        };
    })();

    /**
     * simpli.BinaryTreeNode is a node for binary tree
     *
     * @class BinaryTreeNode
     * @memberof simpli
     */
    (function() {
        /**
         * @constrcutor
         * @param {integer} pData   the value of the node
         * @memberof simpli.BinaryTreeNode
         */
        simpli.BinaryTreeNode = function(pData) {
            if (!(this instanceof simpli.BinaryTreeNode)) {
                return new simpli.BinaryTreeNode(pData);
            }
            if (!simpli.isType(pData, simpli.INTEGER)) {
                throw new TypeError("Invalid data, it should be an integer");
            }
            this._leftNode = null;
            this._rightNode = null;
            this._data = pData;
        }
        simpli.BinaryTreeNode.prototype.getData = function() {
            return this._data;
        };
        simpli.BinaryTreeNode.prototype.getLeftNode = function() {
            return this._leftNode;
        };
        simpli.BinaryTreeNode.prototype.hasLeftNode = function() {
            return this._leftNode !== null;
        };
        simpli.BinaryTreeNode.prototype.setLeftNode = function(pData) {
            if (!simpli.isType(pData, [simpli.INTEGER, {Object:"simpli.BinaryTreeNode"}])) {
                throw new TypeError("Invalid node, it should be an integer or simpli.BinaryTreeNode");
            }
            var vNode;
            if (simpli.isInteger(pData)) {
                vNode = new simpli.BinaryTreeNode(pData);
            } else if (simpli.isType(pData, simpli.OBJECT)) {
                if (simpli.getClass(pData) !== "simpli.BinaryTreeNode") {
                    throw new TypeError("Invalid node object, it should be a simpli.BinaryTreeNode object or null");
                }
                vNode = pData;
            }
            this._leftNode = vNode;

            return this;
        };
        simpli.BinaryTreeNode.prototype.getRightNode = function() {
            return this._rightNode;
        };
        simpli.BinaryTreeNode.prototype.hasRightNode = function() {
            return this._rightNode !== null;
        };
        simpli.BinaryTreeNode.prototype.setRightNode = function(pData) {
            if (!simpli.isType(pData, [simpli.INTEGER, {Object:"simpli.BinaryTreeNode"}])) {
                throw new TypeError("Invalid node, it should be an integer or simpli.BinaryTreeNode");
            }

            var vNode;
            if (simpli.isInteger(pData)) {
                vNode = new simpli.BinaryTreeNode(pData);
            } else if (simpli.isType(pData, simpli.OBJECT)) {
                vNode = pData;
            }
            this._rightNode = vNode;

            return this;
        };
        simpli.BinaryTreeNode.prototype.toString = function() {
            return "[object simpli.BinaryTreeNode]";
        };
    })();

    /**
     * simpli.BinaryTreeNode is a node for binary tree
     *
     * @class BinaryTree
     * @memberof simpli
     */
    (function() {
        /**
         * @constrcutor
         * @param {integer|simpli.BinaryTreeNode|simpli.BinaryTree} pInitData   (Optional)the initial data for the 
         *                                                                      binary tree. It can either be an 
                                                                                integer data or a node as root, or a 
                                                                                binary tree representation
         * @memberof simpli.BinaryTreeNode
         */
        simpli.BinaryTree = function(pInitData) {
            if (!simpli.isType(pInitData, [simpli.INTEGER, 
                {Object: "simpli.BinaryTreeNode"}, 
                {Object: "simpli.BinaryTree"}], simpli.OPTIONAL)) {
                throw new TypeError("Invalid initialization data, it should be an integer, simpli.BinaryTreeNode, simpli.BinaryTree or simpli.BinaryTreeTraversal");
            }
            if (!simpli.isset(pInitData)){
                this._root = null;
                this._size = 0;
            } else if (simpli.isInteger(pInitData)) {
                this._root = new simpli.BinaryTreeNode(pInitData);
                this._size = 1;
            } else if (simpli.isObject(pInitData)) {
                var vClass = simpli.getClass(pInitData);
                if (vClass === "simpli.BinaryTreeNode") {
                    this._root = pInitData;
                } else if (vClass === "simpli.BinaryTree") {
                    this._root = pInitData.getRoot();
                }
                this._size = 0;
                /*
                 * root now contains a well-formed BinaryTree and share 
                 * the same size calculation routine
                 */
                var vStack = new simpli.Stack();
                var vElem;
                vStack.push(this.getRoot());
                while(!vStack.isEmpty()) {
                    vElem = vStack.pop();
                    this._size++;
                    if (vElem.hasLeftNode()) {
                        vStack.push(vElem.getLeftNode());
                    }
                    if (vElem.hasRightNode()) {
                        vStack.push(vElem.getRightNode());
                    }
                }
            }
        };
        simpli.BinaryTree.prototype.insert = function(pNode) {
            if (!simpli.isType(pNode, [simpli.INTEGER, {Object:"simpli.BinaryTreeNode"}])) {
                throw new TypeError("Invalid node, is should be a simpli.BinaryTreeNode");
            }

            var vNode;
            if (simpli.isInteger(pNode)) {
                vNode = new simpli.BinaryTreeNode(pNode);
            } else {
                vNode = pNode;
            }

            // fill the noe to the upper-most position possible
            var vQueue = new simpli.Queue();
            vQueue.enqueue(this.getRoot());
            var vElem;
            while(!vQueue.isEmpty()) {
                vElem = vQueue.dequeue();
                if (vElem.hasLeftNode()) {
                    vQueue.enqueue(vElem.getLeftNode());
                } else {
                    vElem.setLeftNode(vNode);
                    break;
                }
                if (vElem.hasRightNode()) {
                    vQueue.enqueue(vElem.getRightNode());
                } else {
                    vElem.setRightNode(vNode);
                    break;
                }
            }
            this._size++;
            return this;
        };
        simpli.BinaryTree.prototype.getSize = function() {
            return this._size;
        }
        simpli.BinaryTree.prototype.getHeight = function() {
            return Math.log2(this.getSize());
        }
        simpli.BinaryTree.prototype.getRoot = function() {
            return this._root;
        }
        simpli.BinaryTree.prototype.setRoot = function(pNode) {
            if (simpli.exist(pNode) && simpli.getClass(pNode) !== "simpliBinaryTreeNode") {
                throw new TypeError("Invalid node, it should be a simpli.BinaryTreeNode object or null");
            }
            this._root = pNode;
        }
        simpli.BinaryTree.prototype.preOrder = function() {
            var vResult = [];
            var vStack = new simpli.Stack();
            vStack.push(this.getRoot());
            var vElem;
            while(!vStack.isEmpty()){
                vElem = vStack.pop();
                vResult.push(vElem.getData());
                if (vElem.hasRightNode()) {
                    vStack.push(vElem.getRightNode());
                }
                if (vElem.hasLeftNode()) {
                    vStack.push(vElem.getLeftNode());
                }
            }

            return vResult;
        };
        var inOrderTraversal = function(pNode, pResult) {
            if (pNode.hasLeftNode()) {
                inOrderTraversal(pNode.getLeftNode(), pResult);
            }
            pResult.push(pNode.getData());
            if (pNode.hasRightNode()) {
                inOrderTraversal(pNode.getRightNode(), pResult);
            }
        }
        simpli.BinaryTree.prototype.inOrder = function() {
            var vResult = [];
            inOrderTraversal(this.getRoot(), vResult);
            return vResult;
        };
        var postOrderTraversal = function(pNode, pResult) {
            if (pNode.hasLeftNode()) {
                postOrderTraversal(pNode.getLeftNode(), pResult);
            }
            if (pNode.hasRightNode()) {
                postOrderTraversal(pNode.getRightNode(), pResult);
            }
            pResult.push(pNode);
        }
        simpli.BinaryTree.prototype.postOrder = function() {
            // TODO:
        };
        simpli.BinaryTree.prototype.levelOrder = function() {
            var vResult = [];
            var vQueue = new simpli.Queue();
            vQueue.push(this.getRoot());
            var vElem;
            while(!vQueue.isEmpty()) {
                vElem = vQueue.dequeue();
                vResult.push(vElem);
                if (vElem.hasLeftNode()) {
                    vQueue.enqueue(vElem.getLeftNode());
                }
                if (vElem.hasRightNode()) {
                    vQueue.enqueue(vElem.getRightNode());
                }
            }

            return vResult;
        };
        simpli.BinaryTree.prototype.toString = function() {
            return "[object simpli.BinaryTree]";
        };
    })();

    (function() {
        var _binarySearch = function(pArray, pTarget, pBegin, pEnd) {
            if (pEnd-pBegin < 0) {
                return false;
            }
            var vMid = pBegin+Math.floor((pEnd-pBegin)/2);
            var vMidValue = pArray[vMid];
            if (pTarget < vMidValue) {
                return _binarySearch(pArray, pTarget, pBegin, vMid-1);
            } else if (pTarget > vMidValue) {
                return _binarySearch(pArray, pTarget, vMid+1, pEnd);
            } else {
                // result found
                return true;
            }
        }
        /**
         * Perform a binary search on a sorted array to find for the target value
         * 
         * @param {integer[]} pArray    the sorted array
         * @param {integer}pTarget      specific the target value
         * @return {boolean}            whether the target exists in the array
         * @memberof simpli
         */
        simpli.binarySearch = function(pArray, pTarget) {
            if (!simpli.isType(pArray, {Array:simpli.INTEGER})) {
                throw new TypeError("Invalid array, it should be an integer array");
            }
            if (!simpli.isType(pTarget, simpli.INTEGER)) {
                throw new TypeError("Invalid target, it should be an integer");
            }
            return _binarySearch(pArray, pTarget, 0, pArray.length);
        }
    })();

    simpli.STRING = "String";
    simpli.NUMBER = "Number";
    simpli.BOOLEAN = "Boolean";
    simpli.BOOL = "Boolean";
    simpli.OBJECT = "Object";
    simpli.FUNCTION = "Function";
    simpli.INTEGER = "Integer";
    simpli.INT = "Integer";
    simpli.ARRAY = "Array";
    // IE backward compatibility
    simpli.UNKNOWN = "unknown";

    simpli.REQUIRED = true;
    simpli.OPTIONAL = false;

    /**
     * Get the class name of a variable
     *
     * @param {mixed} pVar  the variable to get its class
     * @return {string}     the class name
     * @memberof simpli
     */
    simpli.getClass = function(pVar) {
        // identify the global object
        var varString = toString.call(pVar);
        // compare to both global and IE11 window under non-strict mode
        if (pVar === global || pVar === _IE11Window) {
            return "Global";
        }
        var vClass = varString.slice(8, -1);
        if (vClass === "Object") {
            /* 
             * Object is rather meaningless, try to examine the toString() of 
             * the variable to find [object ...] pattern
             */
            var vMatch = pVar.toString().match(/^\[object\s([^\]]+)\]$/);
            if (vMatch !== null && vMatch.length === 2) {
                return vMatch[1];
            }
        }
        return varString.slice(8, -1);
    };


    /** 
     * Check if a variable exists. exist() is different from isset() in the
     * sense that exist() only considers undefined as false while isset() 
     * considers both undefined and null as false. The exist() is better used
     * to determine the existence of a JavaScript object while isset() is 
     * better used in the context of argument checking or user provided content
     *
     * @param {mixed} pArg  the argument to be checked
     * @return {boolean}    whether the arugment is set
     * @memberof simpli
     */
    simpli.exist = function(pArg) {
        return (typeof pArg !== "undefined");
    };

    /** 
     * Check if a variable is set. undefined and null are both considered as 
     * not isset
     *
     * @param {mixed} pArg  the argument to be checked
     * @return {boolean}    whether the arugment is set
     * @memberof simpli
     */
    simpli.isset = function(pArg) {
        return (typeof pArg !== "undefined" && pArg !== null);
    };

    /**
     * Check if a variable is set by recursively check whether each level of
     * the object is set
     * Example:
     * If you use 
     * if (typeof root.notDefined.notDefined.notDefined === "undefined")
     * This line will throw an error as soon as JavaScript engine realizes 
     * root.notDefined is undefined and no further checking is performed. Thus 
     * breaking this line. To check for the existence of such case, you can use
     * simpli.iterativeIsset(root, "notDefined", "notDefined", "notDefined")
     * 
     * @param {object} pObject          the base object
     * @param {...integer|string} pKey  the key to act upon the object
     */
    simpli.iterativeIsset = function() {
        var l = arguments.length;
        if (l < 1) {
            throw new TypeError("Invalid arguments, it should contain at least an object");
        }

        var vObject = arguments[0];
        var vArg;
        for (var i=1; i<l; i++) {
            var vArg = arguments[i];
            if (!simpli.isType(vArg, [simpli.STRING, simpli.INTEGER])) {
                throw new TypeError("Invalid key, it should be a string or integer");
            }

            if (typeof vObject[vArg] === "undefined") {
                return false;
            }
            vObject = vObject[vArg];
        }
        return true;
    }

    /**
     * Check if a variable's type is NaN
     *
     * isNaN() will return true when the variable is of type NaN
     *
     * @param {mixed} pVar  variable to check against
     * @param {boolean}     true if the variable is of type NaN
     * @memberof simpli
     */
    simpli.isNaN = function(pVar) {
        /*
         * a special property of NaN is that the NaN variable is not equal to
         * itself
         */
        return pVar !== pVar;
    };

    /**
     * Check if a variable is an integer
     *
     * @param {mixed} pVar  variable to check against
     * @return {boolean}    whether the variable is an integer
     * @memberof simpli
     */
    simpli.isInteger = function(pVar) {
        return (typeof pVar === "number") && (pVar%1 === 0);
    };

    /**
     * Check if a variable is within a range
     *
     * @param {number} pVar         variable to check against
     * @param {number} pLowerBound  (Optional) the lower bound
     * @param {number} pUpperBound  (Optional) the upper bound
     * @reutrn {boolean}            whether the variable is within range
     * @memberof simpli
     */
    simpli.inRange = function(pVar, pLowerBound, pUpperBound) {
        if (!simpli.isType(pVar, simpli.NUMBER)) {
            throw new TypeError("Invalid variable, it should be an number");
        }
        if (!simpli.isType(pLowerBound, simpli.NUMBER, simpli.OPTIONAL)) {
            throw new TypeError("Invalid lower bound, it should be an number");
        }
        if (!simpli.isType(pLowerBound, simpli.NUMBER, simpli.OPTIONAL)) {
            throw new TypeError("Invalid upper bound, it should be an number");
        }
        if (!simpli.isset(pLowerBound) && !simpli.isset(simpli.pUpperBound)) {
            throw new TypeError("Invalid invocation, at least one bound should be specified");
        }
        if (simpli.isset(pLowerBound) && pVar < pLowerBound) {
            return false;
        }
        if (simpli.isset(pUpperBound) && pVar > pUpperBound) {
            return false;
        }
        return true;
    }

    /** 
     * Check if a variable equals to any of the string in an array
     *
     * @param {mixed} pVar      variable to check against
     * @param {mixed[]} pArray  the string array to check
     * @return {boolean}        whether the variable equals to any ot the 
     *                          string
     */
    simpli.equalTo = function(pVar, pArray) {
        for (var i=0,l=pArray.length; i<l; i++) {
            if (pVar === pArray[i]) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if a variable is a string
     *
     * @param {mixed} pVar  variable to check against
     * @return {boolean}    whether the variable is a string
     * @memberof simpli
     */
    simpli.isString = function(pVar) {
        return (typeof pVar === "string");
    };

    /**
     * Check if a variable is a number
     *
     * @param {mixed} pVar  variable to check against
     * @return {boolean}    whether the variable is a number
     * @memberof simpli
     */
    simpli.isNumber = function(pVar) {
        return (typeof pVar === "number");
    };

    /**
     * Check if a variable is a boolean
     *
     * @param {mixed} pVar  variable to check against
     * @return {boolean}    whether the variable is a boolean
     * @memberof simpli
     */
    simpli.isBoolean = function(pVar) {
        return (typeof pVar === "boolean");
    };

    /**
     * Check if a variable is an object of specific class
     *
     * @param {mixed} pVar              variable to check against
     * @param {string|object} pClass    (Optional) specific the class to check 
     *                                  the variable against. If string is 
     *                                  provided, the toString() of the pVar 
     *                                  will be used to determine the class; If
     *                                  object is provided, instanceof pClass
     *                                  will be used to instead
     * @return {boolean}                whether the variable is an object
     * @memberof simpli
     */
    simpli.isObject = function(pVar, pClass) {
        if (typeof pClass === "undefined") {
            return (typeof pVar === "object");
        } else if (typeof pClass === "string") {
            return (simpli.getClass(pVar) === pClass);
        } else if (typeof pClass === "object") {
            return (pVar instanceof pClass)
        } else {
            throw new TypeError("Invalid class, it should be a string or class object");
        }
    };

    /**
     * Check if a variable is a function
     *
     * @param {mixed} pVar  variable to check against
     * @return {boolean}    whether the variable is a function
     * @memberof simpli
     */
    simpli.isFunction = function(pVar) {
        return (typeof pVar === "function");
    };

    /**
     * Check if a variable is an array
     *
     * @param {mixed} pVar  variable to check against
     * @return {boolean}    whether the variable is an array
     * @memberof simpli
     */
    simpli.isArray = function(pVar) {
        // find the class of the object using ECMAScript standard
        // Object.prototype is not editable, so it is reliable
        var className = simpli.getClass(pVar);
        if (className === "Array") {
            return true;
        // some old IE browsers will return [object Object] for Array
        } else if(simpli.getClass([]) !== "Array" && className === "Object") {
            // Fix for those old IE browsers
            /*
             * It is hard to have a robust array check for these browsers, 
             * instead an array-like check is performed
             */
            return (typeof pVar === "object" && typeof pVar.length === "number");
        } else {
            return false;
        }
    };

    /**
     * Check for variable/arugment type
     * If it is a variable check, required flag is default ot be true
     * to bypass requirement checks
     * If it is an argument check, required flag can be required or
     * optional to indicate whether the argument must be presented
     *
     * @param {mixed} pVar                      the argument to check against
     * @param {string|string[]|object} pType    expected type of the arugment
     * @param {boolean} pRequired               (Optional) whether the 
     *                                          arguement is required, 
     *                                          defaultis true
     * @return {boolean}                        whether the arugment matches 
     *                                          the type
     * @memberof simpli
     */
    simpli.isType = function(pVar, pType, pRequired) {
        // default value for required flag is true
        var vRequired = true;
        if (typeof pRequired !== "undefined") {
            if (typeof pRequired !== "boolean") {
                throw new TypeError("Invalid required flag, it should be a boolean");
            }
            vRequired = pRequired;
        }
        /*
         * If the argument is optional, return true if the arugment is not
         * defined
         */
        if (!vRequired && (typeof pVar === "undefined" || pVar === null)) {
            return true;
        }

        var vTypeIsArray = simpli.isArray(pType), 
            vTypeIsObject = simpli.isObject(pType);
        if (typeof pType !== "string" && !vTypeIsArray && !vTypeIsObject) {
            console.log(pType);
            throw new TypeError("Invalid type, it should be a string, object or an array of them");
        }

        if (vTypeIsArray) {
            // iterate through the pType array
            var i = 0, 
                vLength = pType.length;
            while (i<vLength) {
                // recursively call the isType()
                if (simpli.isType(pVar, pType[i])) {
                    return true;
                    break;
                }
                i++;
            }
        } else if (vTypeIsObject) {
            // check for typed array
            if (simpli.exist(pType[simpli.ARRAY])) {
                var vType = pType[simpli.ARRAY];
                if (simpli.isArray(pVar)) {
                    // check if all elements in the array are of the type
                    for(var i=0, l=pVar.length; i<l; i++) {
                        if (!simpli.isType(pVar[i], vType)) {
                            /* 
                             * return false whenever there is one element 
                             * of different type
                             */
                            return false;
                        }
                    }
                    return true;
                }
            // check for specific object class
            } else if (simpli.exist(pType[simpli.OBJECT])) {
                return (simpli.isObject(pVar, pType[simpli.OBJECT]));
            } else {
                throw new TypeError("Unrecognized type object, it should be specificing a typed array or object class");
            }
        } else {
            // string type
            switch(pType) {
                case simpli.STRING: 
                    return (typeof pVar === "string");
                    break;
                case simpli.NUMBER: 
                    return (typeof pVar === "number");
                    break;
                case simpli.BOOLEAN: 
                case simpli.BOOL: 
                    return (typeof pVar === "boolean");
                    break;
                case simpli.OBJECT: 
                    return (typeof pVar === "object");
                    break;
                case simpli.FUNCTION: 
                    return (typeof pVar === "function");
                    break;
                case simpli.INTEGER: 
                case simpli.INT: 
                    return simpli.isInteger(pVar);
                    break;
                case simpli.ARRAY: 
                    return simpli.isArray(pVar);
                    break;
                default:
                    throw new TypeError("Unrecognized type, it should be one of the valid data types");
            }
        }
        return false;
    };

    /**
     * Uppercase the first character of a string
     * 
     * @param {string} pString  the string to be uppercased first
     * @return {string}         the string with first character uppercased
     */
    simpli.ucfirst = function(pString) {
        if (!simpli.isType(pString, simpli.STRING)) {
            throw new TypeError("Invalid argument, it should be a string");
        }
        return pString.charAt(0).toUpperCase() + pString.slice(1);
    }

    // DOM manipulation
    /**
     * DOMElement is a binding managment object that allows additional
     * functions to be binded to a specific HTML element type
     * 
     * @class DOMElement
     * @memberof simpli
     */
    simpli.DOMElement = {
        /**
         * Allows additional function to be binded to the element type. It is a shorthand function
         * to bind function to the specified element type
         * 
         * @function extend
         * @param {string} pElement             the element type to be bineded
         * @param {string} pName                the name of the additional function
         * @param {function} pFunc              the function body for the single element
         * @memberof simpli.DOMElement
         */
        extend: function(pElement, pName, pFunc) {
            // arguments checking are done by simpli.HTMLElement.extend()
            _DOMCollection.extend(pElement, pName, _DOMCollection.CUSTOMIZE, pFunc, function() {
                /* 
                 * for single element collection, call the function to its only element to provide
                 * illusion to users as if they are manipulating the single element
                 */
                if (this.length != 1) {
                    throw new TypeError("Calling " + pName + "() on an element collection");
                }

                // upper case element type to avoid confusion
                var vElement = pElement.toUpperCase();
                // The elemtn type checking is done my the simplify() mechanism

                if (arguments.length == 0) {
                    return pFunc.call(this[0]);
                } else {
                    return pFunc.apply(this[0], arguments);
                }
            });
        }
    };
    /**
     * HTMLElement is a binding managment object that allows additional
     * functions to be binded to a specific HTML element type
     * 
     * @class HTMLElement
     * @memberof simpli
     */
    simpli.HTMLElement = {
        // define constants
        /**
         * @property {integer} ELEMENT  denote ELEMENT type
         * @memberof simpli.HTMLElement
         */
        ELEMENT: 0, 
        /**
         * @property {integer} COLLECTION   denote COLLECTION type
         * @memberof simpli.HTMLElement
         */
        COLLECTION: 1, 
        /**
         * @property {integer} CUSTOMIZE    denote CUSTOMIZE types applicable
         * @memberof simpli.HTMLElement
         */
        CUSTOMIZE: 2, 
        /**
         * Allows additional function to be binded to the element type. 
         * 
         * @function extend
         * @param {string} pName                the name of the additional
         *                                      function
         * @param {integer} pType               There are three types of function available:
         *                                      ELEMENT, COLLECTION or CUSTOMIZE
         *                                      simpli.HTMLElement.ELEMENT:
         *                                      the function is only applicable to single element 
         *                                      only. Element collection should be forbidden to
         *                                      call the function <br />
         *                                      <br />
         *                                      simpli.HTMLElement.COLLECTION
         *                                      the function is applicable to both single element
         *                                      and element collection. For element collection, 
         *                                      each elements inside the collection will be 
         *                                      iterated and apply the function <br />
         *                                      <br />
         *                                      simpli.HTMLElement.CUSTOMIZE
         *                                      CUSTOMIZE type provides the highest flexibility
         *                                      in defining the behaviour of the function. Under
         *                                      CUSTOMIZE type two functions, one for single 
         *                                      element and one of element collection are needed
         *                                      as the pararmeters of extend()
         * @param {function} pElementFunc       the function body for the single element
         * @param {function} pCollectionFunc    (Optional)the function body for element 
         *                                      collection, only applicable under CUSTOMIZE type
         * @memberof simpli.HTMLElement
         */
        extend: function(pName, pType, pElementFunc, pCollectionFunc) {
            // arguments checking are done by simpli.HTMLElement.extend()
            var vType = pType;
            if (pType === simpli.HTMLElement.ELEMENT) {
                vType = _DOMCollection.ELEMENT;
            } else if (pType === simpli.HTMLElement.COLLECTION) {
                vType = _DOMCollection.COLLECTION;
            } else if (pType === simpli.HTMLElement.CUSTOMIZE) {
                vType = _DOMCollection.CUSTOMIZE;
            }
            _DOMCollection.extend("HTMLELEMENT", pName, vType, pElementFunc, pCollectionFunc);
        }
    }; 
    /**
     * DOMCollection is a binding managment object that allows additional
     * functions to be binded to a HTMLElement Collection
     * 
     * @class _DOMCollection
     * @private
     */
    var _DOMCollection = {
        // define constants
        /**
         * @property {integer} ELEMENT  denote ELEMENT type
         * @memberof _DOMCollection
         */
        ELEMENT: 0, 
        /**
         * @property {integer} COLLECTION   denote COLLECTION type
         * @memberof _DOMCollection
         */
        COLLECTION: 1, 
        /**
         * @property {integer} CUSTOMIZE    denote CUSTOMIZE types applicable
         * @memberof _DOMCollection
         */
        CUSTOMIZE: 2, 
        /**
         * a data structure storing the binded functions
         *
         * @property {function[]} mBindedFunc   a list of binded functions
         * @memberof _DOMCollection
         */
        mBindedFunc: {}, 
        /**
         * Allows additional function to be binded to the element type. 
         * 
         * @function extend
         * @param {string} pElement             the HTML element to be simplified
         * @param {string} pName                the name of the additional
         *                                      function
         * @param {integer} pType               There are three types of function available:
         *                                      ELEMENT, COLLECTION or CUSTOMIZE
         *                                      simpli.HTMLElement.ELEMENT:
         *                                      the function is only applicable to single element 
         *                                      only. Element collection should be forbidden to
         *                                      call the function <br />
         *                                      <br />
         *                                      simpli.HTMLElement.COLLECTION
         *                                      the function is applicable to both single element
         *                                      and element collection. For element collection, 
         *                                      each elements inside the collection will be 
         *                                      iterated and apply the function <br />
         *                                      <br />
         *                                      simpli.HTMLElement.CUSTOMIZE
         *                                      CUSTOMIZE type provides the highest flexibility
         *                                      in defining the behaviour of the function. Under
         *                                      CUSTOMIZE type two functions, one for single 
         *                                      element and one of element collection are needed
         *                                      as the pararmeters of extend()
         * @param {function} pElementFunc       the function body for the single element
         * @param {function} pCollectionFunc    (Optional)the function body for element 
         *                                      collection, only applicable under CUSTOMIZE type
         * @memberof _DOMCollection
         */
        extend: function(pElement, pName, pType, pElementFunc, pCollectionFunc) {
            if (!simpli.isType(pElement, simpli.STRING)) {
                throw new TypeError("Invalid element, it should be a string");
            }
            if (!simpli.isType(pName, simpli.STRING)) {
                throw new TypeError("Invalid name, it should be a string");
            }
            if (!simpli.isType(pType, simpli.INTEGER) || !simpli.equalTo(pType, [simpli.HTMLElement.ELEMENT, simpli.HTMLElement.COLLECTION, simpli.HTMLElement.CUSTOMIZE])) {
                throw new TypeError("Invalid type, it should be one of the simpli.HTMLElement constants");
            }
            if (!simpli.isType(pElementFunc, simpli.FUNCTION)) {
                throw new TypeError("Invalid element function, it should be a function");
            }
            if (pType === simpli.HTMLElement.CUSTOMIZE) {
                if (!simpli.isType(pCollectionFunc, simpli.FUNCTION)) {
                    throw new TypeError("Invalid element collection function, it should be a function");
                }
            } else {
                if (!simpli.isType(pCollectionFunc, simpli.FUNCTION, simpli.OPTIONAL)) {
                    throw new TypeError("Invalid element collection function, it should be a function");
                }
            }
            if (simpli.isset(pCollectionFunc) && pType !== simpli.HTMLElement.CUSTOMIZE) {
                throw new TypeError("Invalid element collection function, it should only be provided when type is simpli.HTMLElement.CUSTOMIZE");
            }

            var vElement = pElement.toUpperCase();
            if (!simpli.exist(this.mBindedFunc[vElement])) {
                this.mBindedFunc[vElement] = {element: [], collection: []};
            }
            var vBinedFunc = this.mBindedFunc[vElement];

            vBinedFunc["element"].push([pName, function() {
                if (arguments.length == 0) {
                    return pElementFunc.call(simpli(this[0]));
                } else {
                    return pElementFunc.apply(simpli(this[0]), arguments);
                }
            }]);
            if (pType === simpli.HTMLElement.ELEMENT) {
                vBinedFunc["collection"].push([pName, function() {
                    throw new Error("[SimpliJS] Cannot call " + pName + "() on an element collection");
                }]);
            } else if (pType === simpli.HTMLElement.COLLECTION) {
                vBinedFunc["collection"].push([pName, function() {
                    var args = arguments;
                    // this refers to the simpli element
                    this.forEach(function(currentElement) {
                        if (args.length === 0) {
                            pElementFunc.call(currentElement);
                        } else {
                            pElementFunc.apply(currentElement, args);
                        }
                    });
                    return this;
                }]);
            } else {
                // pType === simpli.HTMLElement.CUSTOMIZE
                vBinedFunc["collection"].push([pName, pCollectionFunc]);
            }
        }, 

        /**
         * Simplify an object by binding those extended extnesions to the provided
         * object
         *
         * @function simplify
         * @param {string} pElement     the HTML element to be simplified
         * @param {object} pObject      the object to be simplified
         * @param {integer} pType       the type of element /collection 
         *                              to be binded with the function
         * @return {object}             the simplified object
         * @memberof _DOMCollection
         */
        simplify: function(pElement, pObject, pType) {
            if (!simpli.isType(pElement, simpli.STRING)) {
                throw new TypeError("Invalid element, it should be a string");
            }
            if (!simpli.isType(pObject, simpli.OBJECT)) {
                throw new TypeError("Invalid function, it should be a function");
            }
            if (!simpli.isType(pType, simpli.INTEGER)) {
                throw new TypeError("Invalid type, it should be an integer");
            }
            if (simpli.isset(pType) && !simpli.equalTo(pType, [simpli.HTMLElement.ELEMENT, simpli.HTMLElement.COLLECTION])) {
                throw new TypeError("Invalid type, it should be either ELEMENT or COLLECTION");
            }
            var vElement = pElement.toUpperCase();
            if (simpli.exist(this.mBindedFunc[vElement])) {
                if (pType === simpli.HTMLElement.ELEMENT) {
                    // bind the functions to element object
                    var vBindedFunc = this.mBindedFunc[vElement]["element"];
                    for(var i=0, l=vBindedFunc.length; i<l; i++) {
                        var vFunc = vBindedFunc[i];
                        pObject[vFunc[0]] = vFunc[1];
                    }
                } else {
                    // bind the functions to collection object
                    var vBindedFunc = this.mBindedFunc[vElement]["collection"];
                    for(var i=0, l=vBindedFunc.length; i<l; i++) {
                        var vFunc = vBindedFunc[i];
                        pObject[vFunc[0]] = vFunc[1];
                    }
                }
            }
            return pObject;
        }
    };

    /**
     * Add node() method to HTMLElement. It can return the JavaScript 
     * HTMLElement node of specific index
     *
     * Usage:
     * simpli({HTMLElement}).node({pIndex});
     *
     * @function node
     * @param {integer}     (Optional)the index of HTMLElement node. Default
     *                      is 0 to provide quick navigation to single element
     *                      node
     * @return {object}     the HTMLElement object
     * @memberof simpli
     * @instance
     */
    simpli.HTMLElement.extend("node", simpli.HTMLElement.CUSTOMIZE, function(pIndex) {
        if (!simpli.isType(pIndex, simpli.INTEGER, simpli.OPTIONAL)) {
            throw new TypeError("Invalid index, it should be an integer");
        }
        if (simpli.isset(pIndex) && pIndex !== 0) {
            throw new Error("[SimpliJS] Cannot get node of element, index out of bound");
        }
        return this[0];
    }, function(pIndex) {
        if (!simpli.isType(pIndex, simpli.INTEGER, simpli.OPTIONAL)) {
            throw new TypeError("Invalid index, it should be an integer");
        }
        // default index is 0
        var vIndex = (simpli.isset(pIndex))? pIndex: 0;
        if (this.length <= pIndex) {
            throw new Error("[SimpliJS] Cannot get node of element, index out of bound");
        }
        return this[pIndex];
    });

    /**
     * Add parent() method to document and HTMLElement. It can return the 
     * parent node of the simpli object
     *
     * Usage:
     * simpli({HTMLElement|document}).parent();
     * 
     * @function parent
     * @return {object}     parent simpli object
     * @memberof simpli
     * @instance
     */
    simpli.DOMElement.extend("document", "parent", function() {
        return undefined;
    });
    var _DOMParent = function() {
        return simpli(this.node().parentNode);
    };
    simpli.HTMLElement.extend("parent", simpli.HTMLElement.ELEMENT, _DOMParent);
    simpli.HTMLElement.extend("p", simpli.HTMLElement.ELEMENT, _DOMParent);

    var _DOMUniqueId = 0;
    /**
     * Add siblings() method to HTMLElement. It can return a list of siblings
     * with the given selector
     *
     * @function descendants
     * @param {string} pSelector    selector string
     * @return {object}             the simpli DOM object
     * @memberof simpli
     */
    var _DOMSiblings = function() {

    }
    simpli.HTMLElement.extend("siblings", simpli.HTMLElement.ELEMENT, function(pSelector) {
    });

    /**
     * Add children() method to HTMLElement. It can return a list of children
     * with the given selector
     *
     * @function children
     * @param {string} pSelector    selector string
     * @return {object}             the simpli DOM object
     * @memberof simpli
     */
    /**
     * Shorthand for children()
     *
     * @function c
     * @param {string} pSelector    selector string
     * @return {object}             the simpli DOM object
     * @memberof simpli
     */
    var _DOMDChildren = function(pSelector) {
        if (!simpli.isType(pSelector, simpli.STRING)) {
            throw new TypeError("Invalid selector, it should be a string");
        }
        var vClass = "_simplijs-cache-" + _DOMUniqueId++;
        this.addClass(vClass);
        var vElem = simpli("." + vClass + " > " + pSelector);
        this.removeClass(vClass);
        return vElem;
    }
    simpli.HTMLElement.extend("children", simpli.HTMLElement.ELEMENT, _DOMDChildren);
    simpli.HTMLElement.extend("c", simpli.HTMLElement.ELEMENT, _DOMDChildren);

    /**
     * Add descendants() method to HTMLElement. It can return a list of 
     * descendants with the given selector
     *
     * @function descendants
     * @param {string} pSelector    selector string
     * @return {object}             the simpli DOM object
     * @memberof simpli
     */
    /**
     * Shorthand for descendants()
     *
     * @function d
     * @param {string} pSelector    selector string
     * @return {object}             the simpli DOM object
     * @memberof simpli
     */
    var _DOMDescendants = function(pSelector) {
        if (!simpli.isType(pSelector, simpli.STRING)) {
            throw new TypeError("Invalid selector, it should be a string");
        }
        return simpli(this.querySelector(pSelector));
    }
    simpli.HTMLElement.extend("descendants", simpli.HTMLElement.ELEMENT, _DOMDescendants);
    simpli.HTMLElement.extend("d", simpli.HTMLElement.ELEMENT, _DOMDescendants);

    /**
     * Add listenTo() method to document and HTMLElement. It can listen to 
     * specific type of event
     * 
     * Usage:
     * simpli({HTMLElement|document}).listenTo(...);
     *
     * @function listenTo
     * @param {string} pType            a string representing the event type 
     *                                  to listen for
     * @param {function} pListener      the function to run when the event 
     *                                  occurs
     * @param {boolean} pUseCapture     whether the event should be executed 
     *                                  in the capturing or in the bubbling 
     *                                  phase
     * @return {object}                 this object
     * @memberof simpli
     * @instance
     */ 
    var _DOMListenTo = function(pType, pListener, pUseCapture) {
        if (!simpli.isType(pType, simpli.STRING)) {
            throw new TypeError("Invalid type, it should be a string");
        }
        if (!simpli.isType(pListener, simpli.FUNCTION)) {
            throw new TypeError("Invalid type, it should be a function");
        }
        if (!simpli.isType(pUseCapture, simpli.BOOLEAN, simpli.OPTIONAL)) {
            throw new TypeError("Invalid pUseCapture, it should be a function");
        }
        // default value for useCapture is false
        var vUseCapture = simpli.isset(pUseCapture)? pUseCapture: false;
        if (simpli.exist(this.addEventListener)) {
            this.addEventListener(pType, pListener, vUseCapture);
        } else if (simpli.exist(this.attachEvent)) {
            // IE5-8 does not have addEventListener method
            this.node().attachEvent("on"+pType, pListener);
        } else {
            throw new TypeError("Event listening is not supported");
        }
        return this;
    }
    simpli.DOMElement.extend("document", "listenTo", _DOMListenTo);
    simpli.HTMLElement.extend("listenTo", simpli.HTMLElement.COLLECTION, _DOMListenTo);

    /**
     * Add stopListenTo() method to document and HTMLElement. It can stop the 
     * element from listening to event or unbind an listener form certain
     * event
     *
     * TODO:
     */

    /**
     * Add ready() method to document. It can listen to DOM content loaded 
     * event
     * 
     * @function ready
     * @param {function} pListener      the function to run when the event 
     *                                  occurs
     * @return {object}                 this object
     * @memberof simpli
     * @instance
     */
    simpli.DOMElement.extend("document", "ready", function(pListener) {
        if (!simpli.isType(pListener, simpli.FUNCTION)) {
            throw new TypeError("Invalid type, it should be a function");
        }

        if (simpli.exist(this.addEventListener)) {
            // this is the same as document
            var vReadyListener = function() {
                document.removeEventListener("DOMContentLoaded", vReadyListener, false);
                pListener.call(document);
            };
            document.addEventListener("DOMContentLoaded", vReadyListener, false);
        } else if (simpli.exist(this.attachEvent)) {
            // IE5-8 does not have addEventListener method
            var vReadyStateListener = function() {
                if (document.readyState === "complete") {
                    document.detachEvent("onreadystatechange", vReadyStateListener);
                }
                pListener.call(document);
            }
            document.attachEvent("onreadystatechange", vReadyStateListener);
        } else {
            throw new TypeError("Event listening is not supported");
        }
    });

    /**
     * Add onClick() method to document and HTMLElement. It can bind an 
     * listener to the onClick event
     * 
     * @function click
     * @param {function} pListener      the function to run when the event 
     *                                  occurs
     * @param {boolean} pUseCapture     whether the event should be executed 
     *                                  in the capturing or in the bubbling 
     *                                  phase
     * @return {object}                 this object
     * @memberof simpli
     * @instance
     */
    var _DOMClick = function(pListener, pUseCapture) {
        if (!simpli.isType(pListener, simpli.FUNCTION)) {
            throw new TypeError("Invalid type, it should be a function");
        }
        if (!simpli.isType(pUseCapture, simpli.BOOLEAN, simpli.OPTIONAL)) {
            throw new TypeError("Invalid pUseCapture, it should be a function");
        }
        this.listenTo("click", pListener, pUseCapture);
    };
    simpli.DOMElement.extend("document", "click", _DOMClick);
    simpli.HTMLElement.extend("click", simpli.HTMLElement.COLLECTION, _DOMClick);

    // a list of HTML attribute to DOM standard property name conversion
    var DOMProperty = {
        "for": "htmlFor", 
        "class": "className"
    };
    /**
     * Convert an HTML attribute to its property equivalent
     *
     * @param {string} pAttr    the attibute to be converted
     * @return {string}         the porperty equivalent
     */
    var _DOMAttrToProp = function(pAttr) {
        return (simpli.exist(DOMProperty[pAttr]))? DOMProperty[pAttr]: pAttr;
    };
    /**
     * set the property of this object. This function is to provide feature to
     * the simpli.prop() method and is not intended to be called at other 
     * instance
     * 
     * @param {string} pProp                the property name
     * @param {string|number} pValue        (Optional)the  new value for
     *                                      the property
     */
    var _DOMSetProp = function(pProp, pValue) {
        var vProp = _DOMAttrToProp(pProp);
        if (simpli.exist(this[vProp])) {
            this[vProp] = pValue;
        } else {
            this.node().setAttribute(pProp, pValue);
        }
    }
    /**
     * Add prop() method to document and HTMLElement. It can get and set the
     * the attributes and properties of the simpli object
     * 
     * @function prop
     * @param {string} pProp                the property name
     * @param {string|number} pValue        (Optional)the  new value for
     *                                      the property
     * @return {object|string|undefined}    this object for set, or string 
     *                                      or underfined for retrieval
     * @memberof simpli
     * @instance
     */
    var _DOMProp = function(pProp, pValue) {
        if (!simpli.isType(pProp, simpli.STRING)) {
            throw new TypeError("Invalid property, it should be a string");
        }
        if (!simpli.isType(pValue, [simpli.STRING, simpli.NUMBER], simpli.OPTIONAL)) {
            throw new TypeError("Invalid property, it should be a string");
        }

        if (simpli.isset(pValue)) {
            // set property
            _DOMSetProp.call(this, pProp, pValue);
        } else {
            // retrieval
            var vProp = _DOMAttrToProp(pProp);
            var vResult;
            // this.{property} usually works
            if (simpli.exist(this[vProp])) {
                vResult = this[vProp];
                if (vResult === null) {
                    vResult = "";
                }
            } else {
                vResult = this.node().getAttribute(pProp);
                /*
                 * if the attribute does not exists, null or "" will be 
                 * returned
                 */
                if(vResult === null || vResult === "") {
                    vResult = undefined;
                }
            }
            return vResult;
        }
    }
    simpli.DOMElement.extend("document", "prop", _DOMProp);
    simpli.HTMLElement.extend("prop", simpli.HTMLElement.CUSTOMIZE, _DOMProp, function(pProp, pValue) {
        if (!simpli.isType(pProp, simpli.STRING)) {
            throw new TypeError("Invalid property, it should be a string");
        }
        if (!simpli.isType(pValue, [simpli.STRING, simpli.NUMBER], simpli.OPTIONAL)) {
            throw new TypeError("Invalid property, it should be a string");
        }

        if (simpli.isset(pValue)) {
            // set property
            this.forEach(function(currentElement) {
                _DOMSetProp.call(currentElement, pProp, pValue);
            })
            return this;
        } else {
            // retrieval
            /*
             * retrieve only when there is only one element, otherwise throw
             * an error
             */
            throw new Error("[SimpliJS] Cannot retrieve property from an element collection");
        }
    });

    /**
     * Check if the element belongs to certain CSS class
     *
     * @function isClass
     * @param {string} pClassName   the class anme
     * @return {boolean}            whether the element belongs to that class
     * @memberof simpli
     * @instance
     */
    simpli.HTMLElement.extend("isClass", simpli.HTMLElement.ELEMENT, function(pClassName) {
        if (!simpli.isType(pClassName, simpli.STRING)) {
            throw new TypeError("Invalid class name, it should be a string");
        }
        var vClassList = this.prop("class").split(" ");
        for (var i=0,l=vClassList.length; i<l; i++) {
            if (vClassList[i] === pClassName) {
                return true;
            }
        }
        return false;
    });

    /**
     * Add a CSS class to the element
     *
     * @function addClass
     * @param {string} pClassName   the class anme to be added
     * @return {object}             simpli object
     * @memberof simpli
     * @instance
     */
    simpli.HTMLElement.extend("addClass", simpli.HTMLElement.COLLECTION, function(pClassName) {
        if (!simpli.isType(pClassName, simpli.STRING)) {
            throw new TypeError("Invalid class name, it should be a string");
        }
        var vClassProp = this.prop("class");
        this.prop("class", ((typeof vClassProp === "undefined" || vClassProp === "")? pClassName: vClassProp+" "+pClassName));
        return this;
    });

    /**
     * Add a CSS class to the element
     *
     * @function removeClass
     * @param {string} pClassName   the class anme to be added
     * @return {object}             simpli object
     * @memberof simpli
     * @instance
     */
    simpli.HTMLElement.extend("removeClass", simpli.HTMLElement.COLLECTION, function(pClassName) {
        if (!simpli.isType(pClassName, simpli.STRING)) {
            throw new TypeError("Invalid class name, it should be a string");
        }
        var vClassList = this.prop("class").split(" ");
        var vNewClassName = "";
        var vFirstClass = false;
        for (var i=0,l=vClassList.length; i<l; i++) {
            if (vClassList[i] === pClassName) {
                continue;
            } else {
                if (vFirstClass === true) {
                    vNewClassName = vClassList[i];
                    vFirstClass = false;
                } else {
                    vNewClassName += " "+vClassList[i];
                }
            }
        }
        this.prop("class", vNewClassName);
        return this;
    });

    /**
     * Set or retrieve the text of an element
     *
     * @function text
     * @param {string} pText    (Optional) the text to be set
     * @return {object|string}  the simpli object or the text when pText is 
     *                          null
     * @memberof simpli
     * @instance
     */
    simpli.HTMLElement.extend("text", simpli.HTMLElement.CUSTOMIZE, function(pText) {
        if (!simpli.isType(pText, simpli.STRING, simpli.OPTIONAL)) {
            throw new TypeError("Invalid text, it should be a string")
        }
        if (simpli.isset(pText)) {
            // set element innerText
            this.node().innerText = pText;
            return this;
        } else {
            // retrieval
            return this.node().innerText;
        }
    }, function(pText) {
        if (!simpli.isType(pText, simpli.STRING, simpli.OPTIONAL)) {
            throw new TypeError("Invalid text, it should be a string")
        }
        if (simpli.isset(pText)) {
            // set all element innerText
            this.forEach(function(currentElement, index) {
                curentElement.node().innerText = pText;
            })
            return this;
        } else {
            // retrieval
            throw new Error("[SimpliJS] Cannot retrieve text on an element collection")
        }
    });

    /**
     * Set or retrieve the html of an element
     *
     * @function html
     * @param {string} pHTML    (Optional) the HTML to be set
     * @return {object|string}  the simpli object or the HTML when pHTML is 
     *                          null
     * @memberof simpli
     * @instance
     */
    simpli.HTMLElement.extend("html", simpli.HTMLElement.CUSTOMIZE, function(pHTML) {
        if (!simpli.isType(pHTML, simpli.STRING, simpli.OPTIONAL)) {
            throw new TypeError("Invalid text, it should be a string")
        }
        if (simpli.isset(pHTML)) {
            // set element innerText
            this.node().innerHTML = pHTML;
            return this;
        } else {
            // retrieval
            return this.node().innerHTML;
        }
    }, function(pHTML) {
        if (!simpli.isType(pHTML, simpli.STRING, simpli.OPTIONAL)) {
            throw new TypeError("Invalid text, it should be a string")
        }
        if (simpli.isset(pHTML)) {
            // set all element innerText
            this.forEach(function(currentElement, index) {
                curentElement.node().innerHTML = pHTML;
            })
            return this;
        } else {
            // retrieval
            throw new Error("[SimpliJS] Cannot retrieve html on an element collection")
        }
    });

    /**
     * Convert a standard CSS style attribute to its camel case notation
     * e.g. font-size to fontSize
     *
     * @function camerlize
     * @param {string} pAttr    the attribute to be camelized
     * @return {string}         the attribute in camel case notation
     * @memberof global.simpli
     */
    simpli.camelize = function(pAttr) {
        if (!simpli.isType(pAttr, simpli.STRING)) {
            throw new TypeError("Invalid attribute, it should be a string");
        }
        var hump;
        var humpRegExp = /-([a-z])/;
        while((hump=pAttr.match(humpRegExp)) && hump !== null) {
            pAttr = pAttr.replace(hump, hump.toUpperCase());
        }
    }

    /**
     * Set the css style of an element. This function is to provide set 
     * feature to the simpli.css() and is not intended to be called at other 
     * instance
     *
     * Usage:
     * simpli({HTMLElement}).css(pStyle, pValue);
     *
     * @param {string|string[]} pStyle      style attribute or list of style 
     *                                      attributes
     * @param {string|number} pValue        (Optional)the attribute's value
     *                                      If not provided, it is for
     *                                      retrieval.
     * @return {object}                     this object
     */
    var _DOMSetCss = function(pStyle, pValue) {
        if (simpli.isArray(pStyle)) {
            for(var i=0, l=pStyle.length; i<l; i++) {
                this.css(pStyle[i], pValue);
            }
        } else {
            // use cssText to provide cross-browser compatibility
            var vCssText = this.style.cssText;
            if (vCssText.length > 0 && vCssText.slice(-1)!==";") {
                vCssText += ";";
            }
            this.style.cssText = vCssText + pStyle + ":" + pValue + ";";
        }
            
        return this;
    }

    /**
     * Add css() method to HTMLElement. It can get and set the style of the 
     * element
     *
     * Usage:
     * simpli({HTMLElement}).css(pStyle, pValue);
     *
     * @function css
     * @param {string|string[]} pStyle      style attribute or list of style 
     *                                      attributes
     * @param {string|number} pValue        (Optional)the attribute's value
     *                                      If not provided, it is for
     *                                      retrieval
     * @return {string|object}              string when doing retrieval, this 
     *                                      object when doing set
     * @memberof simpli
     * @instance
     */
    simpli.HTMLElement.extend("css", simpli.HTMLElement.CUSTOMIZE, function(pStyle, pValue) {
        if (!simpli.isType(pStyle, [simpli.STRING, {Array:simpli.STRING}])) {
            throw new TypeError("Invalid style, it should be a string or array of string");
        }
        if (!simpli.isType(pValue, [simpli.STRING, simpli.NUMBER], simpli.OPTIONAL)) {
            throw new TypeError("Invalid value, it should be a string or number");
        }
        // distinguish beteween set and get
        if (simpli.isset(pValue)) {
            // set style
            _DOMSetCss.call(this, pStyle, pValue);
        } else {
            // retrieval
            if (typeof this.currentStyle !== "undefined") {
                /* 
                 * IE support currentStyle object but the style property has 
                 * to be withou the "-" and the following words have their
                 * frist character capitalized
                 */
                return this.currentStyle[simpli.camelize(pStyle)];
            } else if (typeof window.getComputedStyle !== "undefined") {
                return document.defaultView.getComputedStyle(this, null).getPropertyValue(pStyle);
            }
        }
        return this;
    }, function(pStyle, pValue) {
        if (!simpli.isType(pStyle, [simpli.STRING, simpli.ARRAY])) {
            throw new TypeError("Invalid style, it should be a string or array of string");
        }
        if (!simpli.isType(pValue, [simpli.STRING, simpli.NUMBER], simpli.OPTIONAL)) {
            throw new TypeError("Invalid value, it should be a string or number");
        }
        // distinguish beteween set and get
        if (simpli.isset(pValue)) {
            // set style
            this.forEach(function(currentElement) {
                _DOMSetCss.call(currentElement[0], pStyle, pValue);
            });
        } else {
            // retrieval
            /*
             * retrieve only when there is only one element, otherwise throw
             * an error
             */
            throw new Error("[SimpliJS] Cannot retrieve css from an element collection");
        }
        return this;
    });

    /**
     * Add removeCss() to HTMLElement. It can remove inline css from the 
     * element
     * 
     * @function removeCss
     * @param {string|string[]} pStyle      style attribute or list of style 
     *                                      attributes
     * @return {object}         this object
     * @memberof simpli
     * @instance
     */
    simpli.HTMLElement.extend("removeCss", simpli.HTMLElement.COLLECTION, function(pStyle) {
        if (!simpli.isType(pStyle, [simpli.STRING, {Array:simpli.STRING}])) {
            throw new TypeError("Invalid style, it should be a string or array of string");
        }
        if (simpli.isArray(pStyle)) {
            for(var i=0, l=pStyle.length; i<l; i++) {
                this.removeCss(pStyle[i]);
            }
        } else {
            var vStyleRegExp = new RegExp(pStyle+":[^;]+;");

            this.style.cssText = this.style.cssText.replace(vStyleRegExp, "");
        }
        return this;
    });

    /**
     * Set the CSS display property to non-"none" value<br />
     * Usage:
     * simpli({HTMLElement}).show(...)
     *
     * @function show
     * @param {string} pValue   (Optional)any valid display value that is 
     *                          non-"none". Default value is "block"
     * @return {object}         this object
     * @memberof simpli
     * @instance
     */
    simpli.HTMLElement.extend("show", simpli.HTMLElement.COLLECTION, function(pValue) {
        if (!simpli.isType(pValue, simpli.STRING, simpli.OPTIONAL)) {
            throw new TypeError("Invalid value, it should be a string");
        }
        if (simpli.isset(pValue)) {
            switch (pValue) {
                case "inline": 
                case "block": 
                case "flex": 
                case "inline-block": 
                case "inline-flex": 
                case "inline-table": 
                case "list-item": 
                case "run-in": 
                case "table": 
                case "table-caption": 
                case "table-column-group": 
                case "table-header-group": 
                case "table-footer-group": 
                case "table-row-group": 
                case "table-cell": 
                case "table-column": 
                case "table-row": 
                case "initial": 
                case "inherit": 
                    this.style.display = pValue;
                    break;
                case "none": 
                    throw new TypeError("simpli(..).show(\"none\") is not supported. Please use simpli(..).hide() instead");
                default: 
                    throw new TypeError("Unrecognized display value. It should be one of the standard values");
            }
        } else {
            // default value is block
            this.style.display = "block";
        }
        return this;
    });

    /**
     * Set the CSS display property to none<br />
     * Usage:
     * simpli({HTMLElement}).hide()
     * 
     * @function hide
     * @return {object}     this object
     * @memberof simpli
     * @instance
     */
    simpli.HTMLElement.extend("hide", simpli.HTMLElement.COLLECTION, function() {
        this.style.display = "none";
        return this;
    });

    /**
     * Simple Fadein effect to HTMLElement<br />
     * Usage:
     * simpli({HTMLElement}).fadeIn(...)
     *
     * @function fadeIn
     * @param {integer} pTimeout        (Optional)time to fade in
     * @param {function} pCallBefore    (Optional)callback before fade in
     * @param {function} pCallAFter     (Optional)callback after fade in
     * @return {object}                 this object
     * @memberof simpli
     * @instance
     */
    simpli.HTMLElement.extend("fadeIn", simpli.HTMLElement.COLLECTION, function(pTimeout, pCallBefore, pCallAfter) {
        // default timeout is 3s
        var vTimeout = 300;
        if (!simpli.isType(pTimeout, simpli.INTEGER, simpli.OPTIONAL)) {
            throw new TypeError("Invalid timeout, it should be an integer");
        }
        if (!simpli.isType(pCallBefore, simpli.FUNCTION, simpli.OPTIONAL)) {
            throw new TypeError("Invalid before callback, it should be a function");
        }
        if (!simpli.isType(pCallAfter, simpli.FUNCTION, simpli.OPTIONAL)) {
            throw new TypeError("Invalid after callback, it should be a function");
        }
        if (simpli.isset(pTimeout)) {
            vTimeout = pTimeout;
        }

        // set the element opacity to 0 before fading in
        this.css(["transition", "-webkit-ransition", "-moz-transition"], "opacity 0s");
        this.css("opacity", 0);
        this.css("filter", "alpha(opacity=0)");
        if (simpli.isset(pCallBefore)) {
            pCallBefore.call(this);
        }
        var self = this;
        var vOpacity = 0.1;
        var i = 0;
        var vTimer = setInterval(function() {
            if (i++ === 25) {
                clearInterval(vTimer);
                self.css("opacity", 1);
                self.css("filter", "alpha(opacity=100");
                if (simpli.isset(pCallAfter)) {
                    pCallAfter.call(self);
                }
            }
            self.css("opacity", vOpacity);
            self.css("filter", "alpha(opacity=" + (vOpacity*100) + ")");
            vOpacity += vOpacity*0.1;
        /*
         * Starting from 0, increment by self*0.1 until 1, there will be
         * 25 iterations. Evenly distribute the given timeout to 25 
         * interations
         */
        }, pTimeout/25);

        return this;
    }); 

    /**
     * Simple Fadeout effect to HTMLElement<br />
     * Usage:
     * simpli({HTMLElement}).fadeOut(...)
     *
     * @function fadeOut
     * @param {integer} pTimeout        (Optional)time to fade out
     * @param {function} pCallBefore    (Optional)callback before fade out
     * @param {function} pCallAFter     (Optional)callback after fade out
     * @return {object}                 this object
     * @memberof simpli
     * @instance
     */
    simpli.HTMLElement.extend("fadeOut", simpli.HTMLElement.COLLECTION, function(pTimeout, pCallBefore, pCallAfter) {
        // default timeout is 3s
        var vTimeout = 300;
        if (!simpli.isType(pTimeout, simpli.INTEGER, simpli.OPTIONAL)) {
            throw new TypeError("Invalid timeout, it should be an integer");
        }
        if (!simpli.isType(pCallBefore, simpli.FUNCTION, simpli.OPTIONAL)) {
            throw new TypeError("Invalid before callback, it should be a function");
        }
        if (!simpli.isType(pCallAfter, simpli.FUNCTION, simpli.OPTIONAL)) {
            throw new TypeError("Invalid after callback, it should be a function");
        }
        if (simpli.isset(pTimeout)) {
            vTimeout = pTimeout;
        }
        this.css(["transition", "-webkit-ransition", "-moz-transition"], "opacity 0s");
        this.css("opacity", 1);
        this.css("filter", "alpha(opacity=100)");
        if (simpli.isset(pCallBefore)) {
            pCallBefore.call(this);
        }
        var self = this;
        var vOpacity = 1;
        var i = 0;
        var vTimer = setInterval(function() {
            if (i++ == 25) {
                clearInterval(vTimer);
                vOpacity = 0;
                if (simpli.isset(pCallAfter)) {
                    pCallAfter.call(self);
                }
            }
            self.css("opacity", vOpacity);
            self.css("filter", "alpha(opacity=" + (vOpacity*100) + ")");
            vOpacity -= vOpacity*0.1;
        /*
         * Starting from 1, decrement by self*0.1 until 0, there will be
         * unlimited iterations. To make it easy, just evenly distribute the
         * timeout to 25 iterations
         */
        }, pTimeout/25);

        return this;
    });

    /**
     * Add forEach() method to HTMLElement. It can loop through the 
     * HTMLElement collection and call the callback function to each of the
     * HTMLElement<br />
     * Usage:
     * {HTMLCollection}.forEach(callback, (optional)thisArg);
     *
     * @function forEach
     * @param {function} pCcllback  the callback function to be called on each 
     *                              HTMLElement, its signature should be like
     *                              function(currentElement, index, array) {}
     * @param Object pThisArg       (Optional) the "this" context in the 
     *                              callback
     * @return {object}             this object
     * @memberof simpli
     * @instance
     */
    simpli.HTMLElement.extend("forEach", simpli.HTMLElement.CUSTOMIZE, function(pCallback, pThisArg) {
        if (!simpli.isType(pCallback, simpli.FUNCTION)) {
        throw new TypeError("Invalid callback, it should be a function");
        }
        if (!simpli.isType(pThisArg, simpli.OBJECT, simpli.OPTIONAL)) {
        throw new TypeError("Invalid this context, it should be an object");
        }
        // wrap the curent element in simpli for consistency
        var vObject = simpli(this[0]);
        if (simpli.isset(pThisArg)) {
            pCallback.call(pThisArg, vObject, 0, this);
        } else {
            pCallback.call(vObject, vObject, 0, this);
        }

        return this;
    }, function(pCallback, pThisArg) {
        if (!simpli.isType(pCallback, simpli.FUNCTION)) {
        throw new TypeError("Invalid callback, it should be a function");
        }
        if (!simpli.isType(pThisArg, simpli.OBJECT, simpli.OPTIONAL)) {
        throw new TypeError("Invalid this context, it should be an object");
        }
        var vLen = this.length;
        // wrap the curent element in simpli for consistency
        if (simpli.isset(pThisArg)) {
            for (var i=0; i<vLen; i++) {
                pCallback.call(pThisArg, simpli(this[i]), i , this);
            }
        } else {
            for (var i=0; i<vLen; i++) {
                pCallback.call(simpli(this[i]), simpli(this[i]), i, this);
            }
        }

        return this;
    });
    
    /**
     * Add getSelectedValue() method to HTMLSelectElement. It returns the user 
     * selected option's value<br />
     * Usage:
     * simpli({HTMLSelectElement}).getSelectedValue();
     *
     * @function getSelectedValue
     * @return {object}     this object
     * @memberof simpli
     * @instance
     */
    simpli.DOMElement.extend("SELECT", "getSelectedValue", function() {
        return this.options[this.selectedIndex].value;
    });

    /**
     * Add getSelectedOption() method to HTMLSelectElement. It returns the 
     * user selected option's text<br />
     * Usage:
     * simpli({HTMLSelectElement}).getSelectedOption();
     *
     * @function getSelectedOption
     * @return {object}     this object
     * @memberof simpli
     * @instance
     */
    simpli.DOMElement.extend("SELECT", "getSelectedOption", function() {
        return this.options[this.selectedIndex].text;
    });
})(this);