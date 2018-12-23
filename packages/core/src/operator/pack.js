import { validateStream, withAttr } from '@coda/prelude';
import { sample } from '@most/core';
import pak from './pak';

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
 * Pack a vector of scalar streams to a stream of vectors.
 *
 * @param  {Array<Stream>} sources Input streams (scalar)
 * @return {Stream}   Stream of concatenated values
 *
 * @example
 * a = periodic(100).constant(2);
 * b = periodic(100).rand();
 * c = pack([a, b]).plot();
 */
export default function pack(sources) {
  const attr = validateStream('pack', specification, sources[0].attr);
  sources.slice(1).forEach((source) => {
    validateStream('pack', specification, source.attr);
  });
  attr.size = sources.length;
  return withAttr(attr)(sample(pak(sources), sources[0]));
}
