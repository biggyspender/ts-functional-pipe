import { Func } from './types/Func'
import { UnaryFunction } from './types/UnaryFunction'

export function composeImpl<T extends any[], R>(
    ...args: [...operations: UnaryFunction<any, any>[], o1: Func<T, any>]
): Func<T, R> {
    const o1 = args[args.length - 1]
    const operations = args.slice(0, args.length - 1)
    return (...argsP: T) => operations.reduceRight((acc, f) => f(acc), o1(...argsP))
}
