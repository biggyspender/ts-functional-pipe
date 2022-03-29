import { __spreadArray, __read } from 'tslib';

/**
 * Curry 1st parameter of a function
 * @param fn a function of form `(p0: P0, p1: P1, p2: P2) => R`
 * @returns a function of form `(p1: P1, p2: P2) => (p0: P0) => R`
 */
var deferP0 = function (fn) { return function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return function (src) { return fn.apply(void 0, __spreadArray([src], __read(args), false)); };
}; };

/**
 * Helper function to apply arguments to a selected function with type-inference for the supplied function.
 * For instance, in the following statement `applyArg(1).to((x) => x + 1)`, the type of `x` is correctly inferred to be `number`
 * @param args the argument list to be supplied... the argument list of the function supplied to the `to` clause (see below) should match this list
 * @returns an object with a single method, `.to(f)` where `f` is the function to which param `(...args)` will be passed.
 * The return type of this method will match the return type of `f`
 */
var applyArgs = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var f = (function (f) { return f.apply(void 0, __spreadArray([], __read(args), false)); });
    f.to = f;
    return f;
};

function pipeImpl() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var _a = __read(args), o1 = _a[0], operations = _a.slice(1);
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return operations.reduce(function (acc, f) { return f(acc); }, o1.apply(void 0, __spreadArray([], __read(args), false)));
    };
}

function compose() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var o1 = args[args.length - 1];
    var operations = args.slice(0, -1).reverse();
    return pipeImpl.apply(void 0, __spreadArray([o1], __read(operations), false));
}

function pipe(o1) {
    var operations = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        operations[_i - 1] = arguments[_i];
    }
    return pipeImpl.apply(void 0, __spreadArray([o1], __read(operations), false));
}

function pipeInto(src, o1) {
    var operations = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        operations[_i - 2] = arguments[_i];
    }
    return applyArgs(src).to(pipeImpl.apply(void 0, __spreadArray([o1], __read(operations), false)));
}

export { applyArgs, compose, deferP0, pipe, pipeInto };
//# sourceMappingURL=ts-functional-pipe.es5.js.map
