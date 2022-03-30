/**
 * Curry 1st parameter of a function
 * @param fn a function of form `(p0: P0, p1: P1, p2: P2) => R`
 * @returns a function of form `(p1: P1, p2: P2) => (p0: P0) => R`
 */
export const deferP0 =
    <P0, A extends any[], R>(fn: (src: P0, ...args: A) => R) =>
    (...args: A) =>
    (src: P0): R =>
        fn(src, ...args)
