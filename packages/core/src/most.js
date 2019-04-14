import { Stream, withAttr } from '@coda/prelude';
import * as most from '@most/core';
import { domEvent } from '@most/dom-event';

/**
 * Create a Stream containing no events and ends immediately.
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#empty
 */
export const empty = () => (
  new Stream(withAttr({})(most.empty()))
);

/**
 * Create a Stream containing no events and never ends.
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#never
 */
export const never = () => (
  new Stream(withAttr({})(most.never()))
);

/**
 * Create a Stream containing a single event at time 0.
 * @param  {*} x event data
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#now
 *
 * @example
 * // Log the array [1, 2] to the console right away
 * a = now([1, 2]).tap(log)
 */
export const now = (x) => {
  const attr = {};
  if (typeof x === 'number') {
    attr.format = 'scalar';
    attr.size = 1;
  } else if (Array.isArray(x) && x.length > 0 && typeof x[0] === 'number') {
    attr.format = 'vector';
    attr.size = x.length;
  }
  return new Stream(withAttr(attr)(most.now(x)));
};

/**
 * Create a Stream containing a single event at a specific time.
 * @param  {Number} t time
 * @param  {*} x event data
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#at
 *
 * @example
 * // Log the array [1, 2] to the console after 1 second
 * a = at(1000, [1, 2]).tap(log)
 */
export const at = (t, x) => {
  const attr = {};
  if (typeof x === 'number') {
    attr.format = 'scalar';
    attr.size = 1;
  } else if (x instanceof Array && x.length > 0 && typeof x[0] === 'number') {
    attr.format = 'vector';
    attr.size = x.length;
  }
  return new Stream(withAttr(attr)(most.at(t, x)));
};

/**
 * Create an infinite Stream containing events that occur at a specified
 * Period. The first event occurs at time 0, and the event values are
 * `undefined`.
 * @param  {Number} period period (ms)
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#periodic
 *
 * @example
 * // Generate a periodic signal with 500 ms interval and randomize the stream values.
 * a = periodic(500).map(() => Math.random()).tap(log);
 */
export const periodic = period => (
  new Stream(withAttr({ samplerate: 1000 / period })(most.periodic(period)))
);

/**
 * Create a Stream that fails with the provided Error at time 0. This can be
 * useful for functions that need to return a Stream and also need to propagate
 * an error.
 * @param  {Error} error Error
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#throwerror
 */
export const throwError = error => (
  new Stream(withAttr({})(most.throwError(error)))
);

/**
 * Prepend an event at time 0.
 * @param  {*} x Event data
 * @param  {Stream} source Source Stream
 * @return {Stream} The source stream starting with the start element
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#startwith
 */
export const startWith = (x, source) => {
  const attr = {};
  if (typeof x === 'number') {
    attr.format = 'scalar';
    attr.size = 1;
  } else if (x instanceof Array && x.length > 0 && typeof x[0] === 'number') {
    attr.format = 'vector';
    attr.size = x.length;
  }
  return new Stream(withAttr(source.attr)(most.startWith(x, source)));
};

/**
 * Replace the end of a Stream with another Stream. When `stream` ends, `f`
 * will be called and must return a Stream.
 *
 * @param  {Function} f Function that returns a stream
 * @param  {Stream} source Source Stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html?highlight=continuewith#cont}inuewit
 */
export const continueWith = (f, source) => (
  new Stream(withAttr(source.attr)(most.continueWith(f, source)))
);

/**
 * Apply a function to each event value.
 *
 * @param  {Function} f    Unary function
 * @param  {Stream} source Source stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#map
 *
 * @example
 * // Apply a function (in this example, double) to all events in a stream
 * f = x => 2 * x;
 * a = periodic(500).constant(1).accum()
 *   .map(f)
 *   .tap(log)
 */
export const map = (f, source) => (
  new Stream(withAttr(source.attr)(most.map(f, source)))
);

/**
 * Replace each event value with x.
 *
 * @param  {*} x           event data
 * @param  {Stream} source Source stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#constant
 */
