import { parseParameters, validateStream, withAttr } from '@coda/prelude';
import { map } from '@most/core';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  inmin: {
    type: 'float',
    default: 0,
  },
  inmax: {
    type: 'float',
    default: 1,
  },
  outmin: {
    type: 'float',
    default: 0,
  },
  outmax: {
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
function scaleValue(inmin, inmax, outmin, outmax) {
  return x => outmin + ((outmax - outmin) * ((x - inmin) / (inmax - inmin)));
}

/**
 * Scale a vector
 * @ignore
 */
function scaleVector(inmin, inmax, outmin, outmax) {
  return v => v.map(scaleValue(inmin, inmax, outmin, outmax));
}

/**
 * The `scale` operator scales an incoming stream of scalar or vector values
 * given input and output min/max bounds.
 *
 * @param  {Object} [options={}]       Scaling options
 * @param  {Number} [options.inmin=0]  Minimum of the range of the input
 * @param  {Number} [options.inmax=1]  Maximum of the range of the input
 * @param  {Number} [options.outmin=0] Minimum of the range of the output
 * @param  {Number} [options.outmax=1] Maximum of the range of the output
 * @param  {Stream} source             Input stream
 * @return {Stream}                    Scaled stream
 *
 * @example
 * a = periodic(50).rand();
 * b = a.scale({ outmin: -1, outmax: 3 });
 * c = pack([a, b]).plot();
 */
export default function scale(options = {}, source) {
  const attr = validateStream('scale', specification, source.attr);
  const params = parseParameters(definitions, options);
  const scaleFunc = (attr.format === 'scalar') ? scaleValue : scaleVector;
  const f = scaleFunc(params.inmin, params.inmax, params.outmin, params.outmax);
  return withAttr(attr)(map(f, source));
}
