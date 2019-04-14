import { validateStream, withAttr } from '@coda/prelude';
import { scan, skip } from '@most/core';

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
 * Computes the sum of two vectors
 * @ignore
 */
function sumVector(x, y) {
  return x.map((z, i) => z + y[i]);
}

/**
 * Accumulate the values of a scalar or vector stream
 *
 * @param  {Stream} source   Input stream (scalar or vectorial)
 * @return {Stream}          Stream of accumulated values
 *
 * @example
 * // generate a constant unit signal sampled at 1Hz, and accumulate
 * // the results (sliced at 10 iterations)
 * const process = periodic(500)
 *   .constant(1)
 *   .accum()
 *   .take(10)
 *   .tap(log);
 */
export default function accum(source) {
  const attr = validateStream('accum', specification, source.attr);
  const accumFn = (attr.format === 'scalar') ? (x, y) => x + y : sumVector;
  const accumInit = (attr.format === 'scalar')
    ? 0
    : new Array(attr.size).fill(0);
  return withAttr(attr)(skip(1, scan(accumFn, accumInit, source)));
}