export const constant = (x, source) => {
  const attr = { ...source.attr };
  if (typeof x === 'number') {
    attr.format = 'scalar';
    attr.size = 1;
  } else if (x instanceof Array && x.length > 0 && typeof x[0] === 'number') {
    attr.format = 'vector';
    attr.size = x.length;
  }
  return new Stream(withAttr(attr)(most.constant(x, source)));
};

/**
 * Perform a side effect for each event in a Stream. For each event in stream,
 * `f` is called, but the value of its result is ignored. If `f` fails (i.e.,
 * throws an error), then the returned Stream will also fail. The Stream
 * returned by tap will contain the same events as the original Stream.
 *
 * @param  {Function} f    Tap function
 * @param  {Stream} source Source stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#tap
 * @example
 * // Apply a function with side effects, to log the values to the console
 * a = periodic(500).rand().tap(log);
 */
export const tap = (f, source) => (
  new Stream(withAttr(source.attr)(most.tap(f, source)))
);

/**
 * Apply the latest function in a Stream of functions to the latest value of
 * another Stream. In effect, ap applies a time-varying function to a
 * time-varying value.
 *
 * @param  {Stream<Function>} fs     Function stream
 * @param  {Stream}           source Source stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#ap
 */
export const ap = (fs, source) => (
  new Stream(withAttr(source.attr)(most.ap(fs, source)))
);

/**
 * Incrementally accumulate results, starting with the provided initial value.
 *
 * @param  {Function} f       Scanning reducer
 * @param  {*}        initial Initial Value
 * @param  {Stream}   source  Source stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#scan
 *
 * @example
 * // Accumulate the values of a constant stream
 * a = periodic(500).constant(2)
 *   .scan((s, x) => s + x, 0)
 *   .tap(log);
 */
export const scan = (f, initial, source) => (
  new Stream(withAttr(source.attr)(most.scan(f, initial, source)))
);

/**
 * Accumulate results using a feedback loop that emits one value and feeds back
 * another to be used in the next iteration.
 *
 * It allows you to maintain and update a “state” (a.k.a. feedback, a.k.a. seed
 * for the next iteration) while emitting a different value. In contrast, scan
 * feeds back and produces the same value.
 *
 * @param  {Function} stepper Stepper function
 * @param  {*}        seed    Seed
 * @param  {Stream}   source  Source stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#loop
 */
export const loop = (stepper, seed, source) => (
  new Stream(withAttr(source.attr)(most.loop(stepper, seed, source)))
);

/**
 * Replace each event value with the array item at the respective index. The
 * resulting Stream will contain the same number of events as the input Stream,
 * or array.length events, whichever is less.
 *
 * @param  {Array}  items  Items array
 * @param  {Stream} source Source stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#withitems
 */
export const withItems = (items, source) => (
  new Stream(withAttr(source.attr)(most.withItems(items, source)))
);

/**
 * Apply a function to the latest event and the array value at the respective
 * index. The resulting Stream will contain the same number of events as the
 * input Stream, or array.length events, whichever is less.
 *
 * @param  {Function} f      Combinator function
 * @param  {Array}    items  Items
 * @param  {Stream}   source Source stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#zipitems
 */
export const zipItems = (f, items, source) => (
  new Stream(withAttr(source.attr)(most.zipItems(f, items, source)))
);

/**
 * Given a higher-order Stream, return a new Stream that adopts the behavior of
 * (i.e., emits the events of) the most recent inner Stream.
 *
 * @param  {Stream} source higher-order stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#switchlatest
 */
export const switchLatest = source => (
  new Stream(withAttr(source.attr)(most.switchLatest(source)))
);

/**
 * Given a higher-order Stream, return a new Stream that merges all the inner
 * Streams as they arrive.
 *
 * @param  {Stream} source higher-order Stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#join
 */
export const join = source => (
  new Stream(withAttr(source.attr)(most.join(source)))
);

/**
 * Transform each event in `stream` into a new Stream, and then merge each into
 * the resulting Stream. Note that `f` must return a Stream.
 * @param  {Function} f      function returning a stream
 * @param  {Stream}   source Source stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#chain
 */
export const chain = (f, source) => (
  new Stream(withAttr(source.attr)(most.chain(f, source)))
);

