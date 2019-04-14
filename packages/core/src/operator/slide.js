import { validateStream, parseParameters } from '@coda/prelude';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  size: {
    type: 'integer',
    default: 1,
  },
  hop: {
    type: 'integer',
    default: 1,
  },
};

/**
 * Stream I/O Attributes Specification
 * @ignore
 */
const specification = size => ({
  format: {
    required: true,
    check: ['scalar', 'vector'],
    transform(f) {
      return (f === 'scalar' ? 'vector' : 'array');
    },
  },
  size: {
    required: true,
    check: { min: 1 },
    transform(s) {
      return s * size;
    },
  },
});

/**
 * Sliding window sink
 * @private
 */
class SlidingWindowSink {
  /**
   * Constructor
   * @param  {number} windowSize Window Size (samples)
   * @param  {number} hopSize    Hop Size (samples)
   * @param  {object} sink       sink
   * @return {object}            sink
   */
  constructor(windowSize, hopSize, sink) {
    /** window size */
    this.windowSize = windowSize;
    /** hop size */
    this.hopSize = hopSize;
    /** sink */
    this.sink = sink;
    /** index of the current iteration */
    this.iteration = 0;
    /** data buffer */
    this.buffer = [];
  }

  /**
   * Propagate an event
   * @param  {number} t   event timestamp
   * @param  {anything} x event value
   */
  event(t, x) {
    this.buffer.push(x);
    if (this.buffer.length > this.windowSize) {
      this.buffer.shift();
    }
    if (this.iteration % this.hopSize === 0) {
      this.sink.event(t, [...this.buffer]);
    }
    this.iteration += 1;
    this.iteration %= this.hopSize;
  }

  /**
   * Terminate the stream
   * @param  {number} t   event timestamp
   */
  end(t) {
    return this.sink.end(t);
  }

  /**
   * Propagate an error on the stream
   * @param  {number} t   event timestamp
   * @param  {Error} e    Error message
   */
  error(t, e) {
    return this.sink.error(t, e);
  }
}

/**
 * Compute a sliding window on a scalar or vector stream
 *
 * @param  {Object} [options] Sliding Window options
 * @param  {Number} [options.size=1] Sliding Window size in frames
 * @param  {Number} [options.hop=1]  Hop size in frames
 * @param  {Stream} [source] Input stream (scalar or vectorial)
 * @return {Stream}          Stream of sliding windows
 *
 * @example
 * noise = periodic(100).rand().take(10);
 * w = noise.slide({ size: 4 }).tap(log)
 */
export default function slide(options, source) {
  const params = parseParameters(definitions, options);
  const attr = validateStream('slide', specification(params.size), source.attr);
  const { size, hop } = params;
  return {
    attr,
    run(sink, scheduler) {
      return source.run(new SlidingWindowSink(size, hop, sink), scheduler);
    },
  };
}
