import { validateStream, withAttr } from '@coda/prelude';
import { combineArray } from '@most/core';

/**
 * Stream I/O Attributes Specification
 * @ignore
 */
const specification = {
  /**
   * Stream data format: ['vector']
   * @type {Object}
   */
  format: {
    required: true,
    check: ['scalar'],
    transform() {
      return 'vector';
    },
  },
  size: {
    required: true,
    check(v) {
      return v === 1;
    },
  },
};

/**
 * Pack a vector of scalar streams to a stream of vectors. This operator is similar to `pack`
 * except that it triggers an event when an event occurs on any of the incoming streams.
 *
 * @param  {Array<Stream>} sources Input streams (scalar)
 * @return {Stream}   Stream of concatenated values
 *
 * @example
 * a = periodic(200).rand();
 * b = periodic(10).rand();
 * c = pak([a, b]).plot();
 */
export default function pak(sources) {
  const attr = validateStream('pak', specification, sources[0].attr);
  sources.slice(1).forEach((source) => {
    validateStream('pak', specification, source.attr);
  });
  attr.size = sources.length;
  const combinator = (...arr) => arr.reduce((x, y) => x.concat([y]), []);
  return withAttr(attr)(combineArray(combinator, sources));
}
