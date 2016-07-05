QUnit.module("simpli.argv()");

// define ASCII integral type
var ASCII_TYPE = simpli.Type(function(arg) {
    // an arg is ASCII integral if it is a single character or it is
    // an integer within the range of 0..255
    return simpli.isChar(arg) || (0 <= arg && arg<=255);
});
var ASCII_NAMED_TYPE = simpli.Type("ASCII", function(arg) {
    // an arg is ASCII integral if it is a single character or it is
    // an integer within the range of 0..255
    return simpli.isChar(arg) || (0 <= arg && arg<=255);
});

QUnit.test("simpli.argv() format check", function(assert) {
    // simpli.argv() format check
    (function(foo) {
        assert.raises(function() {
                simpli.argv(["foo"], "int"); 
            }, 
            "TypeError: Expected argument 1 to be 'Arguments' object, "+
            "'string[1]' given", 
            "1st argument is not `arguments` object");
    })("foo");

    (function(foo) {
        var args = arguments;
        assert.raises(function() {
                simpli.argv(args, "[int]", "char"); 
            }, 
            "TypeError: Optional argument must appear at the end of the "+
            "declaration", 
            "Optional argument is not at the end of declaration");
    })(1, "foo");

    (function(foo) {
        var args = arguments;
        assert.raises(function() {
                simpli.argv(args, ASCII_TYPE.optional(), "char"); 
            }, 
            "TypeError: Optional argument must appear at the end of the "+
            "declaration", 
            "Custom type optional argument is not at the end of declaration");
    })(1, "foo");

    (function(foo, bar, baz) {
        var args = arguments;
        assert.raises(function() {
                simpli.argv(args, "string", "...int", "...string");
            }, 
            "TypeError: Only one variable-length argument is allowed in the "+
            "declaration", 
            "More than one variable-length argument");
    })("foo", 1, {});

    (function(foo, bar, baz) {
        var args = arguments;
        assert.raises(function() {
                simpli.argv(args, "string", "...int", ASCII_TYPE.repeatable());
            }, 
            "TypeError: Only one variable-length argument is allowed in the "+
            "declaration", 
            "More than one custom type variable-length argument");
    })("foo", 1, {});

    (function(foo, bar, baz, foobar, barbaz) {
        var args = arguments;
        assert.raises(function() {
                simpli.argv(args, ["string", "...int", "char"]);
            }, 
            "TypeError: Variable-length argument must be the last signature "+
            "of the declaration", 
            "Variable-length argument is not the last signature");
    })("foo", 1, 2, 3, "a");
    
    (function(foo) {
        var args = arguments;
        assert.raises(function() {
                simpli.argv(args, "foo"); 
            }, 
            /Expected signature to be one of the valid types, 'foo' given/,
            "Unrecognized string as signature");
    })("foo");

    (function(foo) {
        var args = arguments;
        assert.raises(function() {
                simpli.argv(args, {}); 
            }, 
            "TypeError: Expected argument 2 to be 'string', 'array' or "+
            "'simpli.Type', 'object' given", 
            "Non-string, array and simpli.Type as declaration");
    })("foo");
    
    (function(foo) {
        var args = arguments;
        assert.raises(function() {
                simpli.argv(args, [{}]); 
            }, 
            "TypeError: Expected signature to be 'string' or 'simpli.Type', "+
            "'object' given", 
            "Unrecognized object as signature");
    })("foo");
    // simpli.argv() format check - End
});

QUnit.test("simpli.argv() positive argument type check", function(assert) {
    // positive argument type check - Begin
    (function(foo) {
        assert.strictEqual(
            simpli.argv(arguments, ASCII_TYPE, ASCII_TYPE), 
            true, 
            "Arguments match the custom type");
    })('a', '125');

    (function(foo) {
        assert.strictEqual(
            simpli.argv(arguments, "*"), 
            true, 
            "`*` data type");
    })({});
    (function(foo) {
        assert.strictEqual(
            simpli.argv(arguments, "array"), 
            true, 
            "`array` data type");
    })([1,2,3]);
    (function(foo) {
        assert.strictEqual(
            simpli.argv(arguments, "mixed"), 
            true, 
            "`mixed` data type");
    })("foo");
    (function(foo) {
        assert.strictEqual(
            simpli.argv(arguments, "integer"), 
            true, 
            "`integer` data type");
    })(1);
    (function(foo) {
        assert.strictEqual(
            simpli.argv(arguments, "char"), 
            true, 
            "`char` data type");
    })("a");
    (function(foo) {
        assert.strictEqual(
            simpli.argv(arguments, "object[]"), 
            true, 
            "`object[]` data type");
    })([{},{}]);
    (function(foo) {
        assert.strictEqual(
            simpli.argv(arguments, "string[]"), 
            true, 
            "`string[]` data type");
    })(["foo","bar"]);
    (function(foo) {
        assert.strictEqual(
            simpli.argv(arguments, "int[3]"), 
            true, 
            "`int[3]` data type");
    })([1,2,3]);
    (function(foo) {
        assert.strictEqual(
            simpli.argv(arguments, ASCII_NAMED_TYPE.array()), 
            true, 
            "custom array data type");
    })([1,'a',255]);
    (function(foo) {
        assert.strictEqual(
            simpli.argv(arguments, ASCII_NAMED_TYPE.array(3)), 
            true, 
            "custom array data type with upper bound");
    })([1,'a',255]);

    (function(foo, bar, baz) {
        assert.strictEqual(
            simpli.argv(arguments, ["string", "object|int", "string|object"]), 
            true, 
            "more than one signature");
    })("foo", 1, {});
    
    (function(foo, bar, baz) {
        assert.strictEqual(
            simpli.argv(arguments, ["string", "...int"]), 
            true, 
            "Variable-length argument");
    })("foo", 1, 2);

    (function(foo, bar, baz) {
        assert.strictEqual(
            simpli.argv(arguments, ["string", ASCII_TYPE.repeatable()]), 
            true, 
            "Custom type variable-length argument");
    })("foo", 1, 2);
    
    (function(foo) {
        assert.strictEqual(
            simpli.argv(arguments, ["string", "[...int]"]), 
            true, 
            "Optional variable-length argument");
    })("foo");

    (function(foo) {
        assert.strictEqual(
            simpli.argv(arguments, ["string", ASCII_TYPE.optional().repeatable()]), 
            true, 
            "Custom type optional variable-length argument");
    })("foo");
    // positive argument type check - End
});

