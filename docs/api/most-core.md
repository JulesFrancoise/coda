# @most/core

## empty

```ts
 empty(): Stream
```

Create a Stream containing no events and ends immediately.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#empty
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
**Returns** `Stream` 


## never

```ts
 never(): Stream
```

Create a Stream containing no events and never ends.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#never
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
**Returns** `Stream` 


## now

```ts
 now(x: *): Stream
```

Create a Stream containing a single event at time 0.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#now
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|x|*||event data|
**Returns** `Stream` 

**Example**


<CodeExample>

```js
// Log the array [1, 2] to the console right away
a = now([1, 2]).tap(log)
```

</CodeExample>


## at

```ts
 at(t: Number, x: *): Stream
```

Create a Stream containing a single event at a specific time.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#at
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|t|Number||time|
|x|*||event data|
**Returns** `Stream` 

**Example**


<CodeExample>

```js
// Log the array [1, 2] to the console after 1 second
a = at(1000, [1, 2]).tap(log)
```

</CodeExample>


## periodic

```ts
 periodic(period: Number): Stream
```

Create an infinite Stream containing events that occur at a specified<br>Period. The first event occurs at time 0, and the event values are<br>`undefined`.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#periodic
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|period|Number||period (ms)|
**Returns** `Stream` 

**Example**


<CodeExample>

```js
// Generate a periodic signal with 500 ms interval and randomize the stream values.
a = periodic(500).map(() => Math.random()).tap(log);
```

</CodeExample>


## throwError

```ts
 throwError(error: Error): Stream
```

Create a Stream that fails with the provided Error at time 0. This can be<br>useful for functions that need to return a Stream and also need to propagate<br>an error.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#throwerror
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|error|Error||Error|
**Returns** `Stream` 


## startWith

```ts
 startWith(x: *, source: Stream): Stream
```

Prepend an event at time 0.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#startwith
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|x|*||Event data|
|source|Stream||Source Stream|
**Returns** `Stream` The source stream starting with the start element


## continueWith

```ts
 continueWith(f: Function, source: Stream): Stream
```

Replace the end of a Stream with another Stream. When `stream` ends, `f`<br>will be called and must return a Stream.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html?highlight=continuewith#cont}inuewit
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|f|Function||Function that returns a stream|
|source|Stream||Source Stream|
**Returns** `Stream` 


## map

```ts
 map(f: Function, source: Stream): Stream
```

Apply a function to each event value.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#map
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|f|Function||Unary function|
|source|Stream||Source stream|
**Returns** `Stream` 

**Example**


<CodeExample>

```js
// Apply a function (in this example, double) to all events in a stream
f = x => 2 * x;
a = periodic(500).constant(1).accum()
  .map(f)
  .tap(log)
```

</CodeExample>


## constant

```ts
 constant(x: *, source: Stream): Stream
```

Replace each event value with x.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#constant
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|x|*||event data|
|source|Stream||Source stream|
**Returns** `Stream` 


## tap

```ts
 tap(f: Function, source: Stream): Stream
```

Perform a side effect for each event in a Stream. For each event in stream,<br>`f` is called, but the value of its result is ignored. If `f` fails (i.e.,<br>throws an error), then the returned Stream will also fail. The Stream<br>returned by tap will contain the same events as the original Stream.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#tap
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|f|Function||Tap function|
|source|Stream||Source stream|
**Returns** `Stream` 

**Example**


<CodeExample>

```js
// Apply a function with side effects, to log the values to the console
a = periodic(500).rand().tap(log);
```

</CodeExample>


## ap

```ts
 ap(fs: Stream<Function>, source: Stream): Stream
```

Apply the latest function in a Stream of functions to the latest value of<br>another Stream. In effect, ap applies a time-varying function to a<br>time-varying value.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#ap
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|fs|Stream&lt;Function&gt;||Function stream|
|source|Stream||Source stream|
**Returns** `Stream` 


## scan

```ts
 scan(f: Function, initial: *, source: Stream): Stream
```

Incrementally accumulate results, starting with the provided initial value.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#scan
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|f|Function||Scanning reducer|
|initial|*||Initial Value|
|source|Stream||Source stream|
**Returns** `Stream` 

