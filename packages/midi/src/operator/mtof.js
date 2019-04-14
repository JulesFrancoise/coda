import { validateStream, withAttr } from '@coda/prelude';
import { map } from '@most/core';

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
 * The `mtof` operator converts a stream of scalar or vector values from midi
 * to frequency scale.
 * @constructor
 * @param  {Stream} source             Input stream (midi values)
 * @return {Stream}                    Scaled stream (frequency values)
 */
export default function mtof(source) {
  const attr = validateStream('mtof', specification, source.attr);
  const func = (attr.format === 'scalar')
    ? m => 27.5 * (2 ** ((m - 21) / 12))
    : x => x.map(m => 27.5 * (2 ** ((m - 21) / 12)));
  return withAttr(attr)(map(func, source));
}
