import { validateStream, parseParameters, CircularBuffer } from '@coda/prelude';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  duration: {
    required: true,
    type: 'float',
    default: 15,
  },
  refresh: {
    required: true,
    type: 'float',
    default: 1,
  },
};

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
  samplerate: {
    required: false,
    check: { min: 1 },
    transform(s) {
      return s || 100;
    },
  },
};


/**
 * @ignore
 */
class AdaptiveScaleSink {
  /**
   * @param  {Object} params     parameters
   * @param  {Number} samplerate Sampling rate
   * @param {Object} sink        Event sink
   */
  constructor(params, attr, sink) {
    /**
     * event sink
     * @type {Object}
     */
    this.sink = sink;
    /**
     * Sampling rate
     * @type {Number}
     */
    this.samplerate = attr.samplerate;
    /**
     * duration of the sample (seconds)
     * @type {Number}
     */
    this.duration = params.duration;
    /**
     * refresh (seconds)
     * @type {Number}
     */
    this.refresh = params.refresh;
    this.windowsSize = this.duration * this.samplerate;
    this.skip = this.refresh * this.samplerate;
    this.buffer = new CircularBuffer(this.windowsSize);
    this.eventIndex = 0;
    this.updateMinMax = (attr.format === 'scalar')
      ? this.updateMinMaxScalar
      : this.updateMinMaxVector;
    this.eventIndex = 0;
    this.scaleValue = (attr.format === 'scalar')
      ? this.scaleScalar
      : this.scaleVector;
    this.size = attr.size;
  }

  /**
   * @param  {Number} t Timestamp
   * @param  {Number} x value
   */
  event(t, x) {
    this.buffer.push(x);
    if (this.eventIndex === 0) {
      this.updateMinMax();
    }
    this.eventIndex += 1;
    this.eventIndex %= this.skip;
    const y = this.scaleValue(x);
    this.sink.event(t, y);
  }

  updateMinMaxScalar() {
    this.min = +Infinity;
    this.max = -Infinity;
    this.buffer.forEach((val) => {
      if (val < this.min) this.min = val;
      if (val > this.max) this.max = val;
    });
    if (this.min === this.max) {
      this.min = 0;
      this.max = 1;
    }
  }

  updateMinMaxVector() {
    this.min = Array.from(Array(this.size), () => (+Infinity));
    this.max = Array.from(Array(this.size), () => (-Infinity));
    this.buffer.forEach((data) => {
      data.forEach((val, i) => {
        if (val < this.min[i]) this.min[i] = val;
        if (val > this.max[i]) this.max[i] = val;
      });
    });
    this.min.forEach((val, i) => {
      if (val === this.max[i]) {
        this.min[i] = 0;
        this.max[i] = 1;
      }
    });
  }

  scaleScalar(x) {
    return Math.min(1, (x - this.min) / (this.max - this.min));
  }

  scaleVector(x) {
    return x.map((val, i) => ((val - this.min[i]) / (this.max[i] - this.min[i])));
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
 * Automatically scale an incoming stream of scalar or vector values over the X previous
 * seconds to the \[0; 1\] range.
 *
 * @param  {Object} [options={}] Adaptive scaling Options
 * @param  {Scalar} [options.duration=15] Duration (s) of the sliding window on which to
 * compute the min/max bounds
 * @param  {Scalar} [options.refresh=1] Refresh duration (s) to compute min/max
 * @param  {Stream} source Input stream
 * @return {Stream} Scaled stream
 *
 * @example
 * // Generate a random signal and apply adaptive scaling
 * a = periodic(10)
 *   .rand({size : 2})
 *   .biquad({ f0: 1 })
 *   .plot()
 *   .adaptive({ duration: 10, refresh: 2 })
 *   .plot();

 */
export default function adaptive(options = {}, source) {
  const attr = validateStream('adaptive', specification, source.attr);
  const params = parseParameters(definitions, options);
  return {
    attr,
    run(sink, scheduler) {
      return source.run(new AdaptiveScaleSink(params, attr, sink), scheduler);
    },
  };
}
