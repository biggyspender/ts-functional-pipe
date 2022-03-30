import { deferP0 } from '../src/ts-functional-pipe'
import { toIterable } from './toIterable'

function add(a: string, b: number, c: boolean): number {
    return parseInt(a, 10) + b + +c
}

function app<T>(src: Iterable<T>, item: T): Iterable<T> {
    return toIterable(function* () {
        for (const s of src) {
            yield s
        }
        yield item
    })
}

describe('deferP0', () => {
    it('works', () => {
        const p = deferP0(add)
        expect(p(5, false)('5')).toBe(10)
        expect(p(5, true)('4')).toBe(10)
        const pp = deferP0(p)
        expect(pp(true)(2)('3')).toBe(6)
        const ppp = deferP0(pp)
        expect(ppp()(true)(2)('3')).toBe(6)
    })
    it('works with generics', () => {
        const appd = deferP0(app)

        const ff = appd(4)([1, 2, 3])
        const fff = app([1, 2, 3], 4)

        expect([...ff]).toEqual([1, 2, 3, 4])
        expect([...fff]).toEqual([1, 2, 3, 4])
    })
})
