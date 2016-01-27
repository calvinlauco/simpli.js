"use strict";
/**
 * SimpliJS
 * A small library consists of some useful and shorthand function
 *
 * Copyright (c) 2016 Lau Yu Hei
 * 
 * @author Lau Yu Hei
 * @version 1.0.1
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
     * environment can be referred by Window
     */
    var _IE11Window = (typeof window !== "undefined")? window: global;

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
            if (simpli.getClass(pSelector) === "HTMLCollection" || 
                simpli.isArray(pSelector) || 
                (typeof pSelector.nodeType !== "undefined" && pSelector.nodeType === 1 && typeof pSelector.nodeName !== "undefined")) {
                vObject = pSelector;
            }
        } else {
            throw new Error("Invalid selector, it should be a string or DOM object");
        }

        // distinguish between HTMLCollection|Array and HTMLElement
        if (typeof vObject.length === "undefined" || (vObject.length === 1 && (vObject=vObject[0]))) {
            _bindings.HTMLElement.simplify(vObject);
            if (vObject.nodeName === "SELECT") {
                _bindings.HTMLSelectElement.simplify(vObject);
            }
        } else {
            _bindings.HTMLCollection.simplify(vObject);
        }
        
        return vObject;
    }

    simpli.STRING = "string";
    simpli.NUMBER = "number";
    simpli.BOOLEAN = "boolean";
    simpli.BOOL = "boolean";
    simpli.OBJECT = "object";
    simpli.FUNCTION = "function";
    simpli.INTEGER = "integer";
    simpli.INT = "integer";
    simpli.ARRAY = "array";
    // IE backward compatibility
    simpli.UNKNOWN = "unknown";

    simpli.REQUIRED = true;
    simpli.OPTIONAL = false;

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
        return varString.slice(8, -1);
    };

    /** 
     * Check if argument is set
     *
     * @param {mixed} pArg  the argument to be checked
     * @return {boolean}    whether the arugment is set
     * @memberof global.simpli
     */
    global.simpli.isset = function(pArg) {
        return (typeof pArg !== "undefined" && pArg !== null);
    };

    /**
     * Check if a variable's type is NaN
     *
     * isNaN() will return true when the variable is not a number but cannot
     * determine if the variable's type is NaN
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
     * @param {mixed} pArg                  the argument to check against
     * @param {string|string[]} pType       expected type of the arugment
     * @param {boolean} pRequired           (Optional) whether the 
     *                                      arguement is required, default
     *                                      is true
     * @return {boolean}                    whether the arugment matches 
     *                                      the type
     * @memberof global.simpli
     */
    global.simpli.isType = function(pVar, pType, pRequired) {
        // default value for required flag is true
        var vRequired = true;
        if (typeof pRequired !== "undefined") {
            if (typeof pRequired !== "boolean") {
                throw new Error("Invalid required flag, it should be a boolean");
            }
            vRequired = pRequired
        }
        /*
         * If the argument is optional, return true if the arugment is not
         * defined
         */
        if (!vRequired && (typeof pArg === "undefined" || pArg === null)) {
            return true;
        }

        var vTypeIsArray = simpli.isArray(pType), 
            vValid = false;
        if (typeof pType !== "string" && !vTypeIsArray) {
            throw new Error("Invalid type, it should be a string or array of string");
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
        } else {
            switch(pType) {
                case "string": 
                case "number": 
                case "boolean":  
                case "object": 
                case "function": 
                    return (typeof pVar === pType);
                    break;
                case "integer": 
                    return simpli.isInteger(pVar);
                    break;
                case "array": 
                    return simpli.isArray(pVar);
                    break;
                default:
                    throw new Error("Unrecognized type, it should be one of the valid data types");
            }
        }
        return false;
    };

    // DOM manipulation
    /**
     * _simplify Class
     * _simplify is an extension managment class that allows new additional
     * function to be hooked to a specific simpli element type
     * 
     * @class _simplify
     */
    var _simplify = function() {
        /**
         * bindedFunc is an Array of 2-keys Array. Instead of using a object
         * approach in storing name-function pair, Array of Array has better
         * performance in iteration
         *
         * @property {function[]}   a list of binded functions
         * @memberof _simplify#
         * @instance
         */
        var mBindedFunc = [];
        /** 
         * @property {function}    function to be executed before binding
         * @memberof _simplify#
         * @instance
         */
        var mExecBefore;
        /** 
         * @property {function}    function to be executed after binding
         * @memberof _simplify#
         * @instance
         */
        var mExecAfter;
        /**
         * Allows additional function to be binded to the element type
         * 
         * @function extend
         * @param {string} pName        the name of the additional function
         * @param {function} pFunction  the function body
         * @memberof _simplify
         * @instance
         */
        this.extend = function(pName, pFunction) {
            if (!simpli.isType(pName, simpli.STRING)) {
                throw new Error("Invalid name, it should be a string");
            }
            if (!simpli.isType(pFunction, simpli.FUNCTION)) {
                throw new Error("Invalid function, it should be a function");
            }
            mBindedFunc.push([pName, pFunction]);
        }
        /**
         * Simplify an object by binding those extended extnesions to the provided
         * object
         *
         * @function simplify
         * @param {object} pObject  the object to be simplified
         * @return {object}         the simplified object
         * @memberof _simplify
         * @instance
         */
        this.simplify = function(pObject) {
            if (simpli.isset(mExecBefore)) {
                pObject = mExecBefore(pObject);
            }
            for(var i=0, l=extension.length; i<l; i++) {
                pObject[extension[i][0]] = mBindedFunc[i][1];
            }
            if (simpli.isset(mExecAfter)) {
                pObject = mExecAfter(pObject);
            }
            return pObject;
        }
        /**
         * Callback function to be executed before simplify
         *
         * @function execBefore
         * @param {function} pCallback  function to be executed
         * @memberof _simplify
         * @instance
         */
        this.execBefore = function(pCallback) {
            if (!simpli.isType(pCallBack, simpli.FUNCTION)) {
                throw new Error("Invalid callback, it should be a function");
            }
            mExecBefore = pCallback;
        }
        /**
         * Callback function to be executed after simplify
         *
         * @function execAfter
         * @param {function} pCallback  function to be executed
         * @memberof _simplify
         * @instance
         */
        this.execAfter = function(pCallback) {
            if (!simpli.isType(pCallback, simpli.FUNCTION)) {
                throw new Error("Invalid callback, it should be a function");
            }
            mExecAfter = pCallback;
        }
    };

    // instantiate pre-defiend functions binding management modules
    var _bindings = {
        HTMLElement: new _simplify(), 
        HTMLSelectElement: new _simplify(), 
        HTMLCollection: new _simplify()
    };

    /**
     * Set the CSS display property to non-"none" value<br />
     * Usage:
     * simpli({HTMLElement}).show(...)
     *
     * @function show
     * @param {string} pValue   (Optional)any valid display value that is 
     *                          non-"none". Default value is "block"
     * @return {object}                 simpli object
     * @memberof global.simpli
     * @instance
     */
    _bindings.HTMLElement.extend("show", function(pValue) {
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
                    throw new Error("simpli(..).show(\"none\") is not supported. Please use simpli(..).hide() instead");                    default: 
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
     * @return {object}     simpli object
     * @memberof global.simpli
     * @instance
     */
    _bindings.HTMLElement.extend("hide", function() {
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
     * @return {object}     simpli object
     * @memberof global.simpli
     * @instance
     */
    _bindings.HTMLElement.extend("fadeIn", function(pTimeout, pCallBefore, pCallAfter) {
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
        this.css(["transition", "WebkitTransition", "MozTransition"], "opacity 0s");
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
     * @return {object}                 simpli object
     * @memberof global.simpli
     * @instance
     */
    _bindings.HTMLElement.extend("fadeOut", function(pTimeout, pCallBefore, pCallAfter) {
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
        this.css(["transition", "WebkitTransition", "MozTransition"], "opacity 0s");
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
     * Add getSelectedValue() method to HTMLSelectElement. It returns the user 
     * selected option's value<br />
     * Usage:
     * simpli({HTMLSelectElement}).getSelectedValue();
     *
     * @function getSelectedValue
     * @return {object}                 simpli object
     * @memberof global.simpli
     * @instance
     */
    _bindings.HTMLSelectElement.extend("getSelectedValue", function() {
        return this.options[this.selectedIndex].value;
    });

    /**
     * Add getSelectedOption() method to HTMLSelectElement. It returns the 
     * user selected option's text<br />
     * Usage:
     * simpli({HTMLSelectElement}).getSelectedOption();
     *
     * @function getSelectedOption
     * @return {object}                 simpli object
     * @memberof global.simpli
     * @instance
     */
    _bindings.HTMLSelectElement.extend("getSelectedOption", function() {
        return this.options[this.selectedIndex].text;
    });

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
     * @memberof global.simpli
     * @instance
     */
    _bindings.HTMLCollection.extend("forEach", function(pCallback, pThisArg) {
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
    });

    _bindings.HTMLCollection.execAfter(function(pObject) {
        pObject.forEach(function(currentElement, index, array) {
            pObject[index] = simpli(currentElement);
        })
        return pObject;
    });
})(this);