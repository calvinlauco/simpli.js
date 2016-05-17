/**
 * Simpli.js
 * A small library consists of some useful and shorthand function
 *
 * Copyright (c) 2016 Yu H.
 * 
 * @author Yu H.
 * @version 1.2.0
 * @license The MIT License (MIT)
 * https://opensource.org/licenses/MIT
 **/

if (typeof Object.create === "undefined") {
    Object.create = function(prototype) {
        function C() {}
        C.prototype = prototype;
        return new C();
    };
}

/*
 * String.nthIndexOf
 * @version 1.0.2
 */
if (typeof String.prototype.nthIndexOf === "undefined") {
    /**
     * The function returns the position of the nth occurrence of a search 
     * value in a string.
     *
     * @param {string} searchValue  The value to search for
     * @param {number} nthIndex     Which occurence to search for. If index 
     *                              is a negative number, it will perform
     *                              a backward search. All index starts at
     *                              1
     * @param {number} [start]      (Optional) At which position to start
     * @return {number}             Position where the search value of nth 
     *                              occurrence appears, -1 if it does not 
     *                              appears
     */
    String.prototype.nthIndexOf = function(searchValue, nthIndex, start) {
        var i, l, 
            tmp, position=[], posIndex=0, targetIndex;
        
        if (nthIndex === 0) {
            throw new TypeError("nthIndex cannot be 0 in "+
                "String.nthIndexOf(searchValue, nthIndex, start)");
        }
        // initialize the loop
        i=(typeof start === "undefined")? -1: start-1;
        l=this.length;
        /* 
         * loop throught the string using the string length as iteration 
         * condition
         */
        while(i<l) {
            /*
             * use indexOf with progressively increment i to search for 
             * substring occurence 
             */
            i = this.indexOf(searchValue, i+1);
            // position nthIndex reached
            if (posIndex+1 === nthIndex) {
                return i;
            }
            // no more occurence of the string found
            if (i === -1) {
                break;
            }
            // keep an array of position for negative nth index
            position[posIndex++] = i;
        }
        if (nthIndex < 0) {
            // calcuate the correct index for negative nth index
            targetIndex = posIndex + nthIndex;
            if (targetIndex >= 0) {
                return position[targetIndex];
            }
        }
        return -1;
    }
}

/*
 * JS StackTrace
 * @version 1.0.3
 * Generate a stack trace
 * @return {array|null}     Returns an array of stack trace, or null if the 
 *                          Stack Trace is in unrecognized format. 
 */
var getStackTrace = (function() {
    /**
     * This function wrap and return the console object according to the 
     * current environment support
     * 
     * @return {object}     The console object
     */
    var _console = function() {
        /*
         * console in Internet Explorer prior to 10 is undefined if the 
         * developer console is not opened
         */
        if (typeof console !== "undefined") {
            /*
             * console in Internet Explorer prior to 10 does not have 
             * console.debug
             */
            if (typeof console.debug === "undefined") {
                console.debug = console.log;
            }
            return console;
        } else {
            return {
                log: function(message) {}, 
                info: function(message) {}, 
                warn: function(message) {}, 
                error: function(message) {}, 
                debug: function(message) {}
            }
        }
    }
    // old IE browsers does not support String.trim()
    var _trimRegEx = new RegExp("^\\s+|\\s+$", "g");
    var getFNameFromFString = function(str) {
        var tmp = Object.toString.call(str), 
            calllerName;
        // remove anything before the function name
        tmp = tmp.slice(tmp.indexOf("function")+8);

        // get the function name without any space
        callerName = tmp.slice(0, tmp.indexOf("(")).replace(_trimRegEx, '');
        return (callerName.length === 0)? "anonymous": callerName;
    }
    /*
     * Possible stack format in Chrome, Opera, Internet Explorer:
     * "TypeError: Cannot set property 'baz' of undefined"
     * "   at getStackTrace (simpli.js:125:13)"
     * "   at basic.js:329:1"
     *
     * Possible stack format in Firefox:
     * "getStackTrace@simpli.js:125:13"
     * "@basic.js:329:1"
     */
    var _traceRegEx = new RegExp(
        "^(?:\\s*at\\s?(.*)\\s|(.*)@)" +
        "\\(?(.*):([1-9][0-9]*):([1-9][0-9]*)\\)?$");
    var getInfoFromStack = function(trace) {
        var groups = trace.match(_traceRegEx), 
            name;
        /*
         * Returns null if nothing matches
         */
        if (groups === null) {
            return null;
        }
        name = (typeof groups[1]==="undefined")? groups[2]: groups[1];
        return {
            invokedBy: (name==="")? "anonymous": name, 
            file: groups[3], 
            line: groups[4], 
            column: groups[5]
        };
    }
    return (function() {
        var stack, caller, traceInfo, 
            i, l, 
            stackTrace = [], 
            compatibility = true;
        try{
            var foo;
            foo.bar.baz = 1;
        }catch(e){
            if (typeof e.stack !== "undefined") {
                compatibility = false;
                stack = e.stack.split("\n");
                /*
                 * In non-Firefox browsers, the first stacktrace is the 
                 * TypeError message and does not match with the trace
                 * Regular Expression
                 */
                i = (stack[0].match(_traceRegEx) === null)? 2: 1;
                for(l=stack.length; i<l; i++) {
                    // In Firefox, the last stack is sometimes an empty string
                    if (stack[i].length === 0) {
                        break;
                    }
                    traceInfo = getInfoFromStack(stack[i]);
                    /*
                     * Stack Trace format is not a standard and there are 
                     * always inconsistency between browsers and unpredictable 
                     * future updates. In case the regular expression does not 
                     * match with the trace, fallback to compatibility mode
                     */
                    if (traceInfo === null) {
                        compatibility = true;
                        break;
                    }
                    /*
                     * In non-Firefox browsers, the first stacktrace is the 
                     * TypeError message
                     */
                    if (traceInfo.invokedBy === "getStackTrace") {
                        continue;
                    }
                    stackTrace.push(traceInfo);
                }
            } 
            if (compatibility) {
                // compatibility mode for old IE and Safari
                _console().error("[Warning] getStackTrace() running in "+
                    "compatibility mode");
                try {
                    caller = arguments.callee;
                } catch(e) {
                    // callee and caller are not allowed in strict mode
                    _console().error("[Warning] getStackTrace() "+
                        "compatibility mode cannot be run in strict mode");
                    return null;
                }
                // loop throught until caller is no longer defined
                while (caller.caller) {
                    caller = caller.caller;
                    stackTrace.push({
                        invokedBy: getFNameFromFString(caller), 
                        file: undefined, 
                        line: undefined, 
                        column: undefined
                    });
                }
            }
        }
        return stackTrace;
    });
})();

