import { pipe, typedPipe, pipeValue, pp, compose, typedCompose } from '../src/ts-functional-pipe'
import { toIterable } from './toIterable'
import { deferP0 } from '../src/deferP0'

const _map = <T, TOut>(src: Iterable<T>, selector: (v: T, i: number) => TOut): Iterable<TOut> =>
  toIterable(function*() {
    let c = 0
    for (const v of src) {
      yield selector(v, c++)
    }
  })

const _filter = <T>(src: Iterable<T>, pred: (v: T, i: number) => boolean): Iterable<T> =>
  toIterable(function*() {
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
  const tp = typedCompose<Iterable<number>>()
  const p = tp(map(x => (x * 2).toString()))
  it('pipes', () => {
    expect([...p([1, 2, 3])]).toEqual(['2', '4', '6'])

    expect([...pipeValue([1, 2, 3]).into(p)]).toEqual(['2', '4', '6'])

    const mulStrPipe = compose(map((x: number) => (x * 2).toString()))

    expect([...pipeValue([1, 2, 3]).into(mulStrPipe)]).toEqual(['2', '4', '6'])
    expect([...pipeValue([1, 2, 3]).into(filter(x => x % 2 === 1))]).toEqual([1, 3])
    const dinosaurify = (name: string) => `${name}-o-saurus`
    const sayHello = (name: string) => `Hello, ${name}!`
    const sayHelloToDinosaur = compose(
      dinosaurify,
      sayHello
    )
    expect(sayHelloToDinosaur('mike')).toBe('Hello, mike-o-saurus!')
    const oddMultipliedByTwo = typedCompose<Iterable<number>>()(
      filter(x => x % 2 === 1),
      map(x => x * 2)
    )
    const q = oddMultipliedByTwo([1, 2, 3])
    expect([...q]).toEqual([2, 6])
    expect([...q]).toEqual([2, 6])

    expect(pp('chris', dinosaurify, sayHello)).toBe('Hello, chris-o-saurus!')

    const composedFuncs = compose(
      filter((x: number) => x % 2 === 0),
      map(x => '$' + x),
      toArray
    )
    expect(composedFuncs([1, 2, 3, 4])).toEqual(['$2', '$4'])
  })
})