/**
 * Transform each event in `stream` into a Stream, and then concatenate each
 * onto the end of the resulting Stream. Note that `f` must return a Stream.
 *
 * The mapping function `f` is applied lazily. That is, `f` is called only once
 * it is time to concatenate a new stream.
 *
 * @param  {Function} f      Function returning a stream
 * @param  {Stream}   source Source stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#concatmap
 */
export const concatMap = (f, source) => (
  new Stream(withAttr(source.attr)(most.concatMap(f, source)))
);

/**
 * Given a higher-order Stream, return a new Stream that merges inner Streams
 * as they arrive up to the specified concurrency. Once concurrency number of
 * Streams are being merged, newly arriving Streams will be merged after an
 * existing one ends.
 *
 * @param  {Number} concurrency concurrency level
 * @param  {Stream} source      Higher-order stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#mergeconcurrently
 */
export const mergeConcurrently = (concurrency, source) => (
  new Stream(withAttr(source.attr)(most.mergeConcurrently(concurrency, source)))
);

/**
 * Lazily apply a function `f` to each event in a Stream, merging them into the
 * resulting Stream at the specified concurrency. Once concurrency number of
 * Streams are being merged, newly arriving Streams will be merged after an
 * existing one ends.
 *
 * @param  {Function} f           Unary function
 * @param  {Number}   concurrency concurrency level
 * @param  {Stream} source        event stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#mergemapconcurrently
 */
export const mergeMapConcurrently = (f, concurrency, source) => (
  new Stream(withAttr(source.attr)(most.mergeMapConcurrently(f, concurrency, source)))
);

/**
 * Create a new Stream containing events from two Streams.
 *
 * Merging creates a new Stream containing all events from the two original
 * Streams without affecting the time of the events. You can think of the
 * events from the input Streams simply being interleaved into the new, merged
 * Stream. A merged Stream ends when all of its input Streams have ended.
 *
 * @param  {Stream} stream1 Event stream 1
 * @param  {Stream} source  Event stream 2
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#merge
 *
 * @example
 * a = periodic(500).take(3).constant('a');
 * b = periodic(100).take(3).constant(2);
 * c = a.merge(b).tap(log);
 */
export const merge = (stream1, source) => (
  new Stream(withAttr(source.attr)(most.merge(stream1, source)))
);

/**
 * Apply a function to the most recent event from each Stream when a new event
 * arrives on any Stream.
 *
 * Note that `combine` waits for at least one event to arrive on all input
 * Streams before it produces any events.
 *
 * @param  {Function} f     Combinator function
 * @param  {Stream} stream1 Event stream 1
 * @param  {Stream} source  Event stream 2
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#combine
 */
export const combine = (f, stream1, source) => (
  new Stream(withAttr(source.attr)(most.combine(f, stream1, source)))
);

/**
 * Apply a function to corresponding pairs of events from the inputs Streams.
 *
 * @param  {Function} f     Combinator function
 * @param  {Stream} stream1 Event stream 1
 * @param  {Stream} source  Event stream 2
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#zip
 */
export const zip = (f, stream1, source) => (
  new Stream(withAttr(source.attr)(most.zip(f, stream1, source)))
);

/**
 * For each event in a sampler Stream, replace the event value with the latest
 * value in another Stream. The resulting Stream will contain the same number
 * of events as the sampler Stream.
 *
 * @param  {Stream} source  value stream
 * @param  {Stream} sampler Sampler stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#sample
 *
 * @example
 * // Sample a noise signal from a stream of click events
 * noise = periodic(20).rand().plot({ legend: 'noise' });
 * click = click(doc).sample(noise).tap(log);
 */
export const sample = (source, sampler) => {
  const ss = new Stream(withAttr(source.attr)(most.sample(source, sampler)));
  if (ss.attr.samplerate) delete ss.attr.samplerate;
  if (sampler.attr.samplerate) {
    ss.attr.samplerate = sampler.attr.samplerate;
  }
  return ss;
};


/**
 * Like `sample`, but the value stream and sampler streams are switched
 *
 * @param  {Stream} sampler Sampler stream
 * @param  {Stream} source  value stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#sample
 *
 * @example
 * // Sample a noise signal from a stream of click events
 * noise = periodic(20).rand().plot({ legend: 'noise' });
 * click = noise.resample(click(doc)).tap(log);
 */
