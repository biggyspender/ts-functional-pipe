import { compose } from '../src/ts-functional-pipe'

test('compose test', () => {
    const c = compose(
        (x) => `${x} monkeys`,
        (x) => x * 2,
        (n) => n + 100
    )
    expect(c(1)).toBe('202 monkeys')
})
