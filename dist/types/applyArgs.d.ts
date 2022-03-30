/**
 * Helper function to apply arguments to a selected function with type-inference for the supplied function.
 * For instance, in the following statement `applyArg(1).to((x) => x + 1)`, the type of `x` is correctly inferred to be `number`
 * @param args the argument list to be supplied... the argument list of the function supplied to the `to` clause (see below) should match this list
 * @returns an object with a single method, `.to(f)` where `f` is the function to which param `(...args)` will be passed.
 * The return type of this method will match the return type of `f`
 */
export declare const applyArgs: <A extends any[]>(...args: A) => To<A>;
interface To<A extends any[]> {
    <R>(f: (...args: A) => R): R;
    to<R>(f: (...args: A) => R): R;
}
export {};
