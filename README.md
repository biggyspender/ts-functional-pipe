# Type-safe function composition for Typescript

## A micro-library for functional composition

In the absence of `|>` (the pipe operator) it's useful to have a type-safe pipe function that can compose an a large (up to 64) number of unary functions. This minimal library contains a few different helper functions for this purpose.

[![npm version](http://img.shields.io/npm/v/ts-functional-pipe.svg?style=flat)](https://npmjs.org/package/ts-functional-pipe "View this project on npm")
[![Build Status](https://travis-ci.org/biggyspender/ts-functional-pipe.svg?branch=master)](https://travis-ci.org/biggyspender/ts-functional-pipe)

> NOTE
> ---
> 
> Versions <=2.x erroneously used the term `compose` for left-to-right function composition. v3 is a major overhaul of this library and contains several breaking changes, both in the code, and in the meaning of `compose`. 
>
> These are version >=3 documents. Please find v2.x documentation [here](https://github.com/biggyspender/ts-functional-pipe/tree/v2.1.1)

## Requirements

This library makes use of [leading/middle rest elements](https://devblogs.microsoft.com/typescript/announcing-typescript-4-2/#non-trailing-rests), introduced in **Typescript version 4.2**

## Usage

Suppose we have the following unary functions:

```typescript
const dinosaurify = (name:string) => `${name}-o-saurus`
const sayHello = (name:string) => `Hello, ${name}!`
```

We can compose these functions into a single function using the compose function:

```typescript
const sayHelloToDinosaur = compose(sayHello, dinosaurify)
```

and call it

```typescript
sayHelloToDinosaur("mike") // "Hello, mike-o-saurus!"
```

Note that with `compose`, function composition occurs from *right-to-left*. 

The `pipe` function composes its parameters from *left-to-right*, so the equivalent `pipe` version of the code above would be:

```typescript
const sayHelloToDinosaur_withPipe = pipe(dinosaurify, sayHello)
```

### The `applyArgs` helper

Alternatively, we could have called the `applyArgs` helper, which is useful for ensuring that type inference flows inutitively through the composed functions. This makes more sense later when we start using it with (apparently) untyped arrow functions.

```typescript
applyArgs("mike").to(pipe(dinosaurify, sayHello)) // "Hello, mike-o-saurus!"
```

or, less verbosely:

```typescript
applyArgs("mike")(pipe(dinosaurify, sayHello)) // "Hello, mike-o-saurus!"
```

### `pipeInto` function

This is shorthand to combine the `applyArgs` helper with `pipe`, reducing the amount of boilerplate. Using `pipeInto` we can rewrite the above as:

```typescript
pipeInto("mike", dinosaurify, sayHello)
```


## In depth

Pipes work with **unary**-functions, using the return value of one function as the only parameter to the next function.

### Defining higher-order unary map and filter functions

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

Here, the `_map` and `_filter` are not unary functions so cannot be used in a pipe/compose.

### Convert functions to unary with `deferP0`

We can use the provided `deferP0` method to transform these functions into functions that return a unary function (that takes a single parameter that was the first parameter of the original source function)

So it turns functions of the form

    (src: TSrc, b: B, c: C, d: D) => R 
    
into functions of the form

    (b: B, c: C, d: D) => (src: TSrc) => R

### Functions that return unary functions

So, to make a composable `map` function:

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

Now the `map` and `filter` functions that we generated above **return** unary functions and can be used in a pipe/compose with type inference "flowing" through the composed functions.

### Composing `map` and `filter` with `pipe`

Let's use them with the `pipe` and the `applyArgs` helper (so that type information propagates through all the function parameters)

```typescript
const transformed = 
  applyArgs([1, 2, 3]).to(
    pipe(
      filter(x => x % 2 === 1),  // x is inferred as number
      map(x => x * 2)            // x is inferred as number
    )
  ) // iterable with values [2, 6]
```

When using "untyped" arrow functions, as above, by using the `applyArgs` helper, we can see how types are propagated through the functions without needing to provide types for any function parameters. However, we might just want a re-useable function composed of multiple functions, so we can use `compose(...unaryFuncs)` or `pipe(...unaryFuncs)` on their own... but we'll need to supply type-information, usually in just one place, so that typescript can infer other types successfully:

```typescript
const oddNumbersMultipliedByTwo =
    // pipe is inferred as (src:Iterable<number>)=>Iterable<string>
    pipe(
      // typescript can infer all other types when 
      // we provide this input type annotation (number)
      filter(x:number => x % 2 === 1), 
      map(x => x.toString()),   // x is inferred as number
      map(x => x + " " + x)     // x is inferred as string
    )
```

So `oddNumbersMultipliedByTwoPipe` has the inferred type

    (src: Iterable<number>) => Iterable<string>

and when we use it...

```typescript
const r = oddMultipliedByTwo([1, 2, 3]) 
// arr has type string[]
const arr = [...r] // ["1 1", "2 2"]
```

`arr` has type string[]

### acknowledgements

Created using the wonderful [https://github.com/alexjoverm/typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter).
