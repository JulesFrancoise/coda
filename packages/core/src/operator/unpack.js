import { validateStream, withAttr } from '@coda/prelude';
import { map, multicast } from '@most/core';

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
 * @param  {Stream} source Input stream (vectorial)
 * @return {Array}   Array of scalar streams
 *
 * @example
 * s = periodic(20).rand({ size: 2 }).plot({ legend: 'Original Signal'});
 * [s1, s2] = s.unpack();
 * a1 = s1.plot({ legend: 'First channel' });
 * a2 = s2.plot({ legend: 'Second channel' });
 */
export default function unpack(source) {
  const attr = validateStream('unpack', specification, source.attr);
  const s = multicast(source);
  return Array.from(
    new Array(source.attr.size),
    (_, i) => withAttr(attr)(map(x => x[i], s)),
  );
}
