export const toIterable = <T, TF extends () => IterableIterator<T>>(f: TF) => ({
  [Symbol.iterator]: f
})
