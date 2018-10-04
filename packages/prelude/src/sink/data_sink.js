import BaseSink from './base_sink';
import validateStream from '../lib/validation';

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
 * Base class for data sink (for scalar or vector streams)
 * @private
 */
export default class DataSink extends BaseSink {
  /**
   * @param {Object} attr        Stream attributes
   * @param {string} attr.format Stream format ('scalar' or 'vector')
   * @param {number} attr.size   Stream size
   * @param {Object} sink        Event sink
   * @param {Object} scheduler   Most scheduler
   */
  constructor(attr, sink, scheduler) {
    super(sink, scheduler);
    this.attr = validateStream('DataStream', specification, attr);
    if (this.attr.format === 'scalar') {
      this.event = this.eventScalar;
    } else {
      this.event = this.eventVector;
    }
  }

  /**
   * Propagate an event (scalar stream processing)
   * @param  {number} t               event timestamp
   * @param  {number} x event value
   */
  eventScalar(t, x) { // eslint-disable-line
    throw new Error('The eventScalar method must be overloaded');
  }

  /**
   * Propagate an event (vector stream processing)
   * @param  {number} t               event timestamp
   * @param  {Array<number>} x event value
   */
  eventVector(t, x) { // eslint-disable-line
    throw new Error('The eventVector method must be overloaded');
  }
}
