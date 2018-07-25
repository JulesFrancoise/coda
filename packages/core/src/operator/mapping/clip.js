import { map } from '@most/core';
import parseParameters from '../../lib/common/parameters';
import validateStream from '../../lib/common/validation';
import withAttr from '../../lib/common/mixins';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  min: {
    type: 'float',
    default: 0,
  },
  max: {
    type: 'float',
    default: 1,
  },
};

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
 * Scale a scalar value
 * @ignore
 */
function clipValue(min, max) {
  return x => Math.max(min, Math.min(max, x));
}

/**
 * Scale a vector
 * @ignore
 */
function clipVector(min, max) {
  return v => v.map(clipValue(min, max));
}

/**
 * Clip operator factory function. The scale operator clips an incoming
 * stream of scalar or vector to a given range.
 *
 * @param  {Object} [options={}]       Scaling options
 * @param  {Number} [options.min=0]  Minimum of the range
 * @param  {Number} [options.max=1]  Maximum of the range
 * @param  {Stream} source             Input stream
 * @return {Stream}                    Scaled stream
 */
export default function clip(options = {}, source) {
  const attr = validateStream('clip', specification, source.attr);
  const params = parseParameters(definitions, options);
  const clipFunc = (attr.format === 'scalar') ? clipValue : clipVector;
  const f = clipFunc(params.min, params.max);
  return withAttr(attr)(map(f, source));
}