QUnit.test("simpli.argv() negative argument type check", function(assert) {
    // negative argument type check - Begin
    (function(foo) {
        var args = arguments;
        assert.raises(function() {
                simpli.argv(args, ASCII_TYPE);
            }, 
            /Expected '{simpli.Type}', 'string' given/, 
            "Argument do not match with custom type");
    })('apple');

    (function(foo) {
        var args = arguments;
        assert.raises(function() {
                simpli.argv(args, ASCII_NAMED_TYPE);
            }, 
            /Expected 'ASCII', 'string' given/, 
            "Argument do not match with named custom type");
    })('apple');

    (function(foo) {
        var args = arguments;
        assert.raises(function() {
                simpli.argv(args, "integer");
            }, 
            /Expected 'integer', 'object' given/, 
            "Argument does not match with signature");
    })({});

    (function(foo) {
        var args = arguments;
        assert.raises(function() {
                simpli.argv(args, "int[]");
            }, 
            /Expected 'int\[\]', 'string\[2\]' given/, 
            "Argument does not match with array signature");
    })(["foo","bar"]);

    (function(foo) {
        var args = arguments;
        assert.raises(function() {
                simpli.argv(args, ASCII_NAMED_TYPE.array());
            }, 
            /Expected 'ASCII\[\]', 'mixed\[3\]' given/, 
            "Argument does not match with custom array data type");
    })([1,'apple',256]);

    (function(foo) {
        var args = arguments;
        assert.raises(function() {
                simpli.argv(args, "int[3]");
            }, 
            /Expected 'int\[3\]', 'number\[6\]' given/, 
            "Array argument with size greater than upperbound specified in "+
            " singature");
    })([1,2,3,4,5,6]);

    (function(foo) {
        var args = arguments;
        assert.raises(function() {
                simpli.argv(args, ASCII_NAMED_TYPE.array(3));
            }, 
            /Expected 'ASCII\[3\]', 'mixed\[6\]' given/, 
            "Argument does not match with custom array data type");
    })([1,'a',2,'b',3,'c']);

    (function(foo, bar, baz) {
        var args = arguments;
        assert.raises(function() {
                simpli.argv(args, "int", "int", "int");
            }, 
            /Argument number mismatch: Expected 3 argument\(s\), 1 given/, 
            "Number of arguments does not match with declaration");
    })(1);
    
    (function(foo, bar, baz) {
        var args = arguments;
        assert.raises(function() {
                simpli.argv(args, "string", "...int");
            }, 
            /Expected 'int', 'object' given/, 
            "Argument does not match partially with variable-length argument "+
            "signature");
    })("foo", 1, {});
    
    (function(foo, bar) {
        var args = arguments;
        assert.raises(function() {
                simpli.argv(args, ["string", "[...int]"]);
            }, 
            /Expected 'int', 'object' given/, 
            "Argument does not match with option variable-length argument "+
            " signature");
    })("foo", {});
    
    (function(foo, bar, baz) {
        var args = arguments;
        assert.raises(function() {
                simpli.argv(args, ["string", "[...int]"]);
            }, 
            /Expected 'int', 'object' given/, 
            "Argument does not match partially with option variable-length "+
            " argument signature");
    })("foo", 1, {});
    // negative argument type check - End
});

QUnit.test("simpli.argv.mode and simpli.argv.errorMode", function(assert) {
    // simpli.argv.mode and simpli.argv.errorMode - Begin
    assert.raises(function() {
            simpli.argv.mode("{UNRECOGNIZED_MODE}");
        }, 
        /Unrecognized mode '{UNRECOGNIZED_MODE}'/, 
        "Setting unrecognized simpli.argv.mode"
    );

    simpli.argv.mode(simpli.argv.MODE_STRICT);
    (function(foo, bar, baz) {
        var args = arguments;
        assert.raises(function() {
                simpli.argv(args, "int");
            }, 
            /Extend data type are not supported in Strict mode/, 
            "Using Extend data type in Strict mode");
    })(1);
    simpli.argv.mode(simpli.argv.MODE_EXTEND);

    assert.raises(function() {
            simpli.argv.errorMode("{UNRECOGNIZED_ERRMODE}");
        }, 
        /Unrecognized error mode '{UNRECOGNIZED_ERRMODE}'/, 
        "Setting unrecognized simpli.argv.errorMode"
    );

    simpli.argv.errorMode(simpli.argv.ERRMODE_SILENT);
    (function(foo) {
        assert.strictEqual(simpli.argv(arguments, "int"), 
            true, 
            "Argument matches with signature in silent mode");
    })(1);

    (function(foo) {
        assert.strictEqual(simpli.argv(arguments, "char", function(arg) {
            console.dir(arg)
        }), 
            false, 
            "Argument does not match with signature in silent mode");
    })(1);
    simpli.argv.errorMode(simpli.argv.ERRMODE_ERROR);
    // simpli.argv.mode and simpli.argv.errorMode - End
});