**Example**


<CodeExample>

```js
// Accumulate the values of a constant stream
a = periodic(500).constant(2)
  .scan((s, x) => s + x, 0)
  .tap(log);
```

</CodeExample>


## loop

```ts
 loop(stepper: Function, seed: *, source: Stream): Stream
```

Accumulate results using a feedback loop that emits one value and feeds back<br>another to be used in the next iteration.It allows you to maintain and update a “state” (a.k.a. feedback, a.k.a. seed<br>for the next iteration) while emitting a different value. In contrast, scan<br>feeds back and produces the same value.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#loop
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|stepper|Function||Stepper function|
|seed|*||Seed|
|source|Stream||Source stream|
**Returns** `Stream` 


## withItems

```ts
 withItems(items: Array, source: Stream): Stream
```

Replace each event value with the array item at the respective index. The<br>resulting Stream will contain the same number of events as the input Stream,<br>or array.length events, whichever is less.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#withitems
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|items|Array||Items array|
|source|Stream||Source stream|
**Returns** `Stream` 


## zipItems

```ts
 zipItems(f: Function, items: Array, source: Stream): Stream
```

Apply a function to the latest event and the array value at the respective<br>index. The resulting Stream will contain the same number of events as the<br>input Stream, or array.length events, whichever is less.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#zipitems
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|f|Function||Combinator function|
|items|Array||Items|
|source|Stream||Source stream|
**Returns** `Stream` 


## switchLatest

```ts
 switchLatest(source: Stream): Stream
```

Given a higher-order Stream, return a new Stream that adopts the behavior of<br>(i.e., emits the events of) the most recent inner Stream.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#switchlatest
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|source|Stream||higher-order stream|
**Returns** `Stream` 


## join

```ts
 join(source: Stream): Stream
```

Given a higher-order Stream, return a new Stream that merges all the inner<br>Streams as they arrive.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#join
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|source|Stream||higher-order Stream|
**Returns** `Stream` 


## chain

```ts
 chain(f: Function, source: Stream): Stream
```

Transform each event in `stream` into a new Stream, and then merge each into<br>the resulting Stream. Note that `f` must return a Stream.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#chain
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|f|Function||function returning a stream|
|source|Stream||Source stream|
**Returns** `Stream` 


## concatMap

```ts
 concatMap(f: Function, source: Stream): Stream
```

Transform each event in `stream` into a Stream, and then concatenate each<br>onto the end of the resulting Stream. Note that `f` must return a Stream.The mapping function `f` is applied lazily. That is, `f` is called only once<br>it is time to concatenate a new stream.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#concatmap
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|f|Function||Function returning a stream|
|source|Stream||Source stream|
**Returns** `Stream` 


## mergeConcurrently

```ts
 mergeConcurrently(concurrency: Number, source: Stream): Stream
```

Given a higher-order Stream, return a new Stream that merges inner Streams<br>as they arrive up to the specified concurrency. Once concurrency number of<br>Streams are being merged, newly arriving Streams will be merged after an<br>existing one ends.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#mergeconcurrently
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|concurrency|Number||concurrency level|
|source|Stream||Higher-order stream|
**Returns** `Stream` 


## mergeMapConcurrently

```ts
 mergeMapConcurrently(f: Function, concurrency: Number, source: Stream): Stream
```

Lazily apply a function `f` to each event in a Stream, merging them into the<br>resulting Stream at the specified concurrency. Once concurrency number of<br>Streams are being merged, newly arriving Streams will be merged after an<br>existing one ends.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#mergemapconcurrently
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|f|Function||Unary function|
|concurrency|Number||concurrency level|
|source|Stream||event stream|
**Returns** `Stream` 


## merge

```ts
 merge(stream1: Stream, source: Stream): Stream
```

Create a new Stream containing events from two Streams.Merging creates a new Stream containing all events from the two original<br>Streams without affecting the time of the events. You can think of the<br>events from the input Streams simply being interleaved into the new, merged<br>Stream. A merged Stream ends when all of its input Streams have ended.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#merge
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|stream1|Stream||Event stream 1|
|source|Stream||Event stream 2|
**Returns** `Stream` 

