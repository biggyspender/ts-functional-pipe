## Type-safe, functional-style pipe functions for typescript

In the absence of `|>`, the pipe operator, it's useful to have a type-safe `pipe` function that can compose an a large (up to 32) number of unary functions. This minimal library contains a few different helper functions for this purpose.

Suppose we have the following unary functions:

    const dinosaurify = (name:string) => `${name}-o-saurus`
    const sayHello = (name:string) => `Hello, ${name}!`

We can compose these functions into a single function using the pipe function:

    const sayHelloToDinosaur = pipe(dinosaurify, sayHello)

and call it

    sayHelloToDinosaur("mike") // "Hello, mike-o-saurus!"

Alternatively, we could have called

    pipeValue("mike").into(dinosaurify, sayHello) // "Hello, mike-o-saurus!"

### OK, great, but... Why?

Pipes work with unary-functions, using the return value of one function as the only parameter to the next function.

Say we create our own versions the Array map and filter functions to work over `Iterable<T>`

    const map =
      <T, TOut>(selector: (v: T, i: number) => TOut) => (src: Iterable<T>): Iterable<TOut> => {
        return {
          [Symbol.iterator]: function* () {
            let c = 0
            for (const v of src) {
              yield selector(v, c++)
            }
          }
        }
      }

    const filter = <T>(pred: (v: T, i: number) => boolean) => (src: Iterable<T>): Iterable<T> => {
      return {
        [Symbol.iterator]: function* () {
          let i = 0
          for (const x of src) {
            if (pred(x, i++)) {
              yield x
            }
          }
        }
      }
    }

As can be seen, the `map` and `filter` functions above **return** unary functions.

    pipeValue([1, 2, 3])
      .into(
        filter(x => x % 2 === 1),
        map(x => x * 2)
      )

Or if you want a re-useable pipe

    const oddMultipliedByTwo =
        pipe(
          // typescript can infer all other types when 
          // we provide this input type annotation (number)
          filter(x:number => x % 2 === 1), 
          map(x => x * 2)
        )

or, providing the input-type in a different way:

    const oddMultipliedByTwo =
        typedPipe<number>()(
          filter(x => x % 2 === 1), 
          map(x => x * 2)
        )

which can be used:

    const r = oddMultipliedByTwo([1, 2, 3]) 
    const arr = [...r] // [2, 6]

### acknowledgements

Created using the wonderful [https://github.com/alexjoverm/typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter).
