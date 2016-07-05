/**
 * simpli.js Data Structure module
 * Data Structure module for the simpli.js library
 *
 * Copyright (c) 2016 Yu H.
 * 
 * @author Yu H.
 * @version 1.2.0
 * @license The MIT License (MIT)
 * https://opensource.org/licenses/MIT
 **/

 (function() {
    "use strict";
    
    if (typeof simpli === "undefined") {
        throw new Error("simpli.js is not loaded properly");
    }
    var _Queue = {};
    _Queue.OPERATIONS_THRESHOLD = 100;
    _Queue.SIZE_THRESHOLD = 5;
    /**
     * simpli.Queue is a simple queue data structure
     * simpli.Queue is implemented using two pointers pointing to the front 
     * and the end of queue, this gurantees O(1) enqueue and dequeue 
     * operation. However, when many operations have been done on the Queue, 
     * the internal array structure will start to expand and there will be 
     * many useless index remained in the array. A simple re-indexing 
     * mechanism is introduced in dequeue() method.
     * 
     * @class Queue
     * @param {array} [data]    The initial data in array format
     * @memberof simpli
     */
    simpli.Queue = function(data) {
        simpli.argc(arguments, ['[array]']);

        var i, l;

        // make simpli.Queue() new-Agnostic
        if (!(this instanceof simpli.Queue)) {
            return new simpli.Queue(data);
        }
        this._struct = [];
        this._operations = 0;
        this._head = 0;
        this._tail = 0;
        if (simpli.isDefined(data)) {
            for (i=0,l=data.length; i<l; i++) {
                this.enqueue(data[i]);
            }
        }
    };
    simpli.Queue.prototype.size = function() {
        return (this._tail-this._head);
    }
    simpli.Queue.prototype.isEmpty = function() {
        return (this._tail === this._head);
    };
    simpli.Queue.prototype.enqueue = function(element) {
        simpli.argc(arguments, ["*"]);

        this._operations++;
        this._struct[this._tail++] = element;
    };
    simpli.Queue.prototype.dequeue = function() {
        var element, 
            i, l, newStruct;

        this._operations++;

        if (this.isEmpty()) {
            throw new TypeError("Tring to dequeue from an empty simpli.Queue");
        }
        element = this._struct[this._head];
        this._struct[this._head++] = null;
        /* 
         * If the queue has operations count more than the set threshold and 
         * the elements left in the queue is within a set threshold, re-index
         * the queue
         * This mechanism solves the space expansion problem but it will also
         * introduces worse Big-O in dequeue operation. There will be 1/100 
         * chance for the dequeue() to have a maximum O(_QUEUE.SIZE_THRESHOLD).
         * This Big-O will not be very bad because the _QUEUE.SIZE_THRESHOLD
         * should be set to a small value. However, theoretically, this still
         * makes the dequeue() to have O(_QUEUE.SIZE_THRESHOLD) instead of O(1)
         */
        l = this.size();
        if (this.isEmpty() ||
            (this._operations >= _Queue.OPERATIONS_THRESHOLD && 
            l <= _Queue.SIZE_THRESHOLD)) {

            /* 
             * Re-index by construting a new array because the old array is 
             * likely to have many residing index
             */
            newStruct = [];
            for (i=0; i<l; i++) {
                newStruct[i] = this._struct[this._head+i];
            }
            this._struct = newStruct;
            this._operations = 0;
            this._head = 0;
            this._tail = l;
        }
        return element;
    };
    simpli.Queue.prototype.front = function() {
        if (this.isEmpty()) {
            return null;
        }
        return this._struct[this._head];
    };
    simpli.Queue.prototype.toString = function() {
        return "[object simpli.Queue]";
    };

    /**
     * simpli.stack is a simple stack data structure
     *
     * @class Stack
     * @param {array} [data]    The initial data in array format
     * @memberof simpli
     */
    simpli.Stack = function(data) {
        simpli.argc(arguments, ['[array]']);

        var i, l;

        if(!(this instanceof simpli.Stack)) {
            return new simpli.Stack(data);
        }
        this._struct = [];
        this._top = 0;
        if (simpli.isDefined(data)) {
            for (i=0,l=data.length; i<l; i++) {
                this.enqueue(data[i]);
            }
        }
    };
    simpli.Stack.prototype.isEmpty = function() {
        return (this._top === 0);
    };
    simpli.Stack.prototype.push = function(element) {
        simpli.argc(arguments, ["*"]);

        this._struct[++this._top] = element;
    };
    simpli.Stack.prototype.pop = function() {
        var element;

        if (this.isEmpty()) {
            throw new TypeError("Tring to pop from an empty simpli.Stack");
        }
        element = this._struct[this._top];
        this._struct[this._top--] = null;
        return element;
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
 })(simpli);