**Example**


<CodeExample>

```js
a = periodic(500).take(3).constant('a');
b = periodic(100).take(3).constant(2);
c = a.merge(b).tap(log);
```

</CodeExample>


## combine

```ts
 combine(f: Function, stream1: Stream, source: Stream): Stream
```

Apply a function to the most recent event from each Stream when a new event<br>arrives on any Stream.Note that `combine` waits for at least one event to arrive on all input<br>Streams before it produces any events.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#combine
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|f|Function||Combinator function|
|stream1|Stream||Event stream 1|
|source|Stream||Event stream 2|
**Returns** `Stream` 


## zip

```ts
 zip(f: Function, stream1: Stream, source: Stream): Stream
```

Apply a function to corresponding pairs of events from the inputs Streams.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#zip
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|f|Function||Combinator function|
|stream1|Stream||Event stream 1|
|source|Stream||Event stream 2|
**Returns** `Stream` 


## sample

```ts
 sample(source: Stream, sampler: Stream): Stream
```

For each event in a sampler Stream, replace the event value with the latest<br>value in another Stream. The resulting Stream will contain the same number<br>of events as the sampler Stream.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#sample
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|source|Stream||value stream|
|sampler|Stream||Sampler stream|
**Returns** `Stream` 

**Example**


<CodeExample>

```js
// Sample a noise signal from a stream of click events
noise = periodic(20).rand().plot({ legend: 'noise' });
click = click(doc).sample(noise).tap(log);
```

</CodeExample>


## resample

```ts
 resample(sampler: Stream, source: Stream): Stream
```

Like `sample`, but the value stream and sampler streams are switched

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#sample
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|sampler|Stream||Sampler stream|
|source|Stream||value stream|
**Returns** `Stream` 

**Example**


<CodeExample>

```js
// Sample a noise signal from a stream of click events
noise = periodic(20).rand().plot({ legend: 'noise' });
click = noise.resample(click(doc)).tap(log);
```

</CodeExample>


## snapshot

```ts
 snapshot(f: Function, values: Stream, source: Stream): Stream
```

For each event in a sampler Stream, apply a function to combine its value<br>with the most recent event value in another Stream. The resulting Stream<br>will contain the same number of events as the sampler Stream.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#snapshot
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|f|Function||Snapshot function|
|values|Stream||Value stream|
|source|Stream||Source stream|
**Returns** `Stream` 


## filter

```ts
 filter(p: Function, source: Stream): Stream
```

Retain only events for which a predicate is truthy.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#filter
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|p|Function||Predicate|
|source|Stream||Source event stream|
**Returns** `Stream` 

**Example**


<CodeExample>

```js
a = periodic(200).rand().filter(x => x > 0.8).tap(log);
```

</CodeExample>


## skipRepeats

```ts
 skipRepeats(source: Stream): Stream
```

Remove adjacent repeated events.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#skiprepeats
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|source|Stream||Source event stream|
**Returns** `Stream` 


## skipRepeatsWith

```ts
 skipRepeatsWith(equals: Function, source: Stream): Stream
```

Remove adjacent repeated events, using the provided equality function to<br>compare adjacent events.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#skiprepeatswith
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|equals|Function||Equality function|
|source|Stream||Source event stream|
**Returns** `Stream` 


## slice

```ts
 slice(start: Number, end: Number, source: Stream): Stream
```

Keep only events in a range, where start <= index < end, and index is the<br>ordinal index of an event in `stream`.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#id48
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|start|Number||start index|
|end|Number||end index|
|source|Stream||Source event stream|
**Returns** `Stream` 


## take

```ts
 take(n: Number, source: Stream): Stream
```

Keep at most the first n events from `stream`.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#take
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|n|Number||Number of events|
|source|Stream||Source event stream|
**Returns** `Stream` 


## skip

```ts
 skip(n: Number, source: Stream): Stream
```

Discard the first n events from stream.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#skip
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|n|Number||Number of events|
|source|Stream||Source event stream|
**Returns** `Stream` 


## takeWhile

```ts
 takeWhile(p: Function, source: Stream): Stream
```

