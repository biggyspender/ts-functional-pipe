import { Func } from './types/Func'
import { UnaryFunction } from './types/UnaryFunction'

export function pipeImpl<T extends any[], R>(
    ...args: [o1: Func<T, any>, ...operations: UnaryFunction<any, any>[]]
): Func<T, R> {
    const [o1, ...operations] = args
    return (...argsP: T) => operations.reduce((acc, f) => f(acc), o1(...argsP))
}