export const resample = (sampler, source) => {
  const ss = new Stream(withAttr(source.attr)(most.sample(source, sampler)));
  if (ss.attr.samplerate) delete ss.attr.samplerate;
  if (sampler.attr.samplerate) {
    ss.attr.samplerate = sampler.attr.samplerate;
  }
  return ss;
};

/**
 * For each event in a sampler Stream, apply a function to combine its value
 * with the most recent event value in another Stream. The resulting Stream
 * will contain the same number of events as the sampler Stream.
 *
 * @param  {Function} f      Snapshot function
 * @param  {Stream}   values Value stream
 * @param  {Stream}   source Source stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#snapshot
 */
export const snapshot = (f, values, source) => (
  new Stream(withAttr(source.attr)(most.snapshot(f, values, source)))
);

/**
 * Retain only events for which a predicate is truthy.
 *
 * @param  {Function} p    Predicate
 * @param  {Stream} source Source event stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#filter
 * @example
 * a = periodic(200).rand().filter(x => x > 0.8).tap(log);
 */
export const filter = (p, source) => (
  new Stream(withAttr(source.attr)(most.filter(p, source)))
);

/**
 * Remove adjacent repeated events.
 *
 * @param  {Stream} source Source event stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#skiprepeats
 */
export const skipRepeats = source => (
  new Stream(withAttr(source.attr)(most.skipRepeats(source)))
);

/**
 * Remove adjacent repeated events, using the provided equality function to
 * compare adjacent events.
 * @param  {Function} equals Equality function
 * @param  {Stream} source   Source event stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#skiprepeatswith
 */
export const skipRepeatsWith = (equals, source) => (
  new Stream(withAttr(source.attr)(most.skipRepeatsWith(equals, source)))
);

/**
 * Keep only events in a range, where start <= index < end, and index is the
 * ordinal index of an event in `stream`.
 *
 * @param  {Number} start  start index
 * @param  {Number} end    end index
 * @param  {Stream} source Source event stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#id48
 */
export const slice = (start, end, source) => (
  new Stream(withAttr(source.attr)(most.slice(start, end, source)))
);

/**
 * Keep at most the first n events from `stream`.
 *
 * @param  {Number} n      Number of events
 * @param  {Stream} source Source event stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#take
 */
export const take = (n, source) => (
  new Stream(withAttr(source.attr)(most.take(n, source)))
);

/**
 * Discard the first n events from stream.
 *
 * @param  {Number} n      Number of events
 * @param  {Stream} source Source event stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#skip
 */
export const skip = (n, source) => (
  new Stream(withAttr(source.attr)(most.skip(n, source)))
);

/**
 * Keep all events until predicate returns `false`, and discard the rest.
 *
 * @param  {Function} p      Predicate
 * @param  {Stream}   source Source event stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#takewhile
 */
export const takeWhile = (p, source) => (
  new Stream(withAttr(source.attr)(most.takeWhile(p, source)))
);

/**
 * Discard all events until predicate returns `false`, and keep the rest.
 *
 * @param  {Function} p      Predicate
 * @param  {Stream}   source Source event stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#skipwhile
 */
export const skipWhile = (p, source) => (
  new Stream(withAttr(source.attr)(most.skipWhile(p, source)))
);

/**
 * Discard all events after the first event for which predicate returns true.
 *
 * @param  {Function} p      Predicate
 * @param  {Stream}   source Source event stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#skipafter
 */
export const skipAfter = (p, source) => (
  new Stream(withAttr(source.attr)(most.skipAfter(p, source)))
);

/**
 * Keep all events in one Stream until the first event occurs in another.
 *
 * @param  {Stream} endSignal End signal
 * @param  {Stream} source    Source stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#until
 */
export const until = (endSignal, source) => (
  new Stream(withAttr(source.attr)(most.until(endSignal, source)))
);

/**
 * Discard all events in one Stream until the first event occurs in another.
 *
 * @param  {Stream} startSignal Start signal
 * @param  {Stream} source      Source stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#since
 */
export const since = (startSignal, source) => (
  new Stream(withAttr(source.attr)(most.since(startSignal, source)))
);

