(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib')) :
    typeof define === 'function' && define.amd ? define(['exports', 'tslib'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.tsFunctionalPipe = {}, global.tslib));
})(this, (function (exports, tslib) { 'use strict';

    /**
     * Curry 1st parameter of a function
     * @param fn a function of form `(p0: P0, p1: P1, p2: P2) => R`
     * @returns a function of form `(p1: P1, p2: P2) => (p0: P0) => R`
     */
    var deferP0 = function (fn) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return function () {
                var src = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    src[_i] = arguments[_i];
                }
                return fn.apply(void 0, tslib.__spreadArray([], tslib.__read(src.concat(args)), false));
            };
        };
    };

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
        var f = (function (fun) { return fun.apply(void 0, tslib.__spreadArray([], tslib.__read(args), false)); });
        f.to = f;
        return f;
    };

    function pipeImpl() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = tslib.__read(args), o1 = _a[0], operations = _a.slice(1);
        return function () {
            var argsP = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                argsP[_i] = arguments[_i];
            }
            return operations.reduce(function (acc, f) { return f(acc); }, o1.apply(void 0, tslib.__spreadArray([], tslib.__read(argsP), false)));
        };
    }

    function compose() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var o1 = args[args.length - 1];
        var operations = args.slice(0, -1).reverse();
        return pipeImpl.apply(void 0, tslib.__spreadArray([o1], tslib.__read(operations), false));
    }

    function pipe(o1) {
        var operations = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            operations[_i - 1] = arguments[_i];
        }
        return pipeImpl.apply(void 0, tslib.__spreadArray([o1], tslib.__read(operations), false));
    }

    function pipeInto(src, o1) {
        var operations = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            operations[_i - 2] = arguments[_i];
        }
        return applyArgs(src).to(pipeImpl.apply(void 0, tslib.__spreadArray([o1], tslib.__read(operations), false)));
    }

    exports.applyArgs = applyArgs;
    exports.compose = compose;
    exports.deferP0 = deferP0;
    exports.pipe = pipe;
    exports.pipeInto = pipeInto;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ts-functional-pipe.umd.js.map
