import { validateStream, withAttr } from '@coda/prelude';
import { map } from '@most/core';

/**
 * Stream I/O Attributes Specification
 * @ignore
 */
const specification = {
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
 * Apply a reducer to each frame of a vector stream
 *
 * @param  {Function} reducer Reducer function
 * @param  {*}        initial initial value
 * @param  {Stream}   source  Source vector stream
 * @return {Stream}           Scalar stream
 *
 * @example
 * r = now([1, 2, 3])
 *   .reduce((s, x) => s + x, 0)
 *   .tap(console.log);
 */
export default function reduce(reducer, initial, source) {
  const attr = validateStream('reduce', specification, source.attr);
  return withAttr(attr)(map(frame => frame.reduce(reducer, initial), source));
}

/**
 * Sum the elements of each frame of a vector stream
 *
 * @param  {Stream} source Source vector stream
 * @return {Stream}        Scalar stream (sum of the vector values)
 *
 * @example
 * s = now([1, 2, 3]).sum().tap(console.log);
 */
export function sum(source) {
  return reduce((s, x) => s + x, 0, source);
}

/**
 * Multiply the elements of each frame of a vector stream
 *
 * @param  {Stream} source Source vector stream
 * @return {Stream}        Scalar stream (product of the vector values)
 *
 * @example
 * s = now([1, 2, 3]).prod().tap(console.log);
 */
export function prod(source) {
  return reduce((s, x) => s * x, 1, source);
}

/**
 * Compute the minimum of each frame of a vector stream
 *
 * @param  {Stream} source Source vector stream
 * @return {Stream}        Scalar stream (frame minimum)
 *
 * @example
 * s = now([1, 2, 3, -4]).min().tap(console.log);
 */
export function min(source) {
  return reduce((s, x) => Math.min(s, x), +Infinity, source);
}

/**
 * Compute the maximum of each frame of a vector stream
 *
 * @param  {Stream} source Source vector stream
 * @return {Stream}        Scalar stream (frame maximum)
 *
 * @example
 * s = now([1, 2, 3, -4]).max().tap(console.log);
 */
export function max(source) {
  return reduce((s, x) => Math.max(s, x), -Infinity, source);
}

/**
 * Compute the minimum and maximum of each frame of a vector stream
 *
 * @param  {Stream} source Source vector stream
 * @return {Stream}        Scalar stream \(\[min, max\]\)
 *
 * @example
 * s = now([1, 2, 3, -4]).minmax().tap(console.log);
 */
export function minmax(source) {
  return withAttr({ format: 'vector', size: 2 })(reduce(
    (s, x) => [Math.min(s[0], x), Math.max(s[1], x)],
    [+Infinity, -Infinity],
    source,
  ));
}

/**
 * Compute the norm of a vector
 *
 * @param  {Stream} source Source vector stream
 * @return {Stream}        Scalar stream (norm)
 *
 * @example
 * s = now([1, 2, 3]).norm().tap(console.log);
 */
export function norm(source) {
  return withAttr({ format: 'scalar', size: 1 })(map(x => Math.sqrt(x), reduce(
    (s, x) => s + (x ** 2),
    0,
    source,
  )));
}
