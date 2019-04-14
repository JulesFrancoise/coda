import { validateStream, withAttr } from '@coda/prelude';
import { snapshot } from '@most/core';

/**
 * Stream I/O Attributes Specification
 * @ignore
 */
const specification = (format, size) => ({
  format: {
    required: true,
    check: format ? [format] : ['scalar', 'vector'],
  },
  size: {
    required: true,
    check: size ? s => s === size : { min: 1 },
  },
});

/**
 * Applies an element-wise operator to the values of two stream. Triggers
 * only on events from the main stream.
 *
 * @todo elementwise for a version that triggers from all streams.
 *
 * @param  {Function} f    Binary combinator function (applies to scalars)
 * @param  {Stream} first  The main source stream
 * @param  {Stream} second The secondary stream to combine
 * @return {Stream}        Output stream of combined values
 *
 * @example
 * const norm = (x, y) => Math.sqrt(x * x + y * y);
 * const c = elementwise(norm, now([4, 2]), now([3, 1])).tap(console.log);
 */
export default function elementwise(f, first, second) {
  const attr = validateStream('elementwise', specification(), first.attr);
  validateStream('elementwise', specification(attr.format, attr.size), second.attr);
  const fGen = attr.format === 'scalar'
    ? (x, y) => f(y, x)
    : (x, y) => y.map((a, i) => f(a, x[i]));
  return withAttr(attr)(snapshot(fGen, second, first));
}

/**
 * Adds the values from two streams. Triggers only on events from the first
 * stream.
 *
 * @todo add$ for a version that triggers from all streams.
 *
 * @param  {Stream} first  The main source stream
 * @param  {Stream} second The secondary stream to combine
 * @return {Stream}        Output stream of summed values
 *
 * @example
 * const c = add(now(3), now(2)).tap(console.log);
 * // This is equivalent to:
 * // const c = now(3).add(now(2)).tap(console.log);
 */
export function add(first, second) {
  return elementwise((a, b) => a + b, first, second);
}

/**
 * Subtract the values from two streams. Triggers only on events from the first
 * stream.
 *
 * @todo sub$ for a version that triggers from all streams.
 *
 * @param  {Stream} first  The main source stream
 * @param  {Stream} second The secondary stream to combine
 * @return {Stream}        Output stream of subtracted values
 *
 * @example
 * const c = sub(now(7), now(3)).tap(console.log);
 * // This is equivalent to:
 * // const c = now(7).sub(now(3)).tap(console.log);
 */
export function sub(first, second) {
  return elementwise((a, b) => a - b, first, second);
}

/**
 * Multiply the values from two streams. Triggers only on events from the first
 * stream.
 *
 * @todo mul$ for a version that triggers from all streams.
 *
 * @param  {Stream} first  The main source stream
 * @param  {Stream} second The secondary stream to combine
 * @return {Stream}        Output stream of multiplied values
 *
 * @example
 * const c = mul(now(7), now(3)).tap(console.log);
 * // This is equivalent to:
 * // const c = now(7).mul(now(3)).tap(console.log);
 */
export function mul(first, second) {
  return elementwise((a, b) => a * b, first, second);
}

/**
 * Divides the values of a stream by the values of another stream. Triggers
 * only on events from the first stream.
 *
 * @todo div$ for a version that triggers from all streams.
 *
 * @param  {Stream} first  The main source stream
 * @param  {Stream} second The secondary stream to combine
 * @return {Stream}        Output stream of divided values
 *
 * @example
 * const c = div(now(9), now(2)).tap(console.log);
 * // This is equivalent to:
 * // const c = now(9).div(now(2)).tap(console.log);
 */
export function div(first, second) {
  return elementwise((a, b) => a / b, first, second);
}
