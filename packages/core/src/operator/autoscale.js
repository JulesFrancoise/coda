import { validateStream } from '@coda/prelude';

/**
 * Stream I/O Attributes Specification
 * @ignore
 */
const specification = {
  format: {
    required: true,
    check: ['scalar', 'vector'],
  },
  size: {
    required: true,
    check: { min: 1 },
  },
};

/**
 * @ignore
 */
class AutoScaleScalarSink {
  /**
   * @param {Object} sink  Event sink
   */
  constructor(sink) {
    /**
     * event sink
     * @type {Object}
     */
    this.sink = sink;
    /**
     * Current minimum bound of the input stream
     * @type {Number}
     */
    this.inmin = +Infinity;
    /**
     * Current maximum bound of the input stream
     * @type {Number}
     */
    this.inmax = -Infinity;
  }

  /**
   * Propagate a scaled value, guaranteeing that the output range is always [0; 1]
   * @param  {Number} t Timestamp
   * @param  {Number} x value
   */
  event(t, x) {
    if (x > this.inmax) this.inmax = x;
    if (x < this.inmin) this.inmin = x;
    if (this.inmin >= this.inmax) {
      this.sink.event(t, 0);
    } else {
      const y = (x - this.inmin) / (this.inmax - this.inmin);
      this.sink.event(t, y);
    }
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
 * @ignore
 */
class AutoScaleVectorSink {
  /**
   * @param {Object} sink  Event sink
   */
  constructor(size, sink) {
    /**
     * event sink
     * @type {Object}
     */
    this.sink = sink;
    /**
     * Current minimum bound of the input stream
     * @type {Number}
     */
    this.inmin = Array.from(Array(size), () => +Infinity);
    /**
     * Current maximum bound of the input stream
     * @type {Number}
     */
    this.inmax = Array.from(Array(size), () => -Infinity);
  }

  /**
   * Propagate a scaled value, guaranteeing that the output range is always [0; 1]
   * @param  {Number} t Timestamp
   * @param  {Number} x value
   */
  event(t, x) {
    const y = x.map((v, i) => {
      if (v > this.inmax[i]) this.inmax[i] = v;
      if (v < this.inmin[i]) this.inmin[i] = v;
      return (this.inmin[i] < this.inmax[i])
        ? (v - this.inmin[i]) / (this.inmax[i] - this.inmin[i])
        : 0;
    });
    this.sink.event(t, y);
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
 * Automatically scale an incoming stream of scalar or vector values to the
 * \[0; 1\] range.
 *
 * @param  {Stream} source             Input stream
 * @return {Stream}                    Scaled stream
 *
 * @example
 * const source = periodic(200).rand().scale({ outmin: -30, outmax: 200 });
 * const scaled = source.autoscale().tap(console.log);
 */
export default function autoscale(source) {
  const attr = validateStream('autoscale', specification, source.attr);
  if (attr.format === 'vector') {
    return {
      attr,
      run(sink, scheduler) {
        return source.run(new AutoScaleVectorSink(attr.size, sink), scheduler);
      },
    };
  }
  return {
    attr,
    run(sink, scheduler) {
      return source.run(new AutoScaleScalarSink(sink), scheduler);
    },
  };
}
