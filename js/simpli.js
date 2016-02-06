"use strict";
/**
 * SimpliJS
 * A small library consists of some useful and shorthand function
 *
 * Copyright (c) 2016 Lau Yu Hei
 * 
 * @author Lau Yu Hei
 * @version 1.0.5
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
    var simplify = function(vObject) {
        // distinguish between HTMLCollection|Array and HTMLElement
        if (typeof vObject.length === "undefined") {
            // single HTMLElement
            // append simpli structure
            vObject._simpli = {
            };
            vObject.toString = function() {
                return "[object simpliElement]";
            }

            if (vObject.nodeType === 9) {
                // the DOM object is an HTMLElement or a document
                global.simpli.DOMElement.simplify("document", vObject, simpli.DOMElement.ELEMENT);
            } else {
                global.simpli.DOMElement.simplify("HTMLElement", vObject, simpli.DOMElement.ELEMENT);
                global.simpli.DOMElement.simplify(vObject.nodeName, vObject, simpli.DOMElement.ELEMENT);
            }
        } else {
            vObject.toString = function() {
                return "[object simpliCollection]";
            }
            global.simpli.DOMElement.simplify("HTMLElement", vObject, simpli.DOMElement.COLLECTION);
            global.simpli.DOMElement.simplify("HTMLCollection", vObject, simpli.DOMElement.ELEMENT);
            vObject.forEach(function(currentElement, index, array) {
                // simplify each element in a collection
                vObject[index] = simplify(currentElement);
            });
        }

        return vObject;
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
     * @param {(string|object)} pSelector   selector string or a DOM object
     * @return {object}                     the simpli DOM object
     * @memberof global.simpli
     */
    global.simpli = function(pSelector) {
        var vObject;
        if (simpli.isType(pSelector, simpli.STRING)) {
            try {
                vObject = document.querySelectorAll(pSelector);
            }catch(e) {
                throw new Error("Invalid selector, it should be a valid CSS selector");
            }
        } else if (simpli.isType(pSelector, simpli.OBJECT)) {
            if (simpli.getClass(pSelector) === "HTMLCollection" || simpli.isArray(pSelector)) {
                // result from document.querySelectorAll() polyfill included
                vObject = pSelector;
            } else if (typeof pSelector.nodeType !== "undefined") {
                // single element
                if (pSelector.nodeType === 1) {
                    // condition for HTMLElement node
                    /*
                     * user provide with a HTMLElement, wrap it in an Array to 
                     * pretend to be result of querySelectorAll()
                     */
                    vObject = [pSelector];
                } else if (pSelector.nodeType === 9) {
                    // condition for document node
                    vObject = pSelector
                }
            } else {
                throw new Error("Invalid DOM object, it should be a DOM collection or element")
            }
        } else {
            throw new Error("Invalid selector, it should be a string or DOM object");
        }

        // simplify the object
        vObject = simplify(vObject);
        
        return vObject;
    };
    global.simpli.prototype.toString = function() {
        return "[object simpli]";
    };

    // data structure
    /**
     * simpli.queue is a simple queue structure
     *
     * @class Queue
     * @memberof global.simpli
     */
    (function() {
        global.simpli.Queue = function() {
            // make simpli.Queue() new-Agnostic
            if (!(this instanceof simpli.Queue)) {
                return new simpli.Queue();
            }
            this._struct = [];
            this._head = 0;
            this._tail = 0;
        };
        global.simpli.Queue.prototype.isEmpty = function() {
            return (this._tail === this._head);
        };
        global.simpli.Queue.prototype.enqueue = function(element) {
            if (!simpli.isset(element)) {
                throw new Error("Missing element, it should be presented");
            }
            this._struct[this._tail++] = element;
        };
        global.simpli.Queue.prototype.dequeue = function() {
            if (this.isEmpty()) {
                return null;
            }
            var vResult = this._struct[this._head];
            this._struct[this._head++] = null;
            return vResult;
        };
        global.simpli.Queue.prototype.front = function() {
            if (this.isEmpty()) {
                return null;
            }
            return this._struct[this._head];
        };
        global.simpli.Queue.prototype.toString = function() {
            return "[object simpli.Queue]";
        }
    })();

    /**
     * simpli.queue is a simple queue structure
     *
     * @class Stack
     * @memberof global.simpli
     */
    (function() {
        global.simpli.Stack = function() {
            if(!(this instanceof simpli.Stack)) {
                return new simpli.Stack();
            }
            this._struct = [];
            this._top = 0;
        };
        global.simpli.Stack.prototype.isEmpty = function() {
            return (this._top === 0);
        };
        global.simpli.Stack.prototype.push = function(element) {
            if (!simpli.isset(element)) {
                throw new Error("Missing element, it should be presented");
            }
            this._struct[++this._top] = element;
        };
        global.simpli.Stack.prototype.pop = function() {
            if (this.isEmpty()) {
                return null;
            }
            var vResult = this._struct[this._top];
            this._struct[this._top--] = null;
            return vResult;
        };
        global.simpli.Stack.prototype.top = function() {
            if (this.isEmpty()) {
                return null;
            }
            return this._struct[this._top];
        };
        global.simpli.Stack.prototype.toString = function() {
            return "[object simpli.Stack]";
        };
    })();

    /**
     * simpli.BinaryTreeNode is a node for binary tree
     *
     * @class BinaryTreeNode
     * @memberof global.simpli
     */
    (function() {
        /**
         * @constrcutor
         * @param {integer} pData   the value of the node
         * @memberof global.simpli.BinaryTreeNode
         */
        global.simpli.BinaryTreeNode = function(pData) {
            if (!(this instanceof simpli.BinaryTreeNode)) {
                return new simpli.BinaryTreeNode(pData);
            }
            if (!simpli.isType(pData, simpli.INTEGER)) {
                throw new Error("Invalid data, it should be an integer");
            }
            this._leftNode = null;
            this._rightNode = null;
            this._data = pData;
        }
        global.simpli.BinaryTreeNode.prototype.getData = function() {
            return this._data;
        };
        global.simpli.BinaryTreeNode.prototype.getLeftNode = function() {
            return this._leftNode;
        };
        global.simpli.BinaryTreeNode.prototype.hasLeftNode = function() {
            return this._leftNode !== null;
        };
        global.simpli.BinaryTreeNode.prototype.setLeftNode = function(pData) {
            if (!simpli.isType(pData, [simpli.INTEGER, {Object:"simpli.BinaryTreeNode"}])) {
                throw new Error("Invalid node, it should be an integer or simpli.BinaryTreeNode");
            }
            var vNode;
            if (simpli.isInteger(pData)) {
                vNode = new simpli.BinaryTreeNode(pData);
            } else if (simpli.isType(pData, simpli.OBJECT)) {
                if (simpli.getClass(pData) !== "simpli.BinaryTreeNode") {
                    throw new Error("Invalid node object, it should be a simpli.BinaryTreeNode object or null");
                }
                vNode = pData;
            }
            this._leftNode = vNode;

            return this;
        };
        global.simpli.BinaryTreeNode.prototype.getRightNode = function() {
            return this._rightNode;
        };
        global.simpli.BinaryTreeNode.prototype.hasRightNode = function() {
            return this._rightNode !== null;
        };
        global.simpli.BinaryTreeNode.prototype.setRightNode = function(pData) {
            if (!simpli.isType(pData, [simpli.INTEGER, {Object:"simpli.BinaryTreeNode"}])) {
                throw new Error("Invalid node, it should be an integer or simpli.BinaryTreeNode");
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
        global.simpli.BinaryTreeNode.prototype.toString = function() {
            return "[object simpli.BinaryTreeNode]";
        };
    })();

    /**
     * simpli.BinaryTreeNode is a node for binary tree
     *
     * @class BinaryTree
     * @memberof global.simpli
     */
    (function() {
        /**
         * @constrcutor
         * @param {integer|simpli.BinaryTreeNode|simpli.BinaryTree} pInitData   (Optional)the initial data for the 
         *                                                                      binary tree. It can either be an 
                                                                                integer data or a node as root, or a 
                                                                                binary tree representation
         * @memberof global.simpli.BinaryTreeNode
         */
        global.simpli.BinaryTree = function(pInitData) {
            if (!simpli.isType(pInitData, [simpli.INTEGER, 
                {Object: "simpli.BinaryTreeNode"}, 
                {Object: "simpli.BinaryTree"}], simpli.OPTIONAL)) {
                throw new Error("Invalid initialization data, it should be an integer, simpli.BinaryTreeNode, simpli.BinaryTree or simpli.BinaryTreeTraversal");
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
        global.simpli.BinaryTree.prototype.insert = function(pNode) {
            if (!simpli.isType(pNode, [simpli.INTEGER, {Object:"simpli.BinaryTreeNode"}])) {
                throw new Error("Invalid node, is should be a simpli.BinaryTreeNode");
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
        global.simpli.BinaryTree.prototype.getSize = function() {
            return this._size;
        }
        global.simpli.BinaryTree.prototype.getHeight = function() {
            return Math.log2(this.getSize());
        }
        global.simpli.BinaryTree.prototype.getRoot = function() {
            return this._root;
        }
        global.simpli.BinaryTree.prototype.setRoot = function(pNode) {
            if (simpli.exist(pNode) && simpli.getClass(pNode) !== "simpliBinaryTreeNode") {
                throw new Error("Invalid node, it should be a simpli.BinaryTreeNode object or null");
            }
            this._root = pNode;
        }
        global.simpli.BinaryTree.prototype.preOrder = function() {
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
        global.simpli.BinaryTree.prototype.inOrder = function() {
            var vResult = [];
            inOrderTraversal(this.getRoot(), vResult);
            return vResult;
        };
        // TODO:
        global.simpli.BinaryTree.prototype.postOrder = function() {
        };
        // TODO:
        global.simpli.BinaryTree.prototype.levelOrder = function() {
        };
        global.simpli.BinaryTree.prototype.toString = function() {
            return "[object simpli.BinaryTree]";
        };
    })();

    (function() {
        var binarySearch = function(pArray, pTarget, pBegin, pEnd) {
            if (pEnd-pBegin <= 0) {
                return (pArray[pBegin] === pTarget);
            }
            var vMid = pBegin+Math.floor((pEnd-pBegin)/2);
            var vMidValue = pArray[vMid];
            if (pTarget < vMidValue) {
                return binarySearch(pArray, pTarget, pBegin, vMid-1);
            } else if (pTarget > vMidValue) {
                return binarySearch(pArray, pTarget, vMid+1, pEnd);
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
         * @memberof global.simpli
         */
        global.simpli.binarySearch = function(pArray, pTarget) {
            if (!simpli.isType(pArray, {Array:simpli.INTEGER})) {
                throw new Error("Invalid array, it should be an integer array");
            }
            if (!simpli.isType(pTarget, simpli.INTEGER)) {
                throw new Error("Invalid target, it should be an integer");
            }
            return binarySearch(pArray, pTarget, 0, pArray.length);
        }
    })();

    global.simpli.STRING = "String";
    global.simpli.NUMBER = "Number";
    global.simpli.BOOLEAN = "Boolean";
    global.simpli.BOOL = "Boolean";
    global.simpli.OBJECT = "Object";
    global.simpli.FUNCTION = "Function";
    global.simpli.INTEGER = "Integer";
    global.simpli.INT = "Integer";
    global.simpli.ARRAY = "Array";
    // IE backward compatibility
    global.simpli.UNKNOWN = "unknown";

    global.simpli.REQUIRED = true;
    global.simpli.OPTIONAL = false;

    /**
     * Get the class name of a variable
     *
     * @param {mixed} pVar  the variable to get its class
     * @return {string}     the class name
     * @memberof global.simpli
     */
    global.simpli.getClass = function(pVar) {
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
     * @memberof global.simpli
     */
    global.simpli.exist = function(pArg) {
        return (typeof pArg !== "undefined");
    };

    /** 
     * Check if a variable is set. undefined and null are both considered as 
     * not isset
     *
     * @param {mixed} pArg  the argument to be checked
     * @return {boolean}    whether the arugment is set
     * @memberof global.simpli
     */
    global.simpli.isset = function(pArg) {
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
    global.simpli.iterativeIsset = function() {
        var l = arguments.length;
        if (l < 1) {
            throw new Error("Invalid arguments, it should contain at least an object");
        }

        var vObject = arguments[0];
        var vArg;
        for (var i=1; i<l; i++) {
            var vArg = arguments[i];
            if (!simpli.isType(vArg, [simpli.STRING, simpli.INTEGER])) {
                throw new Error("Invalid key, it should be a string or integer");
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
     * @memberof global.simpli
     */
    global.simpli.isNaN = function(pVar) {
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
     * @memberof global.simpli
     */
    global.simpli.isInteger = function(pVar) {
        return (typeof pVar === "number") && (pVar%1 === 0);
    };

    /**
     * Check if a variable is within a range
     *
     * @param {number} pVar         variable to check against
     * @param {number} pLowerBound  (Optional) the lower bound
     * @param {number} pUpperBound  (Optional) the upper bound
     * @reutrn {boolean}            whether the variable is within range
     * @memberof global.simpli
     */
    global.simpli.inRange = function(pVar, pLowerBound, pUpperBound) {
        if (!simpli.isType(pVar, simpli.NUMBER)) {
            throw new Error("Invalid variable, it should be an number");
        }
        if (!simpli.isType(pLowerBound, simpli.NUMBER, simpli.OPTIONAL)) {
            throw new Error("Invalid lower bound, it should be an number");
        }
        if (!simpli.isType(pLowerBound, simpli.NUMBER, simpli.OPTIONAL)) {
            throw new Error("Invalid upper bound, it should be an number");
        }
        if (!simpli.isset(pLowerBound) && !simpli.isset(simpli.pUpperBound)) {
            throw new Error("Invalid invocation, at least one bound should be specified");
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
     * Check if a variable is a string
     *
     * @param {mixed} pVar  variable to check against
     * @return {boolean}    whether the variable is a string
     * @memberof global.simpli
     */
    global.simpli.isString = function(pVar) {
        return (typeof pVar === "string");
    };

    /**
     * Check if a variable is a number
     *
     * @param {mixed} pVar  variable to check against
     * @return {boolean}    whether the variable is a number
     * @memberof global.simpli
     */
    global.simpli.isNumber = function(pVar) {
        return (typeof pVar === "number");
    };

    /**
     * Check if a variable is a boolean
     *
     * @param {mixed} pVar  variable to check against
     * @return {boolean}    whether the variable is a boolean
     * @memberof global.simpli
     */
    global.simpli.isBoolean = function(pVar) {
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
     * @memberof global.simpli
     */
    global.simpli.isObject = function(pVar, pClass) {
        if (typeof pClass === "undefined") {
            return (typeof pVar === "object");
        } else if (typeof pClass === "string") {
            return (simpli.getClass(pVar) === pClass);
        } else if (typeof pClass === "object") {
            return (pVar instanceof pClass)
        } else {
            throw new Error("Invalid class, it should be a string or class object");
        }
    };

    /**
     * Check if a variable is a function
     *
     * @param {mixed} pVar  variable to check against
     * @return {boolean}    whether the variable is a function
     * @memberof global.simpli
     */
    global.simpli.isFunction = function(pVar) {
        return (typeof pVar === "function");
    };

    /**
     * Check if a variable is an array
     *
     * @param {mixed} pVar  variable to check against
     * @return {boolean}    whether the variable is an array
     * @memberof global.simpli
     */
    global.simpli.isArray = function(pVar) {
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
     * @memberof global.simpli
     */
    global.simpli.isType = function(pVar, pType, pRequired) {
        // default value for required flag is true
        var vRequired = true;
        if (typeof pRequired !== "undefined") {
            if (typeof pRequired !== "boolean") {
                throw new Error("Invalid required flag, it should be a boolean");
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
            throw new Error("Invalid type, it should be a string, object or an array of them");
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
                throw new Error("Unrecognized type object, it should be specificing a typed array or object class");
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
                    throw new Error("Unrecognized type, it should be one of the valid data types");
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
    global.simpli.ucfirst = function(pString) {
        if (!simpli.isType(pString, simpli.STRING)) {
            throw new Error("Invalid argument, it should be a string");
        }
        return pString.charAt(0).toUpperCase() + pString.slice(1);
    }

    // DOM manipulation
    /**
     * DOMElement is a binding managment object that allows additional
     * functions to be binded to a specific HTML element type
     * 
     * @class DOMElement
     * @memberof global.simpli
     */
    global.simpli.DOMElement = {
        // define constants
        /**
         * @property {integer} ELEMENT  denote ELEMENT type
         * @memberof global.simpli.DOMElement
         */
        ELEMENT: 0, 
        /**
         * @property {integer} COLLECTION   denote COLLECTION type
         * @memberof global.simpli.DOMElement
         */
        COLLECTION: 1, 
        /**
         * @property {integer} BOTH     denote BOTH types applicable
         * @memberof global.simpli.DOMElement
         */
        BOTH: 2, 
        /**
         * a data structure storing the binded functions
         *
         * @property {function[]} mBindedFunc   a list of binded functions
         * @memberof global.simpli.DOMElement
         */
        mBindedFunc: {}, 
        /** 
         * @property {function} mExecBefore     list of function to be 
         *                                      executed before binding
         * @memberof global.simpli.DOMElement
         */
        mExecBefore: {}, 
        /** 
         * @property {function} mExecAfter  list of function to be executed 
         *                                  after binding
         * @memberof global.simpli.DOMElement
         */
        mExecAfter: {}, 
        /**
         * Allows additional function to be binded to the element type. 
         * 
         * @function extend
         * @param {string|string[]} pElement    the HTML element to bind the 
         *                                      function
         * @param {string} pName                the name of the additional
         *                                      function
         * @param {function} pFunction          the function body
         * @param {integer} pType               (Optional)specific the type 
         *                                      to be binded with the
         *                                      function. <br />
         *                                      If it is "element" or 
         *                                      "collection", the function 
         *                                      will be binded directly to the
         *                                      object. <br /> 
         *                                      If it is "both", it behaves 
         *                                      the same for single element 
         *                                      object but will wrap the 
         *                                      function with a forEach loop
         *                                      to apply the function to all
         *                                      child of a collection object
         *                                      when called`
         * @memberof global.simpli.DOMElement
         */
        extend: function(pElement, pName, pFunction, pType) {
            if (!simpli.isType(pElement, [simpli.STRING, {Array:simpli.STRING}])) {
                throw new Error("Invalid element, it should be a string or array of string");
            }
            if (simpli.isArray(pElement)) {
                for (var i=0, l=pElement.length; i<l; i++) {
                    this.extend(pElement[i], pName, pFunction, pType);
                }
                return;
            }
            if (!simpli.isType(pName, simpli.STRING)) {
                throw new Error("Invalid name, it should be a string");
            }
            if (!simpli.isType(pFunction, simpli.FUNCTION)) {
                throw new Error("Invalid function, it should be a function");
            }
            if (!simpli.isType(pType, simpli.INTEGER, simpli.OPTIONAL)) {
                throw new Error("Invalid type, it should be an integer");
            }
            var vType;
            if (simpli.isset(pType)) {
                if (!simpli.inRange(pType, 0, 2)) {
                    throw new Error("Invalid type, it should be one of the DOMElement constants");
                }
                vType = pType;
            } else {
                // default type is both
                vType = simpli.DOMElement.BOTH;
            }
            var vElement = pElement.toUpperCase();
            var vBoth = (vType === simpli.DOMElement.BOTH);

            if (!simpli.exist(this.mBindedFunc[vElement])) {
                this.mBindedFunc[vElement] = {element: [], collection: []};
            }
            if (vBoth || vType === simpli.DOMElement.ELEMENT) {
                this.mBindedFunc[vElement]["element"].push([pName, pFunction]);
            } else if ( vType === simpli.DOMElement.COLLECTION) {
                this.mBindedFunc[vElement]["collection"].push([pName, pFunction]);
            }
            if (vBoth) {
                // this refers to simpli.DOMElement
                this.mBindedFunc[vElement]["collection"].push([pName, function(){
                    var args = arguments;
                    // this refers to the simpli element
                    this.forEach(function(currentElement) {
                        if (args.length === 0) {
                            pFunction.call(currentElement);
                        } else {
                            pFunction.apply(currentElement, args);
                        }
                    });
                    return this;
                }]);
            }
        }, 

        /**
         * Simplify an object by binding those extended extnesions to the provided
         * object
         *
         * @function simplify
         * @param {string} pElement     the HTML element to be simplified
         * @param {object} pObject      the object to be simplified
         * @return {object}             the simplified object
         * @param {integer} pType       the type of element /collection 
         *                              to be binded with the function
         * @memberof global.simpli.DOMElement
         */
        simplify: function(pElement, pObject, pType) {
            if (!simpli.isType(pElement, simpli.STRING)) {
                throw new Error("Invalid element, it should be a string");
            }
            if (!simpli.isType(pObject, simpli.OBJECT)) {
                throw new Error("Invalid function, it should be a function");
            }
            if (!simpli.isType(pType, simpli.INTEGER)) {
                throw new Error("Invalid type, it should be an integer");
            }
            if (simpli.isset(pType) && !simpli.inRange(pType, 0, 1)) {
                throw new Error("Invalid type, it should be either ELEMENT or COLLECTION");
            }
            var vElement = pElement.toUpperCase();
            if (simpli.exist(this.mBindedFunc[vElement])) {
                /*
                 * If vExecBefore and vExecAfter is defined, they must have an 
                 * array of element and collection. So checking vExecBefore or
                 * vExecAfter is defined is sufficient to execute the for-loop
                 */
                if (pType === simpli.DOMElement.ELEMENT) {
                    // bind the functions to element object
                    if (simpli.exist(this.mBindedFunc[vElement]["element"])) {
                        var vBindedFunc = this.mBindedFunc[vElement]["element"];
                        for(var i=0, l=vBindedFunc.length; i<l; i++) {
                            var vFunc = vBindedFunc[i];
                            pObject[vFunc[0]] = vFunc[1];
                        }
                    }
                } else {
                    // bind the functions to collection object
                    if (simpli.exist(this.mBindedFunc[vElement]["collection"])) {
                        var vBindedFunc = this.mBindedFunc[vElement]["collection"];
                        for(var i=0, l=vBindedFunc.length; i<l; i++) {
                            var vFunc = vBindedFunc[i];
                            pObject[vFunc[0]] = vFunc[1];
                        }
                    }
                }
            }
            return pObject;
        }
    };

    /**
     * Add parent() method to document and HTMLElement. It can return the 
     * parent node of the simpli object
     *
     * Usage:
     * simpli({HTMLElement|document}).parent();
     * 
     * @function parent
     * @return {object}     parent simpli object
     * @memberof global.simpli
     * @instance
     */
    global.simpli.DOMElement.extend("document", "parent", function() {
        return undefined;
    }, simpli.DOMElement.ELEMENT);
    global.simpli.DOMElement.extend("HTMLElement", "parent", function() {
        return simpli(this.parentNode);
    }, simpli.DOMElement.ELEMENT);
    global.simpli.DOMElement.extend(["document", "HTMLElement"], "parent", function() {
        if (this.length === 1) {
            return this[0].parent();
        } else {
            throw new Error("Unable to get parent of an element collection");
        }
    }, simpli.DOMElement.COLLECTION);

    /**
     * Add siblings() method to HTMLElement. It can return a list of siblings
     * with the given selector
     *
     * TODO:
     */

    /**
     * Add children() method to HTMLElement. It can return a list of children
     * with the given selector
     *
     * TODO:
     */

    /**
     * Add descendants() method to HTMLElement. It can return a list of 
     * descendants with the given selector
     *
     * TODO:
     */

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
     * @memberof global.simpli
     * @instance
     */ 
    global.simpli.DOMElement.extend(["HTMLElement", "document"], "listenTo", function(pType, pListener, pUseCapture) {
        if (!simpli.isType(pType, simpli.STRING)) {
            throw new Error("Invalid type, it should be a string");
        }
        if (!simpli.isType(pListener, simpli.FUNCTION)) {
            throw new Error("Invalid type, it should be a function");
        }
        if (!simpli.isType(pUseCapture, simpli.BOOLEAN, simpli.OPTIONAL)) {
            throw new Error("Invalid pUseCapture, it should be a function");
        }
        // default value for useCapture is false
        var vUseCapture = simpli.isset(pUseCapture)? pUseCapture: false;
        if (simpli.exist(this.addEventListener)) {
            this.addEventListener(pType, pListener, vUseCapture);
        } else if (simpli.exist(this.attachEvent)) {
            // IE5-8 does not have addEventListener method
            this.attachEvent("on"+pType, pListener);
        } else {
            throw new Error("Event listening is not supported");
        }
        return this;
    });

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
     * @memberof global.simpli
     * @instance
     */
    global.simpli.DOMElement.extend("document", "ready", function(pListener) {
        if (!simpli.isType(pListener, simpli.FUNCTION)) {
            throw new Error("Invalid type, it should be a function");
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
            throw new Error("Event listening is not supported");
        }
    }, simpli.DOMElement.ELEMENT);

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
     * @memberof global.simpli
     * @instance
     */
    global.simpli.DOMElement.extend(["HTMLElement", "document"], "click", function(pListener, pUseCapture) {
        if (!simpli.isType(pListener, simpli.FUNCTION)) {
            throw new Error("Invalid type, it should be a function");
        }
        if (!simpli.isType(pUseCapture, simpli.BOOLEAN, simpli.OPTIONAL)) {
            throw new Error("Invalid pUseCapture, it should be a function");
        }
        this.listenTo("click", pListener, pUseCapture);
    });

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
    var attrToProp = function(pAttr) {
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
    var setProp = function(pProp, pValue) {
        var vProp = attrToProp(pProp);
        if (simpli.exist(this[vProp])) {
            this[vProp] = pValue;
        } else {
            this.setAttribute(pProp, pValue);
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
     * @memberof global.simpli
     * @instance
     */
    global.simpli.DOMElement.extend(["HTMLElement", "document"], "prop", function(pProp, pValue) {
        if (!simpli.isType(pProp, simpli.STRING)) {
            throw new Error("Invalid property, it should be a string");
        }
        if (!simpli.isType(pValue, [simpli.STRING, simpli.NUMBER], simpli.OPTIONAL)) {
            throw new Error("Invalid property, it should be a string");
        }

        if (simpli.isset(pValue)) {
            // set property
            setProp.call(this, pProp, pValue);
        } else {
            // retrieval
            var vProp = attrToProp(pProp);
            var vResult;
            // this.{property} usually works
            if (simpli.exist(this[vProp])) {
                vResult = this[vProp];
                if (vResult === null) {
                    vResult = "";
                }
            } else {
                vResult = this.getAttribute(pProp);
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
    }, simpli.DOMElement.ELEMENT);
    global.simpli.DOMElement.extend(["HTMLElement", "document"], "prop", function(pProp, pValue) {
        if (!simpli.isType(pProp, simpli.STRING)) {
            throw new Error("Invalid property, it should be a string");
        }
        if (!simpli.isType(pValue, [simpli.STRING, simpli.NUMBER], simpli.OPTIONAL)) {
            throw new Error("Invalid property, it should be a string");
        }

        if (simpli.isset(pValue)) {
            // set property
            this.forEach(function(currentElement) {
                setProp.call(currentElement, pProp, pValue);
            })
            return this;
        } else {
            // retrieval
            /*
             * retrieve only when there is only one element, otherwise throw
             * an error
             */
            if (this.length === 1) {
                var vProp = attrToProp(pProp);
                var vResult;
                var elem = this[0];
                if (simpli.exist(elem[vProp])) {
                    vResult = elem[vProp];
                    if (vResult === null) {
                        vResult = "";
                    }
                } else {
                    vResult = elem.getAttribute(attrToProp(pProp));
                    /*
                     * if the attribute does not exists, null or "" will be 
                     * returned
                     */
                    if(vResult === null || vResult === "") {
                        vResult = undefined;
                    }
                }
                return vResult;
            } else {
                throw new Error("Unable to retrieve property from an element collection");
            }
        }
    }, simpli.DOMElement.COLLECTION);

    /**
     * Convert a standard CSS style attribute to its camel case notation
     * e.g. font-size to fontSize
     *
     * @param {string} pAttr    the attribute to be camelized
     * @return {string}         the attribute in camel case notation
     */
    var camelize = function(pAttr) {
        if (!simpli.isType(pAttr, simpli.STRING)) {
            throw new Error("Invalid attribute, it should be a string");
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
    var setCss = function(pStyle, pValue) {
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
     * @memberof global.simpli
     * @instance
     */
    global.simpli.DOMElement.extend("HTMLElement", "css", function(pStyle, pValue) {
        if (!simpli.isType(pStyle, [simpli.STRING, {Array:simpli.STRING}])) {
            throw new Error("Invalid style, it should be a string or array of string");
        }
        if (!simpli.isType(pValue, [simpli.STRING, simpli.NUMBER], simpli.OPTIONAL)) {
            throw new Error("Invalid value, it should be a string or number");
        }
        // distinguish beteween set and get
        if (simpli.isset(pValue)) {
            // set style
            setCss.call(this, pStyle, pValue);
        } else {
            // retrieval
            if (typeof this.currentStyle !== "undefined") {
                /* 
                 * IE support currentStyle object but the style property has 
                 * to be withou the "-" and the following words have their
                 * frist character capitalized
                 */
                return this.currentStyle[camelize(pStyle)];
            } else if (typeof window.getComputedStyle !== "undefined") {
                return document.defaultView.getComputedStyle(this, null).getPropertyValue(pStyle);
            }
        }
        return this;
    }, simpli.DOMElement.ELEMENT);
    global.simpli.DOMElement.extend("HTMLElement", "css", function(pStyle, pValue) {
        if (!simpli.isType(pStyle, [simpli.STRING, simpli.ARRAY])) {
            throw new Error("Invalid style, it should be a string or array of string");
        }
        if (!simpli.isType(pValue, [simpli.STRING, simpli.NUMBER], simpli.OPTIONAL)) {
            throw new Error("Invalid value, it should be a string or number");
        }
        // distinguish beteween set and get
        if (simpli.isset(pValue)) {
            // set style
            this.forEach(function(currentElement) {
                setCss.call(currentElement, pStyle, pValue);
            });
        } else {
            // retrieval
            /*
             * retrieve only when there is only one element, otherwise throw
             * an error
             */
            if (this.length === 1) {
                return this[0].css(pStyle);
            } else {
                throw new Error("Unable to retrieve css from an element collection");
            }
        }
        return this;
    }, simpli.DOMElement.COLLECTION);

    /**
     * Add removeCss() to HTMLElement. It can remove inline css from the 
     * element
     * 
     * @function removeCss
     * @param {string|string[]} pStyle      style attribute or list of style 
     *                                      attributes
     * @return {object}         this object
     * @memberof global.simpli
     * @instance
     */
    global.simpli.DOMElement.extend("HTMLElement", "removeCss", function(pStyle) {
        if (!simpli.isType(pStyle, [simpli.STRING, {Array:simpli.STRING}])) {
            throw new Error("Invalid style, it should be a string or array of string");
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
     * @memberof global.simpli
     * @instance
     */
    global.simpli.DOMElement.extend("HTMLElement", "show", function(pValue) {
        if (!simpli.isType(pValue, simpli.STRING, simpli.OPTIONAL)) {
            throw new Error("Invalid value, it should be a string");
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
                    throw new Error("simpli(..).show(\"none\") is not supported. Please use simpli(..).hide() instead");
                default: 
                    throw new Error("Unrecognized display value. It should be one of the standard values");
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
     * @memberof global.simpli
     * @instance
     */
    global.simpli.DOMElement.extend("HTMLElement", "hide", function() {
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
     * @memberof global.simpli
     * @instance
     */
    global.simpli.DOMElement.extend("HTMLElement", "fadeIn", function(pTimeout, pCallBefore, pCallAfter) {
        // default timeout is 3s
        var vTimeout = 300;
        if (!simpli.isType(pTimeout, simpli.INTEGER, simpli.OPTIONAL)) {
            throw new Error("Invalid timeout, it should be an integer");
        }
        if (!simpli.isType(pCallBefore, simpli.FUNCTION, simpli.OPTIONAL)) {
            throw new Error("Invalid before callback, it should be a function");
        }
        if (!simpli.isType(pCallAfter, simpli.FUNCTION, simpli.OPTIONAL)) {
            throw new Error("Invalid after callback, it should be a function");
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
     * @memberof global.simpli
     * @instance
     */
    global.simpli.DOMElement.extend("HTMLElement", "fadeOut", function(pTimeout, pCallBefore, pCallAfter) {
        // default timeout is 3s
        var vTimeout = 300;
        if (!simpli.isType(pTimeout, simpli.INTEGER, simpli.OPTIONAL)) {
            throw new Error("Invalid timeout, it should be an integer");
        }
        if (!simpli.isType(pCallBefore, simpli.FUNCTION, simpli.OPTIONAL)) {
            throw new Error("Invalid before callback, it should be a function");
        }
        if (!simpli.isType(pCallAfter, simpli.FUNCTION, simpli.OPTIONAL)) {
            throw new Error("Invalid after callback, it should be a function");
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
     * Add forEach() method to HTMLElement. It adds compatibility support to 
     * single HTMLElement<br />
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
     * @memberof global.simpli
     * @instance
     */
    global.simpli.DOMElement.extend("HTMLElement", "forEach", function(pCallback, pThisArg) {
        if (!simpli.isType(pCallback, simpli.FUNCTION)) {
        throw new Error("Invalid callback, it should be a function");
        }
        if (!simpli.isType(pThisArg, simpli.OBJECT, simpli.OPTIONAL)) {
        throw new Error("Invalid this context, it should be an object");
        }
        pCallback.call(pThisArg, this, 0 , this);

        return this;
    }, simpli.DOMElement.ELEMENT);
    /**
     * Add forEach() method to HTMLCollection. It can loop through the 
     * HTMLCollection and call the callback function to each of the
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
     * @memberof global.simpli
     * @instance
     */
    global.simpli.DOMElement.extend("HTMLCollection", "forEach", function(pCallback, pThisArg) {
        if (!simpli.isType(pCallback, simpli.FUNCTION)) {
        throw new Error("Invalid callback, it should be a function");
        }
        if (!simpli.isType(pThisArg, simpli.OBJECT, simpli.OPTIONAL)) {
        throw new Error("Invalid this context, it should be an object");
        }
        var vLen = this.length;
        if (simpli.isset(pThisArg)) {
            for (var i=0; i<vLen; i++) {
                pCallback.call(pThisArg, this[i], i , this);
            }
        } else {
            for (var i=0; i<vLen; i++) {
                pCallback.call(this[i], this[i], i , this);
            }
        }

        return this;
    }, simpli.DOMElement.ELEMENT);
    
    /**
     * Add getSelectedValue() method to HTMLSelectElement. It returns the user 
     * selected option's value<br />
     * Usage:
     * simpli({HTMLSelectElement}).getSelectedValue();
     *
     * @function getSelectedValue
     * @return {object}     this object
     * @memberof global.simpli
     * @instance
     */
    global.simpli.DOMElement.extend("SELECT", "getSelectedValue", function() {
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
     * @memberof global.simpli
     * @instance
     */
    global.simpli.DOMElement.extend("SELECT", "getSelectedOption", function() {
        return this.options[this.selectedIndex].text;
    });
})(this);