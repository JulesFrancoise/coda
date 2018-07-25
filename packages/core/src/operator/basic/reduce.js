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
 */
export function sum(source) {
  return reduce((s, x) => s + x, 0, source);
}

/**
 * Multiply the elements of each frame of a vector stream
 *
 * @param  {Stream} source Source vector stream
 * @return {Stream}        Scalar stream (product of the vector values)
 */
export function prod(source) {
  return reduce((s, x) => s * x, 1, source);
}

/**
 * Compute the minimum of each frame of a vector stream
 *
 * @param  {Stream} source Source vector stream
 * @return {Stream}        Scalar stream (frame minimum)
 */
export function min(source) {
  return reduce((s, x) => Math.min(s, x), +Infinity, source);
}

/**
 * Compute the maximum of each frame of a vector stream
 *
 * @param  {Stream} source Source vector stream
 * @return {Stream}        Scalar stream (frame maximum)
 */
export function max(source) {
  return reduce((s, x) => Math.max(s, x), -Infinity, source);
}

/**
 * Compute the minimum and maximum of each frame of a vector stream
 *
 * @param  {Stream} source Source vector stream
 * @return {Stream}        Scalar stream ([min, max])
 */
export function minmax(source) {
  return reduce(
    (s, x) => [Math.min(s[0], x), Math.max(s[1], x)],
    [+Infinity, -Infinity],
    source,
  );
}
