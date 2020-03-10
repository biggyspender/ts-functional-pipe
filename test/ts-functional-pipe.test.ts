import { pipe, deferP0, applyArgs } from '../src/ts-functional-pipe'
import { toIterable } from './toIterable'

const _map = <T, TOut>(src: Iterable<T>, selector: (v: T, i: number) => TOut): Iterable<TOut> =>
  toIterable(function* () {
    let c = 0
    for (const v of src) {
      yield selector(v, c++)
    }
  })

const _filter = <T>(src: Iterable<T>, pred: (v: T, i: number) => boolean): Iterable<T> =>
  toIterable(function* () {
    let i = 0
    for (const x of src) {
      if (pred(x, i++)) {
        yield x
      }
    }
  })

const map = deferP0(_map)
const filter = deferP0(_filter)
const toArray = <T>(v: Iterable<T>) => [...v]

describe('ts-functional-pipe', () => {
  const p = pipe(map((x: number) => (x * 2).toString()))
  it('pipes', () => {
    expect([...p([1, 2, 3])]).toEqual(['2', '4', '6'])

    expect([...applyArgs([1, 2, 3]).to(p)]).toEqual(['2', '4', '6'])

    const mulStrPipe = pipe(map((x: number) => (x * 2).toString()))

    expect([...applyArgs([1, 2, 3]).to(mulStrPipe)]).toEqual(['2', '4', '6'])
    expect([...applyArgs([1, 2, 3]).to(filter((x) => x % 2 === 1))]).toEqual([1, 3])
    const dinosaurify = (name: string) => `${name}-o-saurus`
    const sayHello = (name: string) => `Hello, ${name}!`
    const sayHelloToDinosaur = pipe(dinosaurify, sayHello)
    expect(sayHelloToDinosaur('mike')).toBe('Hello, mike-o-saurus!')
    const oddMultipliedByTwo = pipe(
      filter((x: number) => x % 2 === 1),
      map((x) => x * 2)
    )
    const q = oddMultipliedByTwo([1, 2, 3])
    expect([...q]).toEqual([2, 6])
    expect([...q]).toEqual([2, 6])

    expect(applyArgs('chris').to(pipe(dinosaurify, sayHello))).toBe('Hello, chris-o-saurus!')

    const pipedFuncs = pipe(
      filter((x: number) => x % 2 === 0),
      map((x) => '$' + x),
      toArray
    )
    expect(pipedFuncs([1, 2, 3, 4])).toEqual(['$2', '$4'])

    const transformed = applyArgs([1, 2, 3]).to(
      pipe(
        filter((x) => x % 2 === 1), // x is inferred as number
        map((x) => x * 2) // x is inferred as number
      )
    ) // iterable with values [2, 6]
    expect([...transformed]).toEqual([2, 6])
  })
})
