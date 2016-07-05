QUnit.module("simpli.argc()");
QUnit.test("simpli.argc()", function(assert) {
    (function(foo) {
        assert.strictEqual(
            simpli.argc(arguments, ["*"]), 
            true, 
            "simpli.argc() with `*` data type");
    })({});
    (function(foo) {
        assert.strictEqual(
            simpli.argc(arguments, ["array"]), 
            true, 
            "simpli.argc() with `array` data type");
    })([1,2,3]);
    (function(foo) {
        assert.strictEqual(
            simpli.argc(arguments, ["mixed"]), 
            true, 
            "simpli.argc() with `mixed` data type");
    })("foo");
    (function(foo) {
        assert.strictEqual(
            simpli.argc(arguments, ["integer"]), 
            true, 
            "simpli.argc() with `integer` data type");
    })(1);
    (function(foo) {
        assert.strictEqual(
            simpli.argc(arguments, ["char"]), 
            true, 
            "simpli.argc() with `char` data type");
    })("a");
    (function(foo) {
        assert.strictEqual(
            simpli.argc(arguments, ["object[]"]), 
            true, 
            "simpli.argc() with `object[]` data type");
    })([{},{}]);
    (function(foo) {
        assert.strictEqual(
            simpli.argc(arguments, ["string[]"]), 
            true, 
            "simpli.argc() with `string[]` data type");
    })(["foo","bar"]);
    (function(foo) {
        assert.strictEqual(
            simpli.argc(arguments, ["int[3]"]), 
            true, 
            "simpli.argc() with `int[3]` data type");
    })([1,2,3]);

    (function(foo, bar, baz) {
        assert.strictEqual(
            simpli.argc(arguments, ["string", "object|int", "string|object"]), 
            true, 
            "should return `true` if all the arguments match with signatures");
    })("foo", 1, {});
    
    (function(foo, bar, baz) {
        assert.strictEqual(
            simpli.argc(arguments, ["string", "...int"]), 
            true, 
            "should return `true` if all the arguments match with signatures "+
            "including repeatable ");
    })("foo", 1, 2);
    
    (function(foo) {
        assert.strictEqual(
            simpli.argc(arguments, ["string", "[...int]"]), 
            true, 
            "should return `true` if all the arguments match with signatures "+
            "including option repeatable ");
    })("foo");
    (function(foo, bar, baz, foobar, barbaz) {
        assert.strictEqual(
            simpli.argc(arguments, ["string", "...int", "char"]), 
            true, 
            "should return `true` if all the arguments match with signatures "+
            "including repeatable ");
    })("foo", 1, 2, 3, "a");
    
    
    (function(foo) {
        var args = arguments;
        assert.raises(function() {
                simpli.argc(args, ["integer"]);
            }, 
            /Expected 'integer', 'object' given/, 
            "should return `false` it the argument does not match with the "+
            "signature");
    })({});
    (function(foo) {
        var args = arguments;
        assert.raises(function() {
                simpli.argc(args, ["int[]"]);
            }, 
            /Expected 'int\[\]', 'string\[2\]' given/, 
            "should return `false` it the argument does not match with the "+
            "signature");
    })(["foo","bar"]);
    (function(foo) {
        var args = arguments;
        assert.raises(function() {
                simpli.argc(args, ["int[3]"]);
            }, 
            "should return `false` it the argument size is larger than the "+
            "array bound");
    })([1,2,3,4,5,6]);
    
    (function(foo) {
        assert.raises(function() {
                simpli.argc(["foo"], ["foo"]); 
            }, 
            "TypeError: Expects argument 1 to be 'Arguments' object, "+
            "'string[1]' given", 
            "should raised TypeError if 1st arguments is not `Arguments` object");
    })("foo");
    
    (function(foo) {
        var args = arguments;
        assert.raises(function() {
                simpli.argc(args, "foo"); 
            }, 
            "TypeError: Unrecognized data type 'foo'",
            "should raised TypeError if 2nd arguments is \"foo\"");
    })("foo");
    
    (function(foo) {
        var args = arguments;
        assert.raises(function() {
                simpli.argc(args, [{}]); 
            }, 
            "TypeError: Expects signature to be 'string', 'object' given", 
            "should raised TypeError if signature is `object`");
    })("foo");
    
    (function(foo) {
        var args = arguments;
        assert.raises(function() {
                simpli.argc(args, ["foo"]); 
            }, 
            "TypeError: Unrecognized data type 'foo'", 
            "should raised TypeError if data type is \"foo\"");
    })("foo");
    
    (function(foo, bar, baz) {
        var args = arguments;
        assert.raises(function() {
                simpli.argc(args, ["string", "...int"]);
            }, 
            /Expected 'int', 'object' given/, 
            "should raised TypeError if repeatable arguments does not match "+
            "with signature");
    })("foo", 1, {});
    
    (function(foo, bar) {
        var args = arguments;
        assert.raises(function() {
                simpli.argc(args, ["string", "[...int]"]);
            }, 
            /Expected 'int', 'object' given/, 
            "should raised TypeError if optional repeatable arguments does "+
            "not match with signature");
    })("foo", {});
    
    (function(foo, bar, baz) {
        var args = arguments;
        assert.raises(function() {
                simpli.argc(args, ["string", "[...int]"]);
            }, 
            /Expected 'int', 'object' given/, 
            "should raised TypeError if optional repeatable arguments does "+
            "not match with signature");
    })("foo", 1, {});
    
    (function(foo, bar, baz) {
        var args = arguments;
        assert.raises(function() {
                simpli.argc(args, ["string", "...int", "...string"]);
            }, 
            /There can only be one repeatable argument in a function/, 
            "should raised TypeError if more than one repeatable arguments");
    })("foo", 1, {});
});