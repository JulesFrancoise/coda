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
};

/**
 * The `ftom` operator converts a stream of scalar or vector values from frequency
 * to scale.
 *
 * @param  {Stream} source             Input stream (frequency values)
 * @return {Stream}                    Scaled stream (midi values)
 */
export default function ftom(source) {
  const attr = validateStream('ftom', specification, source.attr);
  const func = (attr.format === 'scalar') ?
    f => 69 + (12 * Math.log2(f / 440)) :
    x => x.map(f => 69 + (12 * Math.log2(f / 440)));
  return withAttr(attr)(map(func, source));
}
