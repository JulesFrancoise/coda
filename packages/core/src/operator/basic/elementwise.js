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
 * const a = periodic(100).rand();
 * const b = periodic(100).rand();
 * const norm = (x, y) => Math.sqrt(x * x + y * y);
 * const c = elementwise(norm, a, b).tap(console.log);
 * runEffects(c, newDefaultScheduler());
 *
 */
export default function elementwise(f, first, second) {
  const attr = validateStream('elementwise', specification(), first.attr);
  validateStream('add', specification(attr.format, attr.size), second.attr);
  const fGen = attr.format === 'scalar' ?
    (x, y) => f(y, x) :
    (x, y) => y.map((a, i) => f(a, x[i]));
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
 * const a = periodic(100).rand().biquad({ f0: 0.2 });
 * const b = periodic(100).rand().biquad({ f0: 0.2 });
 * const c = a.add(b).tap(console.log);
 * runEffects(c, newDefaultScheduler());
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
 * const a = periodic(100).rand().biquad({ f0: 0.2 });
 * const b = periodic(100).rand().biquad({ f0: 0.2 });
 * const c = a.sub(b).tap(console.log);
 * runEffects(c, newDefaultScheduler());
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
 */
export function div(first, second) {
  return elementwise((a, b) => a / b, first, second);
}
