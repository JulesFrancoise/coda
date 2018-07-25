import { map, multicast } from '@most/core';
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
    check: ['vector'],
    transform() {
      return 'scalar';
    },
  },
  size: {
    required: true,
    check: { min: 1 },
    transform() {
      return 1;
    },
  },
};

/**
 * Unpack a stream of vectors to a vector of scalar streams.
 *
 * @param  {Stream} [source] Input stream (vectorial)
 * @return {Array}   Array of scalar streams
 *
 * @example
 * import * from 'mars';
 *
 * const [s1, s2, s3] = periodic(100).rand({ size: 3 }).unpack();
 * runEffects(s1.tap(log).take(10), newDefaultScheduler());
 * runEffects(s2.tap(log).take(10), newDefaultScheduler());
 * runEffects(s3.tap(log).take(10), newDefaultScheduler());
 */
export default function unpack(source) {
  const attr = validateStream('unpack', specification, source.attr);
  const s = multicast(source);
  return Array.from(
    new Array(source.attr.size),
    (_, i) => withAttr(attr)(map(x => x[i], s)),
  );
}