/**
 * Keep events that occur during a time window defined by a higher-order Stream.
 *
 * @param  {Stream} timeWindow Higher order stream defining a time window
 * @param  {Stream} source Source stream
 * @return {Stream}
 */
export const during = (timeWindow, source) => (
  new Stream(withAttr(source.attr)(most.during(timeWindow, source)))
);

/**
 * Timeshift a Stream by the specified Delay.
 *
 * @param  {Number} delayTime Delay time (ms)
 * @param  {Stream} source Source stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#id57
 */
export const delay = (delayTime, source) => (
  new Stream(withAttr(source.attr)(most.delay(delayTime, source)))
);

/**
 * Create a Stream with localized Time values, whose origin (i.e., time 0) is
 * at the specified Time on the Scheduler provided when the Stream is observed
 * with runEffects or run.
 *
 * When implementing custom higher-order Stream combinators, such as chain, you
 * should use `withLocalTime` to localize “inner” Streams before running them.
 *
 * @param  {Number} origin origin time value
 * @param  {Stream} source Source stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#withlocaltime
 */
export const withLocalTime = (origin, source) => (
  new Stream(withAttr(source.attr)(most.withLocalTime(origin, source)))
);

/**
 * Limit the rate of events by suppressing events that occur too often
 *
 * @param  {Number} period Throttle period
 * @param  {Stream} source Source stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#throttle
 */
export const throttle = (period, source) => (
  new Stream(withAttr(source.attr)(most.throttle(period, source)))
);

/**
 * Wait for a burst of events to subside and keep only the last event in the
 * burst.
 *
 * If the Stream ends while there is a pending debounced event (e.g., via
 * until), the pending event will occur just before the Stream ends.
 *
 * @param  {Number} period Debounce period
 * @param  {Stream} source Source stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#debounce
 */
export const debounce = (period, source) => (
  new Stream(withAttr(source.attr)(most.debounce(period, source)))
);

/**
 * Create a Stream containing a promise’s value.
 *
 * @param  {Promise} promise [description]
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#frompromise
 */
export const fromPromise = promise => (
  new Stream(withAttr({})(most.fromPromise(promise)))
);

/**
 * Turn a Stream of promises into a Stream containing the promises’ values.
 *
 * @param  {Stream} source Stream of promises
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#awaitpromises
 */
export const awaitPromises = source => (
  new Stream(withAttr({})(most.awaitPromises(source)))
);

/**
 * Recover from a stream failure by calling a function to create a new Stream.
 *
 * @param  {Function} f    Function returning a new stream from an error
 * @param  {Stream} source Source stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#recoverwith
 */
export const recoverWith = (f, source) => (
  new Stream(withAttr(source.attr)(most.recoverWith(f, source)))
);

/**
 * Returns a Stream equivalent to the original but which can be shared more
 * efficiently among multiple consumers.
 *
 * @param  {Stream} source Source stream
 * @return {Stream}
 *
 * @see https://mostcore.readthedocs.io/en/latest/api.html#multicast
 */
export const multicast = source => (
  new Stream(withAttr(source.attr)(most.multicast(source)))
);

/**
 * Utility function for Most DomEvent streams
 * @ignore
 *
 * @param  {String}      eventType DOM Event type
 * @param  {HTMLElement} node      DOM Node
 * @param  {[type]} capture   [description]
 * @return {[type]}           [description]
 */
function createPointerStream(eventType, node, capture) {
  const n = (node instanceof HTMLDocument) ? node.body : node;
  const { width, height } = n.getBoundingClientRect();
  return new Stream(withAttr({
    type: 'position',
    format: 'vector',
    size: 2,
  })(most.map(
    e => [e.clientX / width, e.clientY / height],
    domEvent(eventType, node, capture),
  )));
}

/**
 * Create a stream of DOM Click events
 *
 * @param  {HTMLElement}  node       DOM Node
 * @param  {Boolean} [capture=false] use capture
 * @return {Stream}
 *
 * @see https://github.com/mostjs/dom-event
 */
export const click = (node, capture = false) => (
  createPointerStream('click', node, capture)
);

