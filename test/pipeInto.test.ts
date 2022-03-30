import { pipeInto } from '../src/ts-functional-pipe'
test('pipe test', () => {
    const p = pipeInto(
        1,
        (n: number) => n + 100,
        (x) => x * 2,
        (x) => `${x} monkeys`
    )
    expect(p).toBe('202 monkeys')
})