/**
 * @namespace simpli
 */
var simpli;
(function(global) {
    "use strict";
    /*
     * Object.toString function is changable. Keep a copy of the function
     * for future usage
     * Object.prototype.toString is a standard way to get the [object {Class}]
     * from a variable
     */
    var toString = Object.prototype.toString;
    /*
     * Object.hasOwnProperty function is changable. Keep a copy of the 
     * function for future usage
     */
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    /*
     * In Internet Explorer 11, "use strict" will create a different Window
     * object from the non-strict environment. The Window under non-strict
     * environment can be referred by variable window
     */
    var _IE11Window = (typeof window !== "undefined")? window: global;

    /**
     * simpli
     * simpli function will be implemented in future version and is now
     * only a dummy function
     */
    simpli = function() {
        // TODO: 
    };
    simpli.version = "1.2.0";
    
    /**
     * This function wrap and return the console object according to the 
     * current environment support
     * @return {object}     The console object
     * @memberof simpli
     */
    simpli.console = function() {
        /*
         * console in Internet Explorer prior to 10 is undefined if the 
         * developer console is not opened
         */
        if (simpli.isDefined(console)) {
            /*
             * console in Internet Explorer prior to 10 does not have 
             * console.debug
             */
            if (!simpli.isDefined(console.debug)) {
                console.debug = console.log;
            }
            return console;
        } else {
            return {
                log: function(message) {}, 
                info: function(message) {}, 
                warn: function(message) {}, 
                error: function(message) {}, 
                debug: function(message) {}
            }
        }
    }

    /**
     * Iterate all the own properties of an object and pass the property
     * name and value to the callback function provided
     * @param {object} obj          The object to be iterated
     * @param {function} callback   The callback function to call on each 
     *                              propert iterated
     * @memberof simpli
     */
    simpli.forEachProperty = function(obj, callback) {
        simpli.argc(arguments, ['object', 'function']);

        for (var property in obj) {
            if (hasOwnProperty.call(obj, property)) {
                callback.call(obj, property, obj[property]);
            }
        }
    }
    
    /**
     * Gives a more detail type of a variable
     * @param {mixed} arg   The variable
     * @return {string}     The detail type of the variable
     * @memberof simpli
     */
    simpli.detailTypeOf = function(arg) {
        var result, 
            i, l, lastType = "array";

        // check if the array is a typed-array
        if (simpli.isArray(arg)) {
            for (i=0,l=arg.length; i<l; i++) {
                if (lastType === "array") {
                    lastType = simpli.getClass(arg[i]);
                } else {
                    if (lastType !== simpli.getClass(arg[i])) {
                        // the array is mixed type
                        lastType = "mixed";
                    }
                }
            }
            result = lastType+"["+arg.length+"]";
        } else {
            result = simpli.getClass(arg);
        }
        return result.toLowerCase();
    }
    
    /**
     * Get the class name of an varaible
     * @param {mixed} arg   The variable
     * @return {string}     The class name of the variable
     * @memberof simpli
     */
    simpli.getClass = function(arg) {
        // identify the global object
        var argString = toString.call(arg);
        // compare to both global and IE11 window under non-strict mode
        if (arg === global || arg === _IE11Window) {
            return "Global";
        }
        // get the class name from the Object.prototype.toString
        return argString.slice(8, -1);
    };
    
    /**
     * Determine if a variable is an object of specified class
     * @param {object} arg                  the variable being evaluated
     * @param {string|function} classID     The class name or constructor
     * @return {boolean}                    Returns true if the variable is 
     *                                      the specified class, false 
     *                                      otherwise
     * @memberof simpli
     */
    simpli.isA = function(arg, classID) {
        // an class constructor is the same as a function
        if (!simpli.isString(classID) && !simpli.isFunction(classID)) {
            throw new TypeError("Expected argument 2 to be 'string' or "+
                "constructor, '"+simpli.detailTypeOf(className) + "' given");
        }
        return (simpli.isString(classID)? (simpli.getClass(arg) === classID): 
            (arg instanceof classID));
    };
    
    /**
     * Determine if a variable is an Arguments object
     * @param {object} arg          the variable being evaluated
     * @param {string} className    The class of the variable
     * @return {boolean}            Returns true if the variable is an 
     *                              Arguments , false otherwise
     * @memberof simpli
     */
    simpli.isArguments = function(arg) {
        return simpli.isA(arg, "Arguments") || 
            /*
             * In old Internet Explorere, Object.prototype.toString.call 
             * cannot give the name of the object. Instaed check for the 
             * existence of property "callee" because it is a unique 
             * property of Arguments
             */
            (!simpli.isA(arguments, "Arguments") && 
                simpli.isDefined(arg) && hasOwnProperty.call(arg, "callee"));
    };

    /**
     * Convert Arguments to array
     * @param {Arguments} args  The arguments object
     * @return {array}          The resulting array
     * @memberof simpli
     */
    simpli.argumentsToArray = function(args) {
        var i, l, result=[];
        for (i=0,l=args.length; i<l; i++) {
            result.push(args[i]);
        }
        return result;
    }
    
    /**
     * Determine if a variable is a mixed type
     * Practically every variable is a mixed type as long as it is not 
     * underfined.
     * @param {mixed} arg   The variable being evaluated
     * @return {boolean}    Returns true if the variable is a mixed type, 
     *                      false otherwise
     * @memberof simpli
     */
    simpli.isMixed = function(arg) {
        return (typeof arg !== "undefined");
    };
    
    /**
     * Determine if a variable is null
     * @param {mixed} arg   The variable being evaluated
     * @return {boolean}    Returns true if the variable is null, false 
     *                      otherwise
     * @memberof simpli
     */
    simpli.isNull = function(arg) {
        return (arg === null);
    };
    
    /**
     * Deterine if a variable is defined
     * If a variable has not been defined, it will return undefined when 
     * passed to typeof
     * simpli.isDefined() can only determine variable that is defined but not
     * yet initialized with a value. This is the restriction of JavaScript and
     * you cannot pass a undefined varaible as an argument to a function
     * @param {mixed} arg   The variable being evaluated
     * @return {boolean}    Returns true if arg has been defined, false 
     *                      otherwise
     * @memberof simpli
     */
    simpli.isDefined = function(arg) {
        return (typeof arg !== "undefined");
    };
    
    /**
     * Determine if a chain of propterties of a variable is all defined
     * In JavaScript a variable maybe a chain of properties, an simple example
     * would be foo.bar.baz. This funtion determine if all the properties in 
     * this chain are all well defined
     * @param {mixed} root              The root variable being evaluated
     * @param {...integer|string} prop  The remaining properties in the chain
     * @return {boolean}                Returns true if the whole chain of 
     *                                  object of variable has been defined, 
     *                                  false otherwise
     * @memberof simpli
     */
    simpli.isDeepDefined = function() {
        var len = arguments.length;
        var root, prop, i;
        if (len < 1) {
            throw new TypeError("Expected argument 1 to have at least  " + 
                "one object, none given");
        }

        root = arguments[0];
        for (i=1; i<len; i++) {
            prop = arguments[i];
            // TODO: if (simpli.isInteger() && simpli.isString())
        }
    };
    
    /**
     * Determine if a variable is set
     * A variable is set if it is deinfed and is not null
     * @param {mixed} arg   The variable being evaluated
     * @param {boolean}     Returns true if the variable is set, false 
     *                      otherwise
     * @memberof simpli
     */
    simpli.isSet = function(arg) {
        return (simpli.isDefined(arg) && !simpli.isNull(arg));
    }
    
    /**
     * Determine if a variable is NaN
     * @param {mixed} arg   The variable being evaluated
     * @param {boolean}     Returns true if the variable is Nan, false 
     *                      otherwise
     * @memberof simpli
     */
    simpli.isNaN = function(arg) {
        /*
         * a special property of NaN is that the NaN variable is not equal to
         * itself
         */
        return arg !== arg;
    };
    
    /**
     * Determine if a variable is an object
     * @param {mixed} arg           The variable being evaluated
     * @return {boolean}            Returns true if the variable is an object
     *                              of the class(if specified), false otherwise
     * @memberof simpli
     */
    simpli.isObject = function(arg) {
        // exclude null which gives object when applying typeof
        return (typeof arg === "object") && 
            !(simpli.isArray(arg)) && (arg !== null);
    };
    
    /**
     * Determinf if a variable is a number
     * @param {mixed} arg   The variable being evaluated
     * @return {boolean}    Returns true if the variable is a number, false 
     *                      otherwise
     * @memberof simpli
     */
    simpli.isNumber = function(arg) {
        return (typeof arg === "number");
    };
    
    /**
     * Determine if a variable is a function
     * @param {mixed} arg   The variable being evaluated
     * @return {boolean}    Returns true if the variable is a function, false
     *                      otherwise
     * @memberof simpli
     */
    simpli.isFunction = function(arg) {
        return (typeof arg === "function");
    };

    /**
     * Determine if a variable is a boolean
     * @param {mixed} arg   The variable being evaluated
     * @return {boolean}    Returns true if the variable is a boolean, false
     *                      otherwise
     * @memberof simpli
     */
    simpli.isBoolean = function(arg) {
        return (typeof arg === "boolean");
    };

    /**
     * Determine if a variable ia an array
     * @param {mixed} arg   The variable being evaluated
     * @return {boolean}    Returns true if the variable is an array, false
     *                      otherwise
     * @memberof simpli
     */
    simpli.isArray = function(arg) {
        // find the class of the object using ECMAScript standard
        // Object.prototype is not editable, so it is reliable
        var className = simpli.getClass(arg);
        if (className === "Array") {
            return true;
        // some old IE browsers will return [object Object] for Array
        } else if(simpli.getClass([]) !== "Array" && className === "Object") {
            // Fix for those old IE browsers
            /*
             * It is hard to have a robust array check for these browsers, 
             * instead an array-like check is performed
             */
            return simpli.isObject(arg) && simpli.isNumber(arg.length);
        } else {
            return false;
        }
    };

    /**
     * Determine if a variable is a string
     * @param {mixed} arg   The variable being evaluated
     * @return {boolean}    Returns true if the variable is a string, false
     *                      otherwise
     * @memberof simpli
     */
    simpli.isString = function(arg) {
        return (typeof arg === "string");
    };

    /**
     * Determine if a variable is an integer
     * @param {mixed} arg   The variable being evaluated
     * @return {boolean}    Returns true if the variable is an integer, false
     *                      otherwise
     * @memberof simpli
     */
    simpli.isInteger = function(arg) {
        /* 
         * false(boolean) and ""(string) will return as integer and returns 
         * true when applying % operator with argument 1
         */
        return simpli.isNumber(arg) && (arg%1 === 0);
    };
    
    /**
     * Determine if a variable is a decimal
     * If the two optional arguments are provided, the function can futher
     * checks the length of the whole number and decimal number part
     * @param {mixed} arg           The varaible being evaluated
     * @param {integer} [whole]     (Optional)The length of the whole number
     * @param {integer} [decimal]   (Optional)The length of the decimal number
     * @return {boolean}            Returns true if the variable is an decimal
     *                              number that satisfies the whole number and
     *                              decimal number requirement (if specifies), 
     *                              false otherwise
     * @memberof simpli
     */
    simpli.isDecimal = function(arg, whole, decimal) {
        var hasWhole = false,
            hasDecimal = false, 
            parts;
        if (!simpli.isNumber(arg)) {
            return false;
        }
        // convert arg to string by appending it to an empty string
        parts = (arg+'').split(".");
        if (simpli.isDefined(whole)) {
            hasWhole = true;
            if (!simpli.isInteger(whole)) {
                throw new TypeError("Expected argument 2 to be 'integer', '" +
                    simpli.detailTypeOf(whole)+"' given");
            }
        }
        /*
         * In JavaScript, numbers are always 64bit floating point. If the 
         * argument given is an integer, it is considered to be a decimal 
         * number and it always satisfies the decimal requirement because you
         * can append any number of 0s to the decimal part of an integer
         */
        if (simpli.isDefined(decimal) && parts.length === 2) {
            hasDecimal = true;
            if (!simpli.isInteger(decimal)) {
                throw new TypeError("Expected argument 3 to be 'integer', '" +
                    simpli.detailTypeOf(decimal)+"' given");
            }
        }
        if (hasWhole || hasDecimal) {
            return (hasWhole? (parts[0].length===whole): true) && 
                (hasDecimal? ((parts.length===2)?
                    parts[1].length === decimal: false): true);
        } else {
            /* 
             * if whole and decimal is not specified, any number is 
             * essentially a decimal
             */
            return true;
        }
    };
    
    /**
     * Determine if a variable is a character
     * @param {mixed} arg       The varaible being evulated
     * @param {integer} [size]  (Optional)The size of the array
     * @return {boolean}        Returns true if the variable is a character, 
     *                          false otherwise
     * @memberof simpli
     */
    simpli.isChar = function(arg) {
        return (simpli.isString(arg) && arg.length === 1);
    }
    
    /**
     * Determine if a variable is an object array
     * @param {mixed} arg           The varaible being evulated
     * @param {object} [classObj]   (Optional)The class constructor of the 
     *                              variable
     * @param {integer} [size]      (Optional)The size of the array
     * @return {boolean}            Returns true if the variable is an array 
     *                              containing only object of the class(if 
     *                              specified), false otherwise
     * @memberof simpli
     */
    simpli.isObjectArray = function(arg, size) {
        var i,l;

        if (!simpli.isArray(arg)) {
            return false;
        }
        l = arg.length;
        if (simpli.isDefined(size)) {
            if (!simpli.isInteger(size)) {
                throw new TypeError("Expected arugment 2 to be 'interger', '" +
                    simpli.detailTypeOf(size)+"' given");
            }
            if (l !== size) {
                return false;
            }
        }
        for (i=0; i<l; i++) {
            if (!simpli.isObject(arg[i])) {
                return false;
            }
        }
        return true;
    };
    
    /**
     * Determine if a variable is a number array
     * @param {mixed} arg       The varaible being evulated
     * @param {integer} [size]  (Optional)The size of the array
     * @return {boolean}        Returns true if the variable is an array 
     *                          containing only number, false otherwise
     * @memberof simpli
     */
    simpli.isNumberArray = function(arg, size) {
        var i,l;

        if (!simpli.isArray(arg)) {
            return false;
        }
        l = arg.length;
        if (simpli.isDefined(size)) {
            if (!simpli.isInteger(size)) {
                throw new TypeError("Expected arugment 2 to be 'interger', '" +
                    simpli.detailTypeOf(size)+"' given");
            }
            if (l !== size) {
                return false;
            }
        }
        for (i=0; i<l; i++) {
            if (!simpli.isNumber(arg[i])) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * Determine if a variable is a function array
     * @param {mixed} arg       The varaible being evulated
     * @param {integer} [size]  (Optional)The size of the array
     * @return {boolean}        Returns true if the variable is an array 
     *                          containing only function, false otherwise
     * @memberof simpli
     */
    simpli.isFunctionArray = function(arg, size) {
        var i,l;

        if (!simpli.isArray(arg)) {
            return false;
        }
        l = arg.length;
        if (simpli.isDefined(size)) {
            if (!simpli.isInteger(size)) {
                throw new TypeError("Expected arugment 2 to be 'interger', '" +
                    simpli.detailTypeOf(size)+"' given");
            }
            if (l !== size) {
                return false;
            }
        }
        for (i=0; i<l; i++) {
            if (!simpli.isFunction(arg[i])) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * Determine if a variable is a boolean array
     * @param {mixed} arg       The varaible being evulated
     * @param {integer} [size]  (Optional)The size of the array
     * @return {boolean}        Returns true if the variable is an array 
     *                          containing only boolean, false otherwise
     * @memberof simpli
     */
    simpli.isBooleanArray = function(arg, size) {
        var i,l;

        if (!simpli.isArray(arg)) {
            return false;
        }
        l = arg.length;
        if (simpli.isDefined(size)) {
            if (!simpli.isInteger(size)) {
                throw new TypeError("Expected arugment 2 to be 'interger', '" +
                    simpli.detailTypeOf(size)+"' given");
            }
            if (l !== size) {
                return false;
            }
        }
        for (i=0; i<l; i++) {
            if (!simpli.isBoolean(arg[i])) {
                return false;
            }
        }
        return true;
    }

    /**
     * Determine if a variable is an integer array
     * @param {mixed} arg       The varaible being evulated
     * @param {integer} [size]  (Optional)The size of the array
     * @return {boolean}        Returns true if the variable is an array 
     *                          containing only integer, false otherwise
     * @memberof simpli
     */
    simpli.isIntegerArray = function(arg, size) {
        var i,l;

        if (!simpli.isArray(arg)) {
            return false;
        }
        l = arg.length;
        if (simpli.isDefined(size)) {
            if (!simpli.isInteger(size)) {
                throw new TypeError("Expected arugment 2 to be 'interger', '" +
                    simpli.detailTypeOf(size)+"' given");
            }
            if (l !== size) {
                return false;
            }
        }
        for (i=0; i<l; i++) {
            if (!simpli.isInteger(arg[i])) {
                return false;
            }
        }
        return true;
    }

    /**
     * Alias of simpli.isNumberArray
     * @param {mixed} arg       The varaible being evulated
     * @param {integer} [size]  (Optional)The size of the array
     * @return {boolean}        Returns true if the variable is an array 
     *                          containing only decimal, false otherwise
     * @memberof simpli
     */
    simpli.isDecimalArray = simpli.isNumberArray;

    /**
     * Determine if a variable is a string array
     * @param {mixed} arg       The varaible being evulated
     * @param {integer} [size]  (Optional)The size of the array
     * @return {boolean}        Returns true if the variable is an array 
     *                          containing only string, false otherwise
     * @memberof simpli
     */
    simpli.isStringArray = function(arg, size) {
        var i,l;

        if (!simpli.isArray(arg)) {
            return false;
        }
        l = arg.length;
        if (simpli.isDefined(size)) {
            if (!simpli.isInteger(size)) {
                throw new TypeError("Expected arugment 2 to be 'interger', '" +
                    simpli.detailTypeOf(size)+"' given");
            }
            if (l !== size) {
                return false;
            }
        }
        for (i=0; i<l; i++) {
            if (!simpli.isString(arg[i])) {
                return false;
            }
        }
        return true;
    }
    
    var _argc = {};
    /**
     * Ddetermine if the argument is the data type specified
     * @param {string} dataType     The data type of the argument
     * @param {mixed} arg           The arg to be evaulated
     * @param {integer} [size]      (Optional)The size of the argument if it 
     *                              is an array
     * @return {boolean}            Returns true if the argument is the data
     *                              type specified, false otherwise
     * @throws {TypeError}
     * @ignore
     */
    _argc.isType = function(arg, dataType, size) {
        switch(dataType) {
            // JavaScript basic data type
            case "*": 
                return simpli.isMixed(arg);
            case "array":
                return simpli.isArray(arg);
            case "null": 
                return simpli.isNull(arg);
            case "object":
                return simpli.isObject(arg);
            case "number":
                return simpli.isNumber(arg);
            case "boolean":
            case "bool":
                return simpli.isBoolean(arg);
            case "function":
                return simpli.isFunction(arg);
            case "string":
                return simpli.isString(arg);
            default: 
                // Extend data type
                if (simpli.argc.mode() === simpli.argc.MODE_EXTEND) {
                    switch(dataType) {
                        case "mixed": 
                            return simpli.isMixed(arg);
                        case "integer":
                        case "int":
                            return simpli.isInteger(arg);
                        case "decimal": 
                        case "float":
                        case "double": 
                            return simpli.isDecimal(arg);
                        case "char":
                            return simpli.isChar(arg);
                        case "mixed[]": 
                            return simpli.isArray(arg, size);
                        case "object[]":
                            return simpli.isObjectArray(arg, size);
                        case "number[]": 
                            return simpli.isNumberArray(arg, size);
                        case "boolean[]": 
                        case "bool[]":
                            return simpli.isBooleanArray(arg, size);
                        case "string[]": 
                            return simpli.isStringArray(arg, size);
                        case "integer[]": 
                        case "int[]": 
                            return simpli.isIntegerArray(arg, size);
                        case "decimal[]": 
                        case "float[]": 
                        case "double[]": 
                            return simpli.isDecimalArray(arg, size);
                        case "function[]":
                            return simpli.isFunctionArray(arg, size);
                        case "char[]": 
                            if (simpli.isString(arg)) {
                                if (simpli.isDefined(size)) {
                                    return arg.length === size;
                                }
                            } else {
                                return false;
                            }
                    }
                } else {
                    throw new TypeError("Extend data type are not supported "+
                        "in Strict mode");
                }
        }
    }
    _argc.typeRegEx = new RegExp("^(\\*|array|null|" +
        "(mixed|object|number|boolean|bool|function|string|" +
        "integer|int|decimal|float|double|char)(?:\\[([1-9][0-9]*)?\\])?)$");
    /**
     * Determine if an argument satisfy the data type sepcified
     * This function is used only internally inside closure. It assumes
     * all the arguments are in the right format
     * @param {mixed} arg               The argument being evaluated
     * @param {string[]} dataTypeArray  The array of data types to evaluate the 
     *                                  argument
     * @param {boolean} optional        Whether the argument is optional
     * @ignore
     */
    _argc.checkArg = function(arg, dataTypeArray, optional) {
        var i, 
            dataTypeLen=dataTypeArray.length, dataTypeGroup, 
            dataTypeInstance, 
            dataType, size, 
            returnValue = false;
        
        /* 
         * if the argument is optional, check whether the argument is defined
         * first to reduce unnecessary data type check
         */
        if (optional && !simpli.isDefined(arg)) {
            returnValue = true;
        }
        for (i=0; i<dataTypeLen; i++) {
            dataTypeInstance = dataTypeArray[i];
            // check the validity of data type
            dataTypeGroup = dataTypeInstance.match(_argc.typeRegEx);
            if (dataTypeGroup === null) {
                // unrecognized data type
                throw new TypeError("Unrecognized data type '"+
                    dataTypeInstance+"'");
            }
            if (returnValue) {
                /*
                 * Even if the function is certained the argument is valid, 
                 * it will still go through all the iterations to make sure
                 * all the data types are valid
                 */
                continue;
            }
            /* 
             * The Regular Expression will match all the valid data type 
             * formats and gives different grouping result. The grouping of 
             * different data type are summarized here:
             * Test String: `array`
             * Match Informaiton: 
             * 1.   `array`
             *
             * Test String: `object`
             * Match Informaiton: 
             * 1.   `object`
             * 2.   `object`
             *
             * Test String: `object[]`
             * Match Information: 
             * 1.   `object[]`
             * 2.   `object`
             *
             * Test String: `object[15]`
             * Match Information: 
             * 1.   `object[15]`
             * 2.   `object`
             * 3.   `15`
             */
            // dataTypeGroup always has 1 matched string and 3 mathing groups
            /* 
             * In modern browsers, unmatched group will be undefined while in 
             * old Internet Explorer, unmatched group will have value ""
             */
            if (simpli.isDefined(dataTypeGroup[3]) && 
                dataTypeGroup[3] !== "") {

                // array with upper bound
                dataType = dataTypeGroup[2] + "[]";
                size = parseInt(dataTypeGroup[3]);
            } else {
                dataType = dataTypeGroup[1];
                size = undefined;
            }
            /*
             * _argc.isType() may throw TypeError if the data typ is not 
             * supported in the current mode
             */
            if (_argc.isType(arg, dataType, size)) {
                returnValue = true;
            }
        }
        return returnValue;
    }

    /**
     * Update the callback argument
     * @param {object} callbackArg
     * @param {integer} argI
     * @param {boolean} valid
     * @param {mixed} value
     * @param {string} [expected]
     * @param {string} [given]
     * @param {error} [error]
     * @ignore
     */
    _argc.setCallbackArg = function(callbackArg, argI, 
        valid, value, expected, given, error) {

        callbackArg.arguments[argI].valid = valid;
        callbackArg.arguments[argI].value = value;
        callbackArg.arguments[argI].expected = expected || '';
        callbackArg.arguments[argI].given = given || '';
        callbackArg.arguments[argI].error = error || '';
    };

    /**
     * Invalid argument handler for argument checker
     * @param {object} invalidArgument  The invalid argument
     * @param {string} invokedBy        The invoking function
     * @param {mixed} args              The list of arguments 
     * @param {integer} signLen         The length of signature
     * @param {boolean} repeatable      Whether there is repeatable arguments
     * @param {object} invalidObj       The object which contains a list of 
     *                                  argument
     * @param {function} callback       The callback fucntion
     * @throws {TypeError}
     * @ignore
     */
    _argc.invalidHandler = function(invalidArgument, 
            invokedBy, args, signLen, repeatable, 
            callback, callbackArg) {
            
        var message = "", 
            i, l, j, 
            invalidMessage, 
            index, 
            argMessage, argValue, 
            stackTrace, found, file, line, column;
        
        if (invalidArgument.type == simpli.argc.UNEXPECTED_DATATYPE) {
            invalidMessage = "Expected '"+invalidArgument.expected+"', '"+
                invalidArgument.given+"' given";
            index = invalidArgument.index;
        } else if (invalidArgument.type == simpli.argc.MISMATCH_ARGNUMBER) {
            invalidMessage = "Argument number mismatch, expected "+
                (repeatable? "at least ": "")+signLen+
                " arugment(s), "+args.length+" given";
            // set the index to -1 so no argument will be hightlighted
            index = -1;
        }
        
        // construct a list of argument
        i = 0;
        l = args.length;
        argMessage = "";
        while(i < l) {
            argValue = (simpli.isString(args[i]))? "\""+args[i]+"\"": 
                (simpli.isNumber(args[i]))? args[i]: 
                toString.call(args[i]); 
            // highlight the invalid argument
            argMessage += (i===invalidArgument.index)? 
                "-->"+argValue+"<--": argValue;

            if (++i < l) {
                argMessage += ", ";
            }
        }
        
        // get the function name
        stackTrace = getStackTrace();
        // check if Stack Trace is available
        if (!simpli.isNull(stackTrace)) {
            found = false;
            for (i=0,l=stackTrace.length; i<l; i++) {
                if (stackTrace[i].invokedBy === invokedBy || 
                    stackTrace[i].invokedBy === "Function."+invokedBy) {

                    found = true;
                    j = i+1;
                    file = stackTrace[j].file;
                    line = stackTrace[j].line;
                    column = stackTrace[j].column

                    message += invokedBy+"("+argMessage+"): "+invalidMessage+
                        " in "+file+
                        " on line "+line;

                    callbackArg.invokedBy = invokedBy;
                    callbackArg.file = file;
                    callbackArg.line = line;
                    callbackArg.column = column;
                    break;
                }
            }
        }
        /* 
         * In old Internet Explorer, function declared using 
         * var foo = function() {} cannot be correctly returned using
         * getStackTrace()
         */
        if (simpli.isNull(stackTrace) || !found) {
            message += invokedBy+"("+argMessage+"): "+invalidMessage;
        }

        callbackArg.message = message;
        // callback function handler
        if (simpli.isDefined(callback)) {
            callback.call(null, callbackArg);
        }
        if (simpli.argc.errorMode() === simpli.argc.ERRMODE_ERROR) {
            throw new TypeError(message);
        }
    }
    _argc.optionalRegEx = /^\[.+\]$/;
    _argc.MismatchArgNumber = function() {
        return {
            type: simpli.argc.MISMATCH_ARGNUMBER, 
            index: -1, 
            expected: "", 
            given: ""
        };
    };
    _argc.UnexpectedDataType = function(i, dataTypeArray, arg) {
        return {
            type: simpli.argc.UNEXPECTED_DATATYPE, 
            index: i, 
            expected: dataTypeArray.join(", "), 
            given: simpli.detailTypeOf(arg)
        }
    }

    /**
     * @namespace simpli.argc
     */      

    /**
     * Run-time arugment checking
     * @param {Arguments} args              The Arguments object
     * @param {array|string} signatures     The array of argument signatures, 
     *                                      or the signature of first argument
     * @param {...string} signatures        The second and consecutive 
     *                                      signature of argument (if the 
     *                                      second argument is not array)
     * @param {function} [callback]         The callback function if there 
     *                                      is/are any invalid arguments
     * @return {boolean}                    Returns true if all the arguments 
     *                                      matches
     * @memberof simpli
     */
    simpli.argc = function(args) {
        var thisArgs=simpli.argumentsToArray(arguments), 
            thisArgLen=thisArgs.length, 
            signatures, callback, 
            i, signI, argI, 
            invalidArg=null, invalidObj, callbackArg={
                arguments: [], 
                message: '', 
                invokedBy: '', 
                file: '', 
                line: '', 
                column: ''
            },  
            argLen, 
            signLen, signInstance, 
            optional, repeatable=false, repeatUntil,
            dataTypeArray, 
            stackTrace, stackTraceLen, found, invokedBy;

        if (!simpli.isArguments(args)) {
            throw new TypeError("Expects argument 1 to be 'Arguments' object"+
                ", '"+simpli.detailTypeOf(args)+"' given");
        }

        // check if callback function is specified
        if (simpli.isFunction(thisArgs[thisArgLen-1])) {
            callback = thisArgs[thisArgLen-1];
            // remove the last element
            thisArgs.pop();
            thisArgLen--;
        }

        if (thisArgs.length > 2 || 
            (thisArgs.length === 2 && simpli.isString(thisArgs[1]))) {

            // list of signature in arguments
            signatures = thisArgs;
            signatures.shift();
        } else {
            // list of signature in array
            signatures = thisArgs[1];

            if (simpli.isDefined(signatures) && 
                !simpli.isArray(signatures)) {

                throw new TypeError("Expects argument 2 to be 'array' or "+
                    "'string', '"+simpli.detailTypeOf(signatures)+ "' given");
            }
        }

        argLen = args.length;
        signLen = simpli.isDefined(signatures)? signatures.length: 0;
        // prepare the template for callback argument
        for(i=0; i<argLen; i++) {
            callbackArg.arguments.push({
                valid: true, 
                value: null, 
                expected: '', 
                given: '', 
                error: ''
            });
        }
        /* 
         * it is possible that argLen is not equal to signLen because some of 
         * the arguments may be optional
         */
        for(signI=0,argI=0; signI<signLen; signI++) {
            signInstance = signatures[signI];
            if (!simpli.isString(signInstance)) {
                throw new TypeError("Expects signature to be 'string', '"+
                    simpli.detailTypeOf(signInstance)+"' given");
            }
            // an argument is optional if the signature is surrounded by "[]"
            if (_argc.optionalRegEx.test(signInstance)) {
                optional = true;
                // remove the "[]"
                signInstance = signInstance.slice(1,-1);
            } else {
                optional = false;
                if (signI>argLen-1) {
                    /*
                     * The signature states that the argument is not optional 
                     * but there is no more argument provided
                     */
                    // only record the first invalid argument
                    if (simpli.isNull(invalidArg)) {
                        invalidArg.push(_argc.MismatchArgNumber());
                    }
                }
            }
            // check if the signature specifics repeatble argument
            if (signInstance.slice(0,3) === "...") {
                // repeatable argument can only appears once
                if (repeatable) {
                    throw new TypeError("There can only be one repeatable "+
                        "argument in a function");
                }
                // repeatable argument can appears in any signature position
                // calculate the index of the first non-repeatable argument
                repeatUntil = argLen-(signLen-signI-1);
                repeatable = true;
                // remove the "..."
                signInstance = signInstance.slice(3);
            }
            // check the validity of the data Type
            dataTypeArray = signInstance.split("|");
            if (argI < repeatUntil) {
                // check for repeatable argument
                while(argI < repeatUntil) {
                    if (!_argc.checkArg(args[argI], dataTypeArray, optional)) {
                        // incorrect data type
                        invalidObj = _argc.UnexpectedDataType(
                            argI, dataTypeArray, args[argI]);

                        // only record the first invalid argument
                        if (simpli.isNull(invalidArg)) {
                            invalidArg = invalidObj;
                        }
                        _argc.setCallbackArg(callbackArg, argI, false, args[argI], 
                            invalidObj.expected, invalidObj.given, invalidObj.type);
                    }
                    argI++;
                }
            } else {
                // check for single signature-argument pair
                /*
                 * Even if the function is certained that one of the argument 
                 * is invalid, it will loop through all the iterations to 
                 * identify any incorrect signature argument format
                 */
                if (_argc.checkArg(args[argI], dataTypeArray, optional)) {
                    // argument pass the check

                    /*
                     * If the argument is optional, the function has to check 
                     * whether the argument is provided. Only when it is 
                     * provided should the callback argument includes the 
                     * status of it
                     */
                    if (!optional || 
                        (optional && simpli.isDefined(args[argI]))) {

                        _argc.setCallbackArg(callbackArg, 
                            argI, true, args[argI]);
                    } 
                } else {
                    // incorrect data type
                    invalidObj = _argc.UnexpectedDataType(
                        argI, dataTypeArray, args[argI]);

                    // only record the first invalid argument
                    if (simpli.isNull(invalidArg)) {
                        invalidArg = invalidObj;
                    }
                    _argc.setCallbackArg(callbackArg, argI, false, args[argI], 
                        invalidObj.expected, invalidObj.given, 
                        invalidObj.type);
                }
                argI++;
            }
        }
        if (argI < argLen) {
            // arguments provided are more than the signatures provided
            /*
             * Since an argument may be optional, so it is possible that the
             * argument length is less than the signature length. And the
             * validity of optional arguments is the responsibility of the
             * optional argument routine
             */
            invalidObj = _argc.MismatchArgNumber();
            // only record the first invalid argument
            if (simpli.isNull(invalidArg)) {
                invalidArg = _argc.MismatchArgNumber();
            }
            // set all the ramaining argument to false
            for (i=argI; i<argLen; i++) {
                _argc.setCallbackArg(callbackArg, i, false, args[i], 
                    '', '', invalidObj.type);
            }
        }
        
        // process the invalid arugment (if any)
        if (simpli.isNull(invalidArg)) {
            // all arguements have passed the arugment signature check
            return true;
        } else {
            // find the function which inovke the arugment check
            stackTrace = getStackTrace();
            if (!simpli.isNull(stackTrace)) {
                found = false;
                stackTraceLen=stackTrace.length
                for (i=0; i<stackTraceLen; i++) {
                    if(stackTrace[i].invokedBy === "simpli.argc" || 
                        stackTrace[i].invokedBy === "Function.simpli.argc") {

                        found = true;
                        invokedBy = stackTrace[i+1].invokedBy;
                    }
                }
            }
            /* 
             * In old Internet Explorer, name of function declared using 
             * var foo = function() {} cannot be correctly returned using
             * getStackTrace()
             */
            if (simpli.isNull(stackTrace) || !found) {
                invokedBy = "function";
            }
            // only handle the first invalid argument
            _argc.invalidHandler(invalidArg, 
                invokedBy, args, signLen, repeatable, 
                callback, callbackArg);
            return false;
        }
    };

    /**
     * @property {string} simpli.argc.MODE_STRICT    Unexpected Datatype
     * @memberof simpli.argc
     */
    simpli.argc.UNEXPECTED_DATATYPE = "{UNEXPECTED_DATATYPE}";
    /**
     * @property {string} simpli.argc.MODE_STRICT    Mismatch argument number
     * @memberof simpli.argc
     */
    simpli.argc.MISMATCH_ARGNUMBER = "{MISMATCH_ARGNUMBER}";
    /**
     * @property {string} simpli.argc.MODE_STRICT    STRICT mode
     * @memberof simpli.argc
     */
    simpli.argc.MODE_STRICT = "{MODE_STRICT}";
    /**
     * @property {string} simpli.argc.MODE_EXTEND    EXTEND mode
     * @memberof simpli.argc
     */
    simpli.argc.MODE_EXTEND = "{MODE_EXTEND}";
    /**
     * Set argument check mode
     * The simpli.argc.mode() function sets the argument check mode at 
     * runtime. If the optional mode is not set, simpli.argc.mode() will just 
     * return the current argument check mode.
     * @param {string} [mode]   (Optional) argument check mode
     * @memberof simpli.argc
     */
    simpli.argc.mode = function(mode) {
        if (simpli.isDefined(mode)) {
            if (mode !== simpli.argc.MODE_STRICT && 
                mode !== simpli.argc.MODE_EXTEND) {

                throw new TypeError("Unrecognized mode '"+mode+"'");
            }
            _argc.mode = mode;
        }
        return _argc.mode;
    };
    /**
     * @property {string} simpli.argc.ERRMODE_ERROR     Error reporting mode
     * @property {string} simpli.argc.ERRMODE_SILENT    Silet reporting mode
     */
    simpli.argc.ERRMODE_ERROR = "{ERRMODE_ERROR}";
    simpli.argc.ERRMODE_SILENT = "{ERRMODE_SILENT}";
    /**
     * Set argument check error reporting mode
     * The simpli.argc.errorMode() function sets the argument check reporting
     * mode at runtime. If the optioanl errorMode is not set, 
     * simpli.argc.errorMode() will just return the current argument check 
     * error reporting mode.
     * @param {string} [errorMode]  (Optional) The error mode
     * @memberof simpli.argc
     */
    simpli.argc.errorMode = function(errorMode) {
        if (simpli.isDefined(errorMode)) {
            if (errorMode !== simpli.argc.ERRMODE_ERROR && 
                errorMode !== simpli.argc.ERRMODE_SILENT) {

                throw new TypeError("Unrecognized error mode '"+errorMode+"'");
            }
            _argc.errorMode = errorMode;
        }
        return _argc.errorMode;
    };

    simpli.argc.mode(simpli.argc.MODE_EXTEND);
    simpli.argc.errorMode(simpli.argc.ERRMODE_ERROR);
})(typeof window === "undefined"? global: window);
