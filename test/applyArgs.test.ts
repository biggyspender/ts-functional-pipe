import { applyArgs, pipe } from '../src/ts-functional-pipe'
test('applyArgs', () => {
    const r = applyArgs(1).to((a) => a + 1)
    expect(r).toBe(2)
})

test('applyArgs with pipe', () => {
    const r = applyArgs(1, 2).to(
        pipe(
            (a, b) => a + b + 100,
            (a) => a * 2,
            (a) => `${a} monkeys`
        )
    )
    expect(r).toBe('206 monkeys')
})

test('applyArgs with no to', () => {
    const r = applyArgs(
        1,
        2
    )(
        pipe(
            (a, b) => a + b + 100,
            (a) => a * 2,
            (a) => `${a} monkeys`
        )
    )
    expect(r).toBe('206 monkeys')
})
