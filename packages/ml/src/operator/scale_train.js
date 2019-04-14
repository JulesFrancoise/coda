import { getContainer, validateStream } from '@coda/prelude';

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
 * ScaleLearn scaler Sink
 * @private
 */
class ScaleLearnScalarSink {
  constructor(containerId, sink) {
    /**
     * event sink
     * @type {Object}
     */
    this.sink = sink;
    /**
     * Current minimum
     * @type {Number}
     */
    this.min = +Infinity;
    /**
     * Current maximum
     * @type {Number}
     */
    this.max = -Infinity;

    this.container = getContainer(containerId);
  }

  event(t, x) {
    if (x.type !== 'record' || x.value) return;
    this.min = +Infinity;
    this.max = -Infinity;
    Object.keys(this.container.buffers).forEach((bufferIndex) => {
      const buffer = this.container.buffers[bufferIndex];
      buffer.data.forEach((val) => {
        if (val < this.min) this.min = val;
        if (val > this.max) this.max = val;
      });
    });
    this.sink.event(t, { min: this.min, max: this.max });
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
 * ScaleLearn vector Sink
 * @private
 */
class ScaleLearnVectorSink {
  constructor(containerId, size, sink) {
    /**
     * event sink
     * @type {Object}
     */
    this.sink = sink;
    /**
     * Current minimum and maximum
     * @type {Number}
     */
    this.minmax = Array.from(
      Array(this.size),
      () => ({ min: +Infinity, max: -Infinity }),
    );
    this.size = size;
    this.container = getContainer(containerId);
  }

  event(t, x) {
    if (x.type !== 'record' || x.value) return;
    this.minmax = Array.from(
      Array(this.size),
      () => ({ min: +Infinity, max: -Infinity }),
    );
    // { min: +Infinity,  max: -Infinity }
    Object.keys(this.container.buffers).forEach((bufferIndex) => {
      const buffer = this.container.buffers[bufferIndex];
      buffer.data.forEach((data) => {
        data.forEach((val, i) => {
          if (val < this.minmax[i].min) this.minmax[i].min = val;
          if (val > this.minmax[i].max) this.minmax[i].max = val;
        });
      });
    });
    this.sink.event(t, this.minmax);
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
 * Return the extremum values of a recorder stream
 *
 * @param  {Stream} source Recorder source
 * @return {Stream} Scalar stream ([min, max])
 */
export default function scaleTrain(source) {
  const attr = validateStream('scaleTrain', specification, source.attr);
  if (attr.format === 'vector') {
    return {
      attr,
      run(sink, scheduler) {
        return source.run(
          new ScaleLearnVectorSink(source.attr.containerId, attr.size, sink),
          scheduler,
        );
      },
    };
  }
  return {
    attr,
    run(sink, scheduler) {
      return source.run(new ScaleLearnScalarSink(source.attr.containerId, sink), scheduler);
    },
  };
}
