/**
 * Cycle sink: cycles through a given buffer on events from the source stream
 * @ignore
 */
class CycleSink {
  /**
   * @param {Array} buffer Data array to cycle through
   * @param {Object} sink  Event sink
   */
  constructor(buffer, sink) {
    /**
     * Data buffer
     * @type {Array}
     */
    this.buffer = buffer;
    /**
     * event sink
     * @type {Object}
     */
    this.sink = sink;
    /**
     * Current index
     * @type {Number}
     */
    this.index = 0;
  }

  /**
   * Propagate a buffer value on incoming events
   * @param  {Number} t Timestamp
   */
  event(t) {
    this.sink.event(t, this.buffer[this.index]);
    this.index = (this.index + 1) % this.buffer.length;
  }

  /**
   * End the stream
   * @param  {Number} t Timestamp
   * @return {*}
   */
  end(t) {
    return this.sink.end(t);
  }

  /**
   * Propagate an error
   * @param  {Number} t Timestamp
   * @param  {Error}  e Error
   * @return {*}
   */
  error(t, e) {
    return this.sink.error(t, e);
  }
}

/**
 * Normalize the data buffer
 * @ignore
 *
 * @param  {Array|String} buffer [description]
 * @return {Array}               Normalized data buffer
 */
function normalizeBuffer(buffer) {
  let buf;
  if (Array.isArray(buffer)) {
    buf = buffer;
  } else if (typeof buffer === 'string') {
    buf = buffer.split('');
  } else {
    throw new Error('`cycle`: The buffer argument must be either an array or a string of symbols');
  }
  if (buf.length <= 0) {
    throw new Error('`cycle`: The buffer argument must have a non-null length');
  }
  switch (typeof buf[0]) {
    case 'boolean':
      return { buffer: buf, format: 'boolean', size: 1 };
    case 'number':
      return { buffer: buf, format: 'scalar', size: 1 };
    case 'string':
      return { buffer: buf, format: 'string' };
    case 'object':
      if (Array.isArray(buf[0]) && typeof buf[0][0] === 'number') {
        return { buffer: buf, format: 'vector', size: buf[0].length };
      }
      return { buffer: buf, format: 'anything' };
    default:
      return { buffer: buf, format: 'anything' };
  }
}

/**
 * Cycle through a set of symbols. Each event on the input stream will result
 * in an output event sampled from the buffer passed in argument. The buffer
 * can either contain an array or a string.
 *
 * @param {Array|String} buffer Buffer content to cycle through. The buffer
 * should be an Array or a string. If a string is passed as buffer, the cycle
 * iterates over the characters of the string. If an array is passed, the cycle
 * periodically iterates over the values of the array.
 * @param {Stream} source Input stream (trigger)
 * @return {Stream}        Output Stream, sampled from the buffer, with
 * corresponding attributes (e.g. using an array of numbers as a buffer
 * will result in a stream with attributes `{ format: 'scalar', size: 1 }`).
 *
 * @example
 * a = periodic(250)
 *   .cycle(['A2', 'C3', 'A5', 'D1'])
 *   .take(8)
 *   .tap(log);
 */
export default function cycle(buffer, source) {
  const { buffer: buf, ...streamAttr } = normalizeBuffer(buffer);
  const attr = { ...source.attr, ...streamAttr };
  return {
    attr,
    run(sink, scheduler) {
      return source.run(new CycleSink(buffer, sink), scheduler);
    },
  };
}
