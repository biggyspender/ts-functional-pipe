const rangeGenerator = function* (start: number, count: number) {
    for (let i = 0; i < count; ++i) {
        yield i + start;
    }
};

const range = (start: number, count: number): number[] => [...rangeGenerator(start, count)];

//function _pipe<TIn extends any[], T1, T2, TOut>(f1: Func<TIn, T1>, f2: UnaryFunction<T1, T2>, f3: UnaryFunction<T2, TOut>): Func<TIn, TOut>

const getLines =
    (name: string, type: "pipe" | "compose" | "pipeInto", numOverloads: number) => {
        return [
            "import { Func } from './types/Func';",
            "import { UnaryFunction } from './types/UnaryFunction';",
            "import { pipeImpl } from './pipeImpl';",
            "",
            ...range(0, numOverloads).map(n => {
                const functionAndGenericDecl = `export function ${name}<${type === "pipeInto" ? "TIn" : "TIn extends any[]"}, ${[...range(1, n).map(n => `T${n}`), "TOut"].join(", ")}>`;
                const parameterTypeList =
                    range(0, n + 1)
                        .map(pn =>
                            pn === 0
                                ? n === 0
                                    ? type === "pipeInto" ? `Func<[TIn], TOut>` : `Func<TIn, TOut>`
                                    : type === "pipeInto" ? `Func<[TIn], T1>` : `Func<TIn, T1>`
                                : pn !== n
                                    ? `UnaryFunction<T${pn}, T${pn + 1}>`
                                    : `UnaryFunction<T${pn}, TOut>`);
                const orderedParameterTypeList = type !== "compose" ? parameterTypeList : parameterTypeList.reverse()
                const pList = orderedParameterTypeList.map((type, idx) => `f${idx}: ${type}`)
                const pl = [...(type === "pipeInto" ? ["src: TIn"] : []), ...pList]
                return `${functionAndGenericDecl}(${pl.join(", ")}): ${type === "pipeInto" ? "TOut" : "Func<TIn, TOut>"}`;
            }),
            (type === "pipe"
                ? `export function ${name}<TIn extends any[], TOut>(o1: Func<TIn, any>, ...operations: UnaryFunction<any, any>[]): Func<TIn, TOut> {`
                : type === "pipeInto"
                    ? `export function ${name}<TIn, TOut>(src: TIn, o1: Func<[TIn], any>, ...operations: UnaryFunction<any, any>[]): TOut {`
                    : `export function ${name}<TIn extends any[], TOut>(...args: [...operations: UnaryFunction<any, any>[], o1: Func<TIn, any>]): Func<TIn, TOut> {`),
            [...(type === "pipe"
                ? ["return pipeImpl(o1, ...operations)"]
                : type === "pipeInto"
                    ? ["return pipeImpl(o1, ...operations)(src) as TOut"]
                    : [
                        "const o1 = args[args.length - 1] as Func<TIn, any>;",
                        "const operations = args.slice(0, -1).reverse() as UnaryFunction<any, any>[];",
                        "return pipeImpl(o1, ...operations)"]).map(v => `    ${v}`)]
                .join("\n"),
            "}"];
    }

const [, , ...[funcName, type, numOverloads]] = process.argv;


console.log(`${getLines(funcName, type as "pipe" | "compose", parseInt(numOverloads, 10)).join("\n")}`)
