import { pipe } from '../src/ts-functional-pipe'
test('pipe test', () => {
  const p = pipe(
    (n: number) => n + 100,
    (x) => x * 2,
    (x) => `${x} monkeys`
  )
  expect(p(1)).toBe('202 monkeys')
})
