type Tail<T extends readonly unknown[]> = T extends readonly [unknown, ...infer R] ? R : []

type HeadAsTuple<T extends readonly unknown[]> = T extends [unknown, ...infer RestTup]
    ? T extends [...infer HeadTup, ...RestTup]
        ? HeadTup
        : never
    : []

/**
 * Curry 1st parameter of a function
 * @param fn a function of form `(p0: P0, p1: P1, p2: P2) => R`
 * @returns a function of form `(p1: P1, p2: P2) => (p0: P0) => R`
 */
export const deferP0 =
    <A extends readonly unknown[], R>(fn: (...args: A) => R) =>
    (...args: Tail<A>) =>
    (...src: HeadAsTuple<A>): R => {
        return (fn as any).apply(undefined, src.concat(args) as unknown as A)
        //return fn(...(src.concat(args) as unknown as A))
    }
