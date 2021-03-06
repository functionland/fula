# async-later 🏄‍♂️

[![Node.js CI](https://github.com/functionland/box/actions/workflows/npm-test-async-later.yml/badge.svg)](https://github.com/functionland/box/actions/workflows/npm-test-async-later.yml) [![Try streaming-iterables on RunKit](https://badge.runkitcdn.com/async-later.svg)](https://npm.runkit.com/async-later) [![install size](https://packagephobia.now.sh/badge?p=async-later)](https://packagephobia.now.sh/result?p=async-later)

Return a `Promise` or an `AsyncIterable` now and handle the logic later! Use in conjunction with the amazing [`streaming-iterables`](https://github.com/reconbot/streaming-iterables) package and write elegant functional code.

## Install
There are no dependencies.

```bash
npm i --save async-later
```

We ship esm and types.

## API

- [`resolveLater()`](#resolvelater)
- [`iterateLater()`](#iteratelater)
- [`partition()`](#partition)
- [`toAsyncIterable()`](#toasynciterable)
- [`firstValue()`](#firstvalue)
- [`lastValue()`](#lastvalue)
- [`valueAt()`](#valueat)
- [`concurrently()`](#concurrently)

### resolveLater

```ts
function resolveLater<T>(): [Promise<T>, Resolve<T>]
// type Resolve<T> = (value?: T | PromiseLike<T>) => void;
```

Creates a `Promise` and passes its `resolve` to the outer scope (in the native Promise API, `resolve` is only accessible through `new Promise((resolve, reject) => {...})`).

```js
import { resolveLater } from 'async-later';

const [value, setValue] = resolveLater();
value.then(console.log);
setValue(42);
// 42
```

Real world example [adapted from @functionland/protocols/file](https://github.com/functionland/box/blob/8c82eb40d4511f498bb5f02451b8612b36d0672e/packages/protocols/file/handlers/save.ts#L24):

```ts
// Customizable backend for "save"

type SaveMethod = (blog: Blog, declareId: (id: string) => void) => any;
// We want to pass a callback, "declareId", to custom implementations
// to be invoked with "id" when they are done
let saveMethod: SaveMethod = async () => {}; // Default: no implementation
export function changeSaveMethod(method: SaveMethod) {
  saveMethod = method;
}

export function save(blog: Blog): Promise<string> { // returns Promise of saved blog's id
  const [id, resolve] = resolveLater<string>();
  saveMethod(blog, resolve);
  return id;  
}
```

### iterateLater

```ts
function iterateLater<T>(): [AsyncIterable<T>, Resolve<T>, () => void]
```

Creates `next()` and `complete()` interfaces for an `AsyncIterable` (similar to [`Observable`](https://github.com/tc39/proposal-observable)s). [Stalls on back pressure](https://github.com/functionland/box/blob/7a42a6e1e58d3a233066d969f2de03b401b684bb/packages/async-later/src/test.js#L91) and [caches when read is slower](https://github.com/functionland/box/blob/7a42a6e1e58d3a233066d969f2de03b401b684bb/packages/async-later/src/iterate-later.ts#L5).

```js
import { iterateLater } from 'async-later';

const [iterable, next, complete] = iterateLater();
next(1);
next(2);
next(3);
complete();
for await (const value of iterable) {
  console.log(value);
}
// 1
// 2
// 3
```

### partition

```ts
function partition<T>(index: number, iterable: AsyncIterable<T>): [AsyncIterable<T>, AsyncIterable<T>]
```

Decomposes an `AsyncIterable` into two at an `index` (more partitions can be made by subsequent/recursive calls).

```js
import { partition, toAsyncIterable } from 'async-later';

const [p1, rest] = partition(2, toAsyncIterable([1, 2, 3, 4, 5]));
const [p2, p3] = partition(2, rest);
for await (const value of p1) {
  console.log(value);
}
// 1
// 2

for await (const value of p2) {
  console.log(value);
}
// 3
// 4

for await (const value of p3) {
  console.log(value);
}
// 5
```

### toAsyncIterable

```ts
function toAsyncIterable<T>(
  value: T | PromiseLike<T> | ObservableLike<T> | Iterable<PromiseLike<T> | T> | AsyncIterable<T>
): AsyncIterable<T>
// Curried overload suitable for pipeline:
export function toAsyncIterable<T>(): (
  value: T | PromiseLike<T> | ObservableLike<T> | Iterable<PromiseLike<T> | T> | AsyncIterable<T>
) => AsyncIterable<T>
```

Converts anything to an `AsyncIterable`!

```js
import { toAsyncIterable } from 'async-later';


for await (const value of toAsyncIterable(42)) {
  console.log(value);
}
// 42

for await (const value of toAsyncIterable(Promise.resolve(42))) {
  console.log(value);
}
// 42

for await (const value of toAsyncIterable([42])) {
  console.log(value);
}
// 42

for await (const value of toAsyncIterable([])) {
  console.log(value); // Will not execute
}

for await (const value of toAsyncIterable([1, 2, 3])) {
  console.log(value);
}
// 1
// 2
// 3

for await (const value of toAsyncIterable([1, Promise.resolve(2), Promise.resolve(3)])) {
  console.log(value);
}
// 1
// 2
// 3
```

### firstValue

```ts
function firstValue<T>(iterable: Iterable<T> | AsyncIterable<T>): Promise<T>
// Curried overload suitable for pipeline:
function firstValue<T>(): (iterable: Iterable<T> | AsyncIterable<T>) => Promise<T>
```

Returns the first value from an `AsyncIterable` as a `Promise`. The `Promise` rejects if iterable is empty.

```js
import { firstValue, toAsyncIterable } from 'async-later';

const iterable = toAsyncIterable([1, 2, 3]);

console.log(await firstValue(iterable));
// 1
```

### lastValue

```ts
function lastValue<T>(iterable: Iterable<T> | AsyncIterable<T>): Promise<T>
// Curried overload suitable for pipeline:
function lastValue<T>(): (iterable: Iterable<T> | AsyncIterable<T>) => Promise<T>
```

Returns the last value from an `AsyncIterable` as a `Promise`. The `Promise` rejects if iterable is empty.

```js
import { lastValue, toAsyncIterable } from 'async-later';

const iterable = toAsyncIterable([1, 2, 3]);

console.log(await lastValue(iterable));
// 3
```

### valueAt

```ts
function valueAt<T>(index: number, iterable: Iterable<T> | AsyncIterable<T>): Promise<T>
// Curried overload suitable for pipeline:
function valueAt<T>(index: number): (iterable: Iterable<T> | AsyncIterable<T>) => T
```

Returns the value specified by an `index` in an `AsyncIterable`, as a `Promise`. The `Promise` rejects if iterable is empty or `index` >= length.

```js
import { valueAt, toAsyncIterable } from 'async-later';

const iterable = toAsyncIterable([1, 2, 3]);

console.log(await valueAt(1, iterable));
// 2
```

### concurrently

```ts
function concurrently<T>(...functions: (() => T | PromiseLike<T>)[]): Promise<T[]>
```

Invokes `functions` [with `Promise.all`](https://github.com/functionland/box/blob/eb995f09a1aaf27b2505235e237e2d181cdbc99d/packages/async-later/src/concurrently.ts#L2).

```js
import { concurrently } from 'async-later';

const result = await concurrently(
  () => 42,
  () => Promise.resolve(42),
  async () => 42,
  () => 24,
  async () => 24
);
console.log(result)
// [42, 42, 42, 24, 24]
```

## License

[MIT](https://github.com/functionland/box/blob/main/LICENSE)
