export const deferP0 = <P0, A extends any[], R>(fn: (src: P0, ...args: A) => R) => (...args: A) => (
  src: P0
): R => fn(src, ...args)
