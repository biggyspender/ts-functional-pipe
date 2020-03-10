import { applyArgs, pipe } from '../src/ts-functional-pipe'
test('funcArgs test', () => {
  const r = applyArgs(1).to((a) => a + 1)
  expect(r).toBe(2)
})

test('funcArgs with pipe', () => {
  const r = applyArgs(1, 2).to(
    pipe(
      (a, b) => a + b + 100,
      (a) => a * 2,
      (a) => `${a} monkeys`
    )
  )
  expect(r).toBe('206 monkeys')
})