Keep all events until predicate returns `false`, and discard the rest.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#takewhile
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|p|Function||Predicate|
|source|Stream||Source event stream|
**Returns** `Stream` 


## skipWhile

```ts
 skipWhile(p: Function, source: Stream): Stream
```

Discard all events until predicate returns `false`, and keep the rest.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#skipwhile
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|p|Function||Predicate|
|source|Stream||Source event stream|
**Returns** `Stream` 


## skipAfter

```ts
 skipAfter(p: Function, source: Stream): Stream
```

Discard all events after the first event for which predicate returns true.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#skipafter
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|p|Function||Predicate|
|source|Stream||Source event stream|
**Returns** `Stream` 


## until

```ts
 until(endSignal: Stream, source: Stream): Stream
```

Keep all events in one Stream until the first event occurs in another.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#until
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|endSignal|Stream||End signal|
|source|Stream||Source stream|
**Returns** `Stream` 


## since

```ts
 since(startSignal: Stream, source: Stream): Stream
```

Discard all events in one Stream until the first event occurs in another.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#since
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|startSignal|Stream||Start signal|
|source|Stream||Source stream|
**Returns** `Stream` 


## during

```ts
 during(timeWindow: Stream, source: Stream): Stream
```

Keep events that occur during a time window defined by a higher-order Stream.

|Parameter|Type|Default|Description|
|---|---|---|---|
|timeWindow|Stream||Higher order stream defining a time window|
|source|Stream||Source stream|
**Returns** `Stream` 


## delay

```ts
 delay(delayTime: Number, source: Stream): Stream
```

Timeshift a Stream by the specified Delay.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#id57
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|delayTime|Number||Delay time (ms)|
|source|Stream||Source stream|
**Returns** `Stream` 


## withLocalTime

```ts
 withLocalTime(origin: Number, source: Stream): Stream
```

Create a Stream with localized Time values, whose origin (i.e., time 0) is<br>at the specified Time on the Scheduler provided when the Stream is observed<br>with runEffects or run.When implementing custom higher-order Stream combinators, such as chain, you<br>should use `withLocalTime` to localize “inner” Streams before running them.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#withlocaltime
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|origin|Number||origin time value|
|source|Stream||Source stream|
**Returns** `Stream` 


## throttle

```ts
 throttle(period: Number, source: Stream): Stream
```

Limit the rate of events by suppressing events that occur too often

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#throttle
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|period|Number||Throttle period|
|source|Stream||Source stream|
**Returns** `Stream` 


## debounce

```ts
 debounce(period: Number, source: Stream): Stream
```

Wait for a burst of events to subside and keep only the last event in the<br>burst.If the Stream ends while there is a pending debounced event (e.g., via<br>until), the pending event will occur just before the Stream ends.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#debounce
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|period|Number||Debounce period|
|source|Stream||Source stream|
**Returns** `Stream` 


## fromPromise

```ts
 fromPromise(promise: Promise): Stream
```

Create a Stream containing a promise’s value.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#frompromise
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|promise|Promise||WHAT ?????? {"type":"linkReference","identifier":"description","referenceType":"shortcut","children":[{"type":"text","value":"description","position":{"start":{"line":1,"column":2,"offset":1},"end":{"line":1,"column":13,"offset":12},"indent":[]}}],"position":{"start":{"line":1,"column":1,"offset":0},"end":{"line":1,"column":14,"offset":13},"indent":[]}}|
**Returns** `Stream` 


## awaitPromises

```ts
 awaitPromises(source: Stream): Stream
```

Turn a Stream of promises into a Stream containing the promises’ values.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#awaitpromises
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|source|Stream||Stream of promises|
**Returns** `Stream` 


## recoverWith

```ts
 recoverWith(f: Function, source: Stream): Stream
```

Recover from a stream failure by calling a function to create a new Stream.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#recoverwith
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|f|Function||Function returning a new stream from an error|
|source|Stream||Source stream|
**Returns** `Stream` 


## multicast

```ts
 multicast(source: Stream): Stream
```

Returns a Stream equivalent to the original but which can be shared more<br>efficiently among multiple consumers.

