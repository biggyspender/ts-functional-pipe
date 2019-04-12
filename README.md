# Type-safe, functional-style pipe functions for typescript

In the absence of |> (the pipe operator) it's useful to have a type-safe pipe function that can compose an a large (up to 32) number of unary functions. This minimal library contains a few different helper functions for this purpose.

[![npm version](http://img.shields.io/npm/v/ts-functional-pipe.svg?style=flat)](https://npmjs.org/package/ts-functional-pipe "View this project on npm")
[![Build Status](https://travis-ci.org/biggyspender/ts-functional-pipe.svg?branch=master)](https://travis-ci.org/biggyspender/ts-functional-pipe)

## Usage

Suppose we have the following unary functions:

```typescript
const dinosaurify = (name:string) => `${name}-o-saurus`
const sayHello = (name:string) => `Hello, ${name}!`
```

We can compose these functions into a single function using the pipe function:

```typescript
const sayHelloToDinosaur = pipe(dinosaurify, sayHello)
```

and call it

```typescript
sayHelloToDinosaur("mike") // "Hello, mike-o-saurus!"
```

Alternatively, we could have called

```typescript
pipeValue("mike").into(dinosaurify, sayHello) // "Hello, mike-o-saurus!"
```

### OK, great, but... Why?

Pipes work with **unary**-functions, using the return value of one function as the only parameter to the next function.

Say we create our own versions the Array map and filter functions to work over `Iterable<T>`

```typescript
// helper function for making iterables from generator functions
const toIterable = <T, TF extends () => IterableIterator<T>>(f: TF) => ({
  [Symbol.iterator]: f
})

const _map = <T, TOut>(src: Iterable<T>, selector: (v: T, i: number) => TOut): Iterable<TOut> =>
  toIterable(function*() {
    let c = 0
    for (const v of src) {
      yield selector(v, c++)
    }
  })

const _filter = <T>(src: Iterable<T>, pred: (v: T, i: number) => boolean): Iterable<T> =>
  toIterable(function*() {
    let i = 0
    for (const x of src) {
      if (pred(x, i++)) {
        yield x
      }
    }
  })
```

You've probably noticed that `_map` and `_filter` are not unary functions so cannot be used in a pipe.

We can use the provided `deferP0` method to transform these functions into functions that return a unary function (that takes a single parameter that was the first parameter of the original source function)

So it turns functions of the form

    (src: TSrc, b: B, c: C, d: D) => R 
    
into functions of the form

    (b: B, c: C, d: D) => (src: TSrc) => R

So, to make a pipeable `map` function:

```typescript
const map = deferP0(_map)
```

Here, we transform the `_map` function with type 


    <T, TOut>(src: Iterable<T>, selector: (v: T, i: number) => TOut): Iterable<TOut> 
    
into the generated `map` function which has the type 

    <T, TOut>(selector: (v: T, i: number) => TOut) => (src: Iterable<T>): Iterable<TOut>

As can be seen, we end up with a function that generates a **unary** function.

We can do the same with `_filter`

```typescript
const filter = deferP0(_filter)
```

Now the `map` and `filter` functions that we generated above **return** unary functions and can be used in a pipe.

Let's use them:

```typescript
const transformed = 
  pipeValue([1, 2, 3])
    .into(
      filter(x => x % 2 === 1),  // x is inferred as number
      map(x => x * 2)            // x is inferred as number
    ) // iterable with values [2, 6]
```

or

```typescript
const transformed = 
  pipeInto(
    [1, 2, 3],
    filter(x => x % 2 === 1),  // x is inferred as number
    map(x => x * 2)            // x is inferred as number
  )
```

or (most minimally), use the `pp` alias for `pipeInto`

```typescript
const transformed = 
  pp(
    [1, 2, 3],
    filter(x => x % 2 === 1),  // x is inferred as number
    map(x => x * 2)            // x is inferred as number
  )
```

`pipeValue(val).into(...)`, `pipeInto(val, ...)` or (most minimally) `pp(val, ...)`  , are functionally equivalent and can be used to push a value through a single-use pipe.


If instead, we're looking for a re-useable pipe, we can use `pipe(...unaryFuncs)` or `typedPipe<T>(...unaryFuncs)`... but we'll need to supply type-information, usually in just one place, so that typescript can infer other types successfully. We can either use `pipe`

```typescript
const oddNumbersMultipliedByTwoPipe =
    // pipe is inferred as (src:Iterable<number>)=>Iterable<string>
    pipe(
      // typescript can infer all other types when 
      // we provide this input type annotation (number)
      filter(x:number => x % 2 === 1), 
      map(x => x.toString()),   // x is inferred as number
      map(x => x + " " + x)     // x is inferred as string
    )
```

or make a pipe that expects the first function it contains to have a parameter of a specific type (using `typedPipe<T>`):

```typescript
    const oddNumbersMultipliedByTwoPipe =
        typedPipe<Iterable<number>>()(
          filter(x => x % 2 === 1),  // x is number
          map(x => x.toString()),    // x is inferred as number
          map(x => x + " " + x)      // x is inferred as string
        )
```

In both cases, `oddNumbersMultipliedByTwoPipe` has the inferred type

    (src: Iterable<number>) => Iterable<string>

and when we use it...

```typescript
const r = oddMultipliedByTwo([1, 2, 3]) 
// arr has type string[]
const arr = [...r] // ["1 1", "2 2"]
```

### acknowledgements

Created using the wonderful [https://github.com/alexjoverm/typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter).
