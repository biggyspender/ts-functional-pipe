import { Func } from './types/Func';
import { UnaryFunction } from './types/UnaryFunction';
export declare function pipeImpl<T extends any[], R>(...args: [o1: Func<T, any>, ...operations: UnaryFunction<any, any>[]]): Func<T, R>;