::: tip see
https://mostcore.readthedocs.io/en/latest/api.html#multicast
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|source|Stream||Source stream|
**Returns** `Stream` 


## click

```ts
 click(node: HTMLElement, capture: Boolean): Stream
```

Create a stream of DOM Click events

::: tip see
https://github.com/mostjs/dom-event
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|node|HTMLElement||DOM Node|
|capture|Boolean|false|use capture|
**Returns** `Stream` 


## dblclick

```ts
 dblclick(node: HTMLElement, capture: Boolean): Stream
```

Create a stream of DOM dblclick events

::: tip see
https://github.com/mostjs/dom-event
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|node|HTMLElement||DOM Node|
|capture|Boolean|false|use capture|
**Returns** `Stream` 


## mousedown

```ts
 mousedown(node: HTMLElement, capture: Boolean): Stream
```

Create a stream of DOM mousedown events

::: tip see
https://github.com/mostjs/dom-event
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|node|HTMLElement||DOM Node|
|capture|Boolean|false|use capture|
**Returns** `Stream` 


## mouseup

```ts
 mouseup(node: HTMLElement, capture: Boolean): Stream
```

Create a stream of DOM mouseup events

::: tip see
https://github.com/mostjs/dom-event
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|node|HTMLElement||DOM Node|
|capture|Boolean|false|use capture|
**Returns** `Stream` 


## mousemove

```ts
 mousemove(node: HTMLElement, capture: Boolean): Stream
```

Create a stream of DOM mousemove events

::: tip see
https://github.com/mostjs/dom-event
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|node|HTMLElement||DOM Node|
|capture|Boolean|false|use capture|
**Returns** `Stream` 


## mouseover

```ts
 mouseover(node: HTMLElement, capture: Boolean): Stream
```

Create a stream of DOM mouseover events

::: tip see
https://github.com/mostjs/dom-event
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|node|HTMLElement||DOM Node|
|capture|Boolean|false|use capture|
**Returns** `Stream` 


## mouseenter

```ts
 mouseenter(node: HTMLElement, capture: Boolean): Stream
```

Create a stream of DOM mouseenter events

::: tip see
https://github.com/mostjs/dom-event
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|node|HTMLElement||DOM Node|
|capture|Boolean|false|use capture|
**Returns** `Stream` 


## mouseout

```ts
 mouseout(node: HTMLElement, capture: Boolean): Stream
```

Create a stream of DOM mouseout events

::: tip see
https://github.com/mostjs/dom-event
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|node|HTMLElement||DOM Node|
|capture|Boolean|false|use capture|
**Returns** `Stream` 


## mouseleave

```ts
 mouseleave(node: HTMLElement, capture: Boolean): Stream
```

Create a stream of DOM mouseleave events

::: tip see
https://github.com/mostjs/dom-event
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|node|HTMLElement||DOM Node|
|capture|Boolean|false|use capture|
**Returns** `Stream` 


## touchcancel

```ts
 touchcancel(node: HTMLElement, capture: Boolean): Stream
```

Create a stream of DOM touchcancel events

::: tip see
https://github.com/mostjs/dom-event
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|node|HTMLElement||DOM Node|
|capture|Boolean|false|use capture|
**Returns** `Stream` 


## touchend

```ts
 touchend(node: HTMLElement, capture: Boolean): Stream
```

Create a stream of DOM touchend events

::: tip see
https://github.com/mostjs/dom-event
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|node|HTMLElement||DOM Node|
|capture|Boolean|false|use capture|
**Returns** `Stream` 


## touchmove

```ts
 touchmove(node: HTMLElement, capture: Boolean): Stream
```

Create a stream of DOM touchmove events

::: tip see
https://github.com/mostjs/dom-event
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|node|HTMLElement||DOM Node|
|capture|Boolean|false|use capture|
**Returns** `Stream` 


## touchstart

```ts
 touchstart(node: HTMLElement, capture: Boolean): Stream
```

Create a stream of DOM touchstart events

::: tip see
https://github.com/mostjs/dom-event
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|node|HTMLElement||DOM Node|
|capture|Boolean|false|use capture|
**Returns** `Stream` 


