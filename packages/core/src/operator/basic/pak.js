import { combineArray } from '@most/core';
import validateStream from '../../lib/common/validation';
import withAttr from '../../lib/common/mixins';

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
 * @param  {Array<Stream>} [sources] Input streams (scalar)
 * @return {Stream}   Stream of concatenated values
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
