# Simpli.js
Simpli.js ia a library that features detail run-time function arguments check and provides basic data structure. It provides useful detail for debugging your program much much easier. Simpli.js extends the JavaScript standard built-in data type and introduces some data type that are common in other programming language but not in JavaScript.
  
## Index
* [Features](#features)
* [Installation](#installation)
* [Arguments Check Example](#arguments-check-example)
* [API](#api)
* [Arguments Check API](#arguments-check-api)
* [Data Type Hierarchy](#data-type-hierarchy)
* [Browser Support](#browser-support)
* [History](#history)
* [License](#license)

## Features
* Variable type checking
* Run-time Function Arguments checking
* Cross-Browser Compatibility (Support most of the modern browsers)
  
## Installation
1. Extract the src folder and its content to your site directory  
2. add the following code inside the ```<head>``` section of the webpage.  
``` html
<!-- The Simpli.js core file -->
<script src="js/simpli-1.2.0.min.js" />
<!-- Include this line if you need the basic data structure module -->
<script src="js/simpli-1.2.0.DataStructure.js" />
```

## Arguments Check Example
### Directory
1. [Simple arguments check](#1-simple-arguments-check)
2. [Optional argument with default value](#2-optional-argument-with-default-value)
3. [Repeatable argument](#3-repeatable-argument)
4. [Optional repetable argument](#4-optional-repetable-argument)
5. [Providing callback function](#5-providing-callback-function)
6. [Setting the mode](#6-setting-the-mode)
7. [Setting the error reporting mode](#7-setting-the-error-reporting-mode)

### 1. Simple arguments check  
There are two ways to invoke the function arguments check
``` javascript
function foo(bar, baz, flag) {
    // The first argument must be `arguments`
    simpli.argc(arguments, "string", "bool|int", "bool");

    // Argument check has passed, all arugments are valid
}

// this line is all right
foo("foo", 1, true);

// this line will raise a TypeError
foo("foo", 1, 1);
```
``` javascript
function foo(bar, baz, flag) {
    // Notice the argument signatures are put inside an array
    simpli.argc(arguments, ["string", "bool|int", "bool"]);

    // Argument check has passed, all arugments are valid
}
```
  
### 2. Optional argument (with default value)
Optional arguments can be specified by enclosing the data type with `[]`
``` javascript
function foo(message) {
    /* 
     * The first argument is optional, but if it is specified it must be 
     * integer
     */
    simpli.argc(arguments, "[string]");
    // if you wants to provide a default value, you can also do the following
    message = message || 'This is a default value';
}

function bar(baz, flag) {
    /*
     * Optional argument is not necessary to be the last argument because
     * strictly speaking Optional is just checking the argument with the type
     * `undefined`
     */
    simpli.argc(arguments, "[int]", "bool");
}
```
  
### 3. Repeatable argument
Sometimes you may want to specific repeatable argument that can be repeated any times. 
``` javascript
function foo() {
    simpli.argc(arguments, "int", "...string");
}
// the follow function invocation is correct
foo(6, "this is valid", "this is also valid", "how about one more?");
```
  
### 4. Optional repetable argument
The optional and repetable argument can be used together in a single signature. For example if `simpli.argc()` has to specific its signautre, it will look like this
``` javascript
var simpli.argc = function() {
    // The second arguemnt can either be `string` and `array`
    /* 
     * The third and consecutive argument is optional, but if it is specified 
     * it must be string
     */
    simpli.argc(arguments, "object", "string|array", "[...string]");
};
```
  
### 5. Providing callback function
``` javascript
function foo(bar) {
   simpli.argc(arguments, "int", function(argList) {
     // list all the invalid argument(s) to terminal
     argList.forEach(function(arg) {
        if (!arg.valid) {
           simpli.console().error(arg);
        }
     });
  });
}
```
  
### 6. Setting the mode
`simpli.argc()` has two modes, `STRICT` mode supports only JavaScript standard built-in data types and the wildcard `*`. In `EXTEND` mode (default) more data types are supported. For details please refer to the Data Type Hierarchy Section
``` javascript
simpli.argc.mode(simpli.argc.MODE_STRICT);
function foo() {
    /* 
     * This line will raise a TypeError because `int` is supported only in 
     * `EXTEND` mode
     */
    simpli.argc(arguments, "int");
}
simpli.argc.mode(simpli.argc.MODE_EXTEND);
```
  
### 7. Setting the error reporting mode
`simpli.argc()` has two error reporting modes, `SILENT` mode will only return boolean value upon successful arguments check. `ERROR` mode will raise TypeError if there is any invalid arguments
``` javascript
simpli.argc.errorMode(simpli.argc.ERRMODE_SILENT);
function foo() {
    simpli.argc(arguments, "int");
}
// this line will not raise a TypeError
foo("bar");
```
  
## API
A full API documentation can be found on [http://yuhlau.github.io/simplijs/1.2.0/doc/](http://yuhlau.github.io/simplijs/1.2.0/doc/). 
  
Moreover, you can also have a look to the unit test in the folder ```unitTest/``` or [Hosted Unit Test Page](http://yuhlau.github.io/simplijs/1.2.0/unitTest/). It can gives you some ideas on how those functions are used.  
  
## Arguments Check API
### simpli.argc(arguments, [...signature, callback])
| Argument | Data Type | Description |
|--------------|------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| arguments | Arguments object | The "arguments" object of the invoking function |
| ...signature | string | (Optional) The expected data type of each argument. Possible values depends on the mode. Under `STRICT` mode possible values include `*`, `array`, `null`, `object`, `number`, `boolean`, `bool`, `function` and `string`. Under `EXTEND` mode possible values include all values in `STRICT` mode plus  `mixed`, `integer`, `int`, `decimal`, `float`, `double`, `char`, `mixed[]`, `object[]`, `number[]`, `boolean[]`, `bool[]`, `string[]`, `integer[]`, `int[]`, `decimal[]`, `float[]`, `double[]`, `function[]` and `char[]`. Multiple expected types is also suppport by separating values with `|`, e.g. `int|string`. For detail hierarchy of the data type system in Simpli.js, you can read the [Data Type Hierarchy](#data-type-hierarchy) section in this page |
| callback | function | (Optional) The callback function when there is/are invalid argument(s). The callback function will be passed with a parameter with information of arguments and the reason of invalidity. Providing callback function does not mean `TypeError` will not be raised, but `simpli.argc()` will allow the callback function to finish (synchronously) before raising the `TypeError`. |

### simpli.argc(arguments, [signatures, callback])
| Argument | Data Type | Description |
|------------|------------------|---------------------------------------------------------------------|
| arguments | Arguments object | The "arguments" object of the invoking function |
| signatures | array | (Optional) The expected data type of each of the arguments put inside an array |
| callback | function | (Optional) The callback function when there is/are invalid argument(s) |
  
### Return Value
Returns true if all the arguments match with the signature provided, False otheriwise
  
### TypeError
If the error reporting mode is set to `STRICT` (default), a TypeError will be raised if there is/are any invalid argument
```
Uncaught TypeError: anonymous("foo", 1, -->1<--): Expected 'boolean', 'number' given in demo.js on line 3
```

### Callback Paramter Structure
``` javascript
{
    // array of arguments, not necessarily invalid argument
    arguments: [
        // an object which specifies the argument 
        {
            // whether the argument is valid
            invalid: true, 

            // the provided value
            value: 'bar', 

            // expected value in string format
            expected: "boolean, int[]", 

            // provided value
            given: "string", 

            /*
             * error message if the argument is invalid
             * Possible values:
             * simpli.argc.UNEXPECTED_DATATYPE
             * simpli.argc.MISMATCH_ARGNUMBER
             */
            error: "{UNEXPECTED_DATATYPE}"
        }, 
        // consecutive argument
        ...
    ], 
    // the error message
    message: "'Uncaught TypeError: anonymous("foo", 1, -->1<--): Expected 'boolean', 'number' given in demo.js on line 3", 

    // invoking function
    invokedBy: "foo", 

    // file name
    file: "demo.js", 

    // line number
    line: 3, 

    // line column
    column: 8
}
```
  
## Data Type Hierarchy
![Data Type Hierarchy Diagram](http://yuhlau.github.io/simplijs/1.2.0/datatype-hierarchy.png)  
* Strictly speaking, all JavaScript variable is `Object`. However, this definition of `Object` is too board and usually does not reflect most developer idea of `Object`. So in Simpli.js `Object` refers only to variable declared using object literal
* In JavaScript, all number are in 64bit floating point. It is impossible to distinguish betwen `Integer` and `Decimal` as other programming languages
* To be consistent with C-language, `Character Array` is not an array of `Character` but instead a `String`

## Browser Support
* Google Chrome (latest)
* Mozilla Firefox (latest)
* Apple Safari (latest)
* Microsoft Edge (latest)
* Internet Explorer (7+)
* Opera (latest)
* Android Browser (latest)
* Google Chrome on Android (latest)
* Apple Safari on iOS (latest)
* Google Chrome on iOS (latest)
  
## History
* 16 May, 2016. Version 1.2.0
  * Update to version 1.2.0 (1.1.0 skipped)
  * A complete redesign of Simpli.js
  * Redesign run-time argument checking
  * Remove DOM manipulation
  * Temporarily remove some data structures, and they will be added back in the future version
  * Update new unit test
  * Update document
* 20 Feb, 2016. Version 1.0.6
  * Redesign simpli.extend()
  * Add several simpli(...) method
* 7 Feb, 2016. Version 1.0.5
  * Update to version 1.0.5 (1.0.4 skipped)
  * Rename class to ucfirst name
  * Add simpli.BinaryTreeNode
  * Add simpli.BinaryTree
  * Add simpli.binarySearch()
  * Redesign simpli.istype to support typed array and object class
  * Redesign simpli.getClassName()
  * Redesign simpli.isObject()
  * Add primitive type check functions
  * Update unit test  
  
Detail version history can be found in HISTORY.md
  
## License
Copyright (c) Yu H.  
Published under The MIT License (MIT)
