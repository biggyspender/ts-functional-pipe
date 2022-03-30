const rangeGenerator = function* (start: number, count: number) {
    for (let i = 0; i < count; ++i) {
        yield i + start
    }
}

const range = (start: number, count: number): number[] => [...rangeGenerator(start, count)]

const comments = {
    pipe: `/**
 * Type-enforcing left-to-right function composition function.
 * The first parameter can be a function of any arity, but the remaining parameters must be unary functions.
 * The return type of one function must be compatible with the argument of next function in the argument list
 * (i.e. types flow from left-to-right)
 * @returns A function with the arguments of the *first* function in the argument list and a return type of the *last* function in the argument list
 */`,
    compose: `/**
 * Type-enforcing right-to-left function composition function.
 * The last parameter (i.e. the first function to be evaluated) in the argument list can be a function of any arity, but the remaining parameters must be unary functions.
 * The return type of one function must be compatible with the argument of previous function in the argument list
 * (i.e. types flow from right-to-left)
 * @returns A function with the arguments of the last function in the argument list and a return type of the first function in the argument list
 */`,
    pipeInto: `/**
 * \`pipeInto(src, f1, f2)\` is shorthand for \`applyArgs(src).to(pipe(f1, f2))\`
 */`,
}

const getLines = (name: string, type: 'pipe' | 'compose' | 'pipeInto', numOverloads: number) => {
    return [
        "import { Func } from './types/Func';",
        "import { UnaryFunction } from './types/UnaryFunction';",
        "import { pipeImpl } from './pipeImpl';",
        [...(type === 'pipeInto' ? ["import { applyArgs } from './applyArgs'"] : [])],
        '',
        comments[type],
        ...range(0, numOverloads).map((n) => {
            const functionAndGenericDecl = `export function ${name}<${
                type === 'pipeInto' ? 'TIn' : 'TIn extends any[]'
            }, ${[...range(1, n).map((c) => `T${c}`), 'TOut'].join(', ')}>`
            const parameterTypeList = range(0, n + 1).map((pn) =>
                pn === 0
                    ? n === 0
                        ? type === 'pipeInto'
                            ? 'Func<[TIn], TOut>'
                            : 'Func<TIn, TOut>'
                        : type === 'pipeInto'
                        ? 'Func<[TIn], T1>'
                        : 'Func<TIn, T1>'
                    : pn !== n
                    ? `UnaryFunction<T${pn}, T${pn + 1}>`
                    : `UnaryFunction<T${pn}, TOut>`
            )
            const orderedParameterTypeList =
                type !== 'compose' ? parameterTypeList : parameterTypeList.reverse()
            const pList = orderedParameterTypeList.map((t, idx) => `f${idx}: ${t}`)
            const pl = [...(type === 'pipeInto' ? ['src: TIn'] : []), ...pList]
            return `${functionAndGenericDecl}(${pl.join(', ')}): ${
                type === 'pipeInto' ? 'TOut' : 'Func<TIn, TOut>'
            }`
        }),
        type === 'pipe'
            ? `export function ${name}<TIn extends any[], TOut>(o1: Func<TIn, any>, ...operations: UnaryFunction<any, any>[]): Func<TIn, TOut> {`
            : type === 'pipeInto'
            ? `export function ${name}<TIn, TOut>(src: TIn, o1: Func<[TIn], any>, ...operations: UnaryFunction<any, any>[]): TOut {`
            : `export function ${name}<TIn extends any[], TOut>(...args: [...operations: UnaryFunction<any, any>[], o1: Func<TIn, any>]): Func<TIn, TOut> {`,
        [
            ...(type === 'pipe'
                ? ['return pipeImpl(o1, ...operations)']
                : type === 'pipeInto'
                ? ['return applyArgs(src).to(pipeImpl(o1, ...operations))']
                : [
                      'const o1 = args[args.length - 1] as Func<TIn, any>;',
                      'const operations = args.slice(0, -1).reverse() as UnaryFunction<any, any>[];',
                      'return pipeImpl(o1, ...operations)',
                  ]
            ).map((v) => `    ${v}`),
        ].join('\n'),
        '}',
    ]
}

const [, , ...[funcName, type, numOverloads]] = process.argv

console.log(
    `${getLines(funcName, type as 'pipe' | 'compose', parseInt(numOverloads, 10)).join('\n')}`
)
