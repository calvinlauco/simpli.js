# Simpli.js
Simpli.js is a JavaScript library that features run-time function arguments check and provides basic data structure. It provides useful detail for debugging your program much much easier. Simpli.js extends the JavaScript standard built-in data type and introduces some data type that are common in other programming language but not in JavaScript.
  
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
3. [Variable-length argument](#3-repeatable-argument)
4. [Optional repeatable argument](#4-optional-repeatable-argument)
5. [Providing callback function](#5-providing-callback-function)
6. [Setting the mode](#6-setting-the-mode)
7. [Setting the error reporting mode](#7-setting-the-error-reporting-mode)

### 1. Simple arguments check  
There are two ways to invoke the arguments check  
1) Provide argument declaration one-by-one as Parameters
``` javascript
function foo(bar, baz, flag) {
    // The first argument must be `arguments`
    simpli.argv(arguments, "string", "bool|int", "bool");

    // Argument check has passed, all arguments are valid
}

// this line is all right
foo("foo", 1, true);

// this line will raise a TypeError
foo("foo", 1, 1);
```
2) Provide argument declaration in Array format
``` javascript
function foo(bar, baz, flag) {
    // Notice the argument declaration are put inside an array
    simpli.argv(arguments, ["string", "bool|int", "bool"]);

    // Argument check has passed, all arguments are valid
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
    simpli.argv(arguments, "[string]");
    // if you wants to provide a default value, you can also do the following
    message = message || 'This is a default value';
}

function bar(baz, flag) {
    /*
     * Optional argument must appear at the end of declaration, following the 
     * C-language. The following declaration is invalid and will raise an 
     * TypeError
     */
    simpli.argv(arguments, "[int]", "bool");
}
```
  
### 3. Variable-length argument
Sometimes you may want to specific variable-length argument that can be repeated any number of times.  
  
Notice that variable-length argument must be the last signature in a declaration, following the C-language
``` javascript
function foo() {
    simpli.argv(arguments, "int", "...string");
}
// the follow function invocation is correct
foo(6, "this is valid", "this is also valid", "how about one more?");
```
  
### 4. Optional Variable-length argument
The optional and variable-length argument can be mixed together in a single signature. For example if the function`simpli.argv()` has to specific its signautre, it will look like this.  
  
Notice that the optional and variable-length argument is still subject to their own restriction, that is they should appear at the very last signature in the declaration
``` javascript
var simpli.argv = function() {
    // The second arguemnt can either be `string` and `array`
    /* 
     * The third and consecutive argument is optional, but if it is specified 
     * it must be string
     */
    simpli.argv(arguments, "object", "string|array", "[...string]");
};
```
  
### 5. Providing callback function
You can also provide a callback function to be called whenever there is any invalid argument or the number number of arguments mismatch with declaration. An argument is passed to the callback function with infromation regarding the argument check result.  
  
For the format of argument passed to the callback function, please refer to the [Callback Parameter Structure](#callback-parameter-structure) section
``` javascript
function foo(bar) {
   simpli.argv(arguments, "int", function(argList) {
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
`simpli.argv()` has two modes, `STRICT` mode supports only JavaScript standard built-in data types and the wildcard `*`. In `EXTEND` mode (default) more data types are supported. For details please refer to the [Data Type Hierarchy](#data-type-hierarchy) section
``` javascript
simpli.argv.mode(simpli.argv.MODE_STRICT);
function foo() {
    /* 
     * This line will raise a TypeError because `int` is supported only in 
     * `EXTEND` mode
     */
    simpli.argv(arguments, "int");
}
simpli.argv.mode(simpli.argv.MODE_EXTEND);
```
  
### 7. Setting the error reporting mode
`simpli.argv()` has two error reporting modes, `SILENT` mode will only return boolean value upon successful arguments check. `ERROR` mode will raise TypeError if there is/are any invalid arguments
``` javascript
simpli.argv.errorMode(simpli.argv.ERRMODE_SILENT);
function foo() {
    simpli.argv(arguments, "int");
}
// this line will not raise a TypeError
foo("bar");
```
  
## API
A full API documentation can be found on [http://yuhlau.github.io/simplijs/1.2.2/doc/](http://yuhlau.github.io/simplijs/1.2.2/doc/). 
  
Moreover, you can also have a look to the unit test in the folder ```unitTest/``` or hosted unit tet page ([Basic](http://yuhlau.github.io/simplijs/1.2.2/unitTest/basic.html)|[simpli.argv()](http://yuhlau.github.io/simplijs/1.2.2/unitTest/argv.html)). It can gives you some ideas on how those functions are used.  
  
## Arguments Check API
### simpli.argv(arguments, [...signature, callback])
| Argument | Data Type | Description |
|--------------|------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| arguments | Arguments object | The "arguments" object of the invoking function |
| ...signature | string | (Optional) The expected data type of each argument. Possible values depends on the mode. Under `STRICT` mode possible values include `*`, `array`, `null`, `object`, `number`, `boolean`, `bool`, `function` and `string`. Under `EXTEND` mode possible values include all values in `STRICT` mode plus  `mixed`, `integer`, `int`, `decimal`, `float`, `double`, `char`, `mixed[]`, `object[]`, `number[]`, `boolean[]`, `bool[]`, `string[]`, `integer[]`, `int[]`, `decimal[]`, `float[]`, `double[]`, `function[]` and `char[]`. Multiple expected types is also suppport by separating values with `|`, e.g. `int|string`. For detail hierarchy of the data type system in Simpli.js, you can read the [Data Type Hierarchy](#data-type-hierarchy) section in this page |
| callback | function | (Optional) The callback function when there is/are invalid argument(s). The callback function will be passed with a parameter with information of arguments and the reason of invalidity. Providing callback function does not mean `TypeError` will not be raised, but `simpli.argv()` will allow the callback function to finish (synchronously) before raising the `TypeError`. |

### simpli.argv(arguments, [signatures, callback])
| Argument | Data Type | Description |
|------------|------------------|---------------------------------------------------------------------|
| arguments | Arguments object | The "arguments" object of the invoking function |
| signatures | array | (Optional) The expected data type of each of the arguments put inside an array |
| callback | function | (Optional) The callback function when there is/are invalid argument(s) |
  
### Return Value
Returns true if all the arguments match with the signature provided, false otheriwise
  
### TypeError
If the error reporting mode is set to `STRICT` (default), a TypeError will be raised if there is/are any invalid argument
```
Uncaught TypeError: anonymous("foo", 1, -->1<--): Expected 'boolean', 'number' given in demo.js on line 3
```

### Callback Parameter Structure
``` javascript
{
    // array of arguments passed to the function
    arguments: [
        // an object which specifies the arguments
        {
            // the index of the argument, starting from 0
            index: 0, 

            // the provided value
            value: "bar", 

            // expected value in string format
            expected: "boolean, int[]", 

            // provided value
            given: "string"
        }, 
        // rest of the arguments
        ...
    ], 

    // information of the invalid argument
    error: {
        // the index of the argument, starting from 0
        index: 0, 

        // the provided value
        value: "bar", 

        // expected value in string format
        expected: "boolean, int[]", 

        // provided value
        given: "string", 

        /*
         * The error code
         * Possible values:
         * simpli.argv.UNEXPECTED_DATATYPE
         * simpli.argv.MISMATCH_ARGNUMBER
         */
        code: "{UNEXPECTED_DATATYPE}", 

        // the error message
        message: "Expected 'boolean, int[]', 'string' given"
    }

    // the invoking function
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
* 1 Jul, 2016. Version 1.2.2
  * Rename simpli.argv() to simpli.argv()
  * Introduce custom data type simpli.Type (experimental)
  * Variable-length argument must now be the last signature in the declaration
  * Option argument must now appear at the end of the declaration
  * 2nd argument of simpli.isDecimal() is changed back to exact match
  * Update new unit test
  * Update document
* Version 1.2.1 (Internal)
  * 2nd and 3rd arguments of simpli.isDecimal() now become an inclusive upper bound (in previous version it is an exact match)
* 16 May, 2016. Version 1.2.0
  * Update to version 1.2.0 (1.1.0 skipped)
  * A complete redesign of Simpli.js
  * Redesign run-time argument checking
  * Remove DOM manipulation
  * Temporarily remove some data structures, and they will be added back in the future version
  * Update new unit test
  * Update document
  
Detail version history can be found in HISTORY.md
  
## License
Copyright (c) Yu H.  
Published under The MIT License (MIT)