/**
 * Create a stream of DOM dblclick events
 *
 * @param  {HTMLElement}  node       DOM Node
 * @param  {Boolean} [capture=false] use capture
 * @return {Stream}
 *
 * @see https://github.com/mostjs/dom-event
 */
export const dblclick = (node, capture = false) => (
  createPointerStream('dblclick', node, capture)
);

/**
 * Create a stream of DOM mousedown events
 *
 * @param  {HTMLElement}  node       DOM Node
 * @param  {Boolean} [capture=false] use capture
 * @return {Stream}
 *
 * @see https://github.com/mostjs/dom-event
 */
export const mousedown = (node, capture = false) => (
  createPointerStream('mousedown', node, capture)
);

/**
 * Create a stream of DOM mouseup events
 *
 * @param  {HTMLElement}  node       DOM Node
 * @param  {Boolean} [capture=false] use capture
 * @return {Stream}
 *
 * @see https://github.com/mostjs/dom-event
 */
export const mouseup = (node, capture = false) => (
  createPointerStream('mouseup', node, capture)
);

/**
 * Create a stream of DOM mousemove events
 *
 * @param  {HTMLElement}  node       DOM Node
 * @param  {Boolean} [capture=false] use capture
 * @return {Stream}
 *
 * @see https://github.com/mostjs/dom-event
 */
export const mousemove = (node, capture = false) => (
  createPointerStream('mousemove', node, capture)
);

/**
 * Create a stream of DOM mouseover events
 *
 * @param  {HTMLElement}  node       DOM Node
 * @param  {Boolean} [capture=false] use capture
 * @return {Stream}
 *
 * @see https://github.com/mostjs/dom-event
 */
export const mouseover = (node, capture = false) => (
  createPointerStream('mouseover', node, capture)
);

/**
 * Create a stream of DOM mouseenter events
 *
 * @param  {HTMLElement}  node       DOM Node
 * @param  {Boolean} [capture=false] use capture
 * @return {Stream}
 *
 * @see https://github.com/mostjs/dom-event
 */
export const mouseenter = (node, capture = false) => (
  createPointerStream('mouseenter', node, capture)
);

/**
 * Create a stream of DOM mouseout events
 *
 * @param  {HTMLElement}  node       DOM Node
 * @param  {Boolean} [capture=false] use capture
 * @return {Stream}
 *
 * @see https://github.com/mostjs/dom-event
 */
export const mouseout = (node, capture = false) => (
  createPointerStream('mouseout', node, capture)
);

/**
 * Create a stream of DOM mouseleave events
 *
 * @param  {HTMLElement}  node       DOM Node
 * @param  {Boolean} [capture=false] use capture
 * @return {Stream}
 *
 * @see https://github.com/mostjs/dom-event
 */
export const mouseleave = (node, capture = false) => (
  createPointerStream('mouseleave', node, capture)
);

/**
 * Create a stream of DOM touchstart events
 *
 * @param  {HTMLElement}  node       DOM Node
 * @param  {Boolean} [capture=false] use capture
 * @return {Stream}
 *
 * @see https://github.com/mostjs/dom-event
 */
export const touchstart = (node, capture = false) => (
  createPointerStream('touchstart', node, capture)
);

/**
 * Create a stream of DOM touchend events
 *
 * @param  {HTMLElement}  node       DOM Node
 * @param  {Boolean} [capture=false] use capture
 * @return {Stream}
 *
 * @see https://github.com/mostjs/dom-event
 */
export const touchend = (node, capture = false) => (
  createPointerStream('touchend', node, capture)
);

/**
 * Create a stream of DOM touchmove events
 *
 * @param  {HTMLElement}  node       DOM Node
 * @param  {Boolean} [capture=false] use capture
 * @return {Stream}
 *
 * @see https://github.com/mostjs/dom-event
 */
export const touchmove = (node, capture = false) => (
  createPointerStream('touchmove', node, capture)
);

/**
 * Create a stream of DOM touchcancel events
 *
 * @param  {HTMLElement}  node       DOM Node
 * @param  {Boolean} [capture=false] use capture
 * @return {Stream}
 *
 * @see https://github.com/mostjs/dom-event
 */
export const touchcancel = (node, capture = false) => (
  createPointerStream('touchcancel', node, capture)
);
