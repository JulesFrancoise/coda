import { map } from '@most/core';
import validateStream from '../../lib/common/validation';
import withAttr from '../../lib/common/mixins';

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
  type: {
    transform() {
      return 'dB';
    },
  },
};

/**
 * The `dbtoa` operator converts a stream of scalar or vector values from
 * deciBels to amplitude.
 *
 * @param  {Stream} source Input stream (dB values)
 * @return {Stream}  Scaled stream (amplitude values)
 */
export default function dbtoa(source) {
  const attr = validateStream('dbtoa', specification, source.attr);
  const func = (attr.format === 'scalar') ?
    db => 10 ** (db / 20) :
    x => x.map(db => 10 ** (db / 20));
  return withAttr(attr)(map(func, source));
}
