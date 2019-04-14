import { parseParameters, validateStream, withAttr } from '@coda/prelude';
import { map } from '@most/core';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  size: {
    type: 'integer',
    default: 3,
    min: 3,
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
 * Factory function for a scalar delta operator
 * @param  {number} filterSize Differentiation filter size
 * @param  {number} samplerate Stream sampling rate
 * @return {function}          Differentiation function
 * @private
 */
function deltaFilterScalar(filterSize, samplerate) {
  const buffer = new Array(filterSize).fill(0);
  const offset = Math.floor(filterSize / 2);
  const weights = Array.from(Array(filterSize), (_, i) => i - offset);
  const norm = samplerate / weights.reduce((sum, x) => sum + (x ** 2), 0);
  let index = 0;
  return (value) => {
    buffer[index] = value;
    index = (index + 1) % filterSize;
    let d = 0;
    for (let i = 0; i < filterSize; i += 1) {
      d += buffer[(i + index) % filterSize] * weights[i];
    }
    return d * norm;
  };
}

/**
 * Factory function for a vector delta operator
 * @param  {number} frameSize  Input vector size
 * @param  {number} filterSize Differentiation filter size
 * @param  {number} samplerate Stream sampling rate
 * @return {function}          Differentiation function
 * @private
 */
function deltaFilterVector(frameSize, filterSize, samplerate) {
  const filters = Array.from(
    Array(frameSize),
    () => deltaFilterScalar(filterSize, samplerate),
  );
  return frame => frame.map((x, i) => filters[i](x));
}

/**
 * The `delta` operator computes a differentiation of an incoming stream of
 * scalar or vector values over a fixed size window. It uses linear regression
 * to estimate the slope of the signal over the given window.
 *
 * @param  {Object} [options={}]       Delta options
 * @param  {Number} [options.size=3]   Window size (should be odd, minimum: 3)
 * @param  {Stream} source             Input stream
 * @return {Stream}                    Scaled stream
 *
 * @example
 * // Compute mouse velocity/acceleration from a resampled version of the mouse position
 * a = mousemove(doc)
 *   .resample(periodic(10))
 *   .mvavrg({ size: 5 })
 *   .plot({ legend: 'Mouse Position'})
 *   .delta({ size: 5 })
 *   .plot({ legend: 'Mouse velocity' })
 *   .delta({ size: 5 })
 *   .plot({ legend: 'Mouse acceleration' });
 */
export default function delta(options = {}, source) {
  const attr = validateStream('delta', specification, source.attr);
  const params = parseParameters(definitions, options);
  if (params.size % 2 === 0) params.size -= 1;
  const f = (attr.format === 'scalar')
    ? deltaFilterScalar(params.size, attr.samplerate || 1)
    : deltaFilterVector(attr.size, params.size, attr.samplerate || 1);
  return withAttr(attr)(map(f, source));
}
