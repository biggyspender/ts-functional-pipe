export const deferP0 = <P0, A extends any[], R>(fn: (a: P0, ...args: A) => R) => (...args: A) => (
  a: P0
): R => fn(a, ...args)
