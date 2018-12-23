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
 * Compute the mean of the values of a vector stream
 *
 * @param  {Stream} source Source vector stream
 * @return {Stream}        Scalar stream (mean of the vector values)
 *
 * @example
 * m = now([1, 2, 3]).mean().tap(console.log);
 */
export function mean(source) {
  const attr = validateStream('mean', specification, source.attr);
  const f = frame => frame.reduce((s, x) => s + x, 0) / source.attr.size;
  return withAttr(attr)(map(f, source));
}

/**
 * Compute the standard deviation of the values of a vector stream
 *
 * @param  {Stream} source Source vector stream
 * @return {Stream}        Scalar stream (std of the vector values)
 *
 * @example
 * m = now([1, 2, 3]).std().tap(console.log);
 */
export function std(source) {
  const attr = validateStream('std', specification, source.attr);
  const f = (frame) => {
    const m = frame.reduce((s, x) => s + x, 0) / source.attr.size;
    const v = frame.reduce((s, x) => s + ((x - m) ** 2), 0) / source.attr.size;
    return Math.sqrt(v / attr.size);
  };
  return withAttr(attr)(map(f, source));
}

/**
 * Compute the mean and standard deviation of the values of a vector stream
 *
 * @param  {Stream} source Source vector stream
 * @return {Stream}        Scalar stream \(\[mean, std\] of the vector values\)
 *
 * @example
 * m = now([1, 2, 3, 4, 5]).meanstd().tap(console.log);
 */
export function meanstd(source) {
  const attr = validateStream('meanstd', specification, source.attr);
  const f = (frame) => {
    const m = frame.reduce((s, x) => s + x, 0) / source.attr.size;
    const v = frame.reduce((s, x) => s + ((x - m) ** 2), 0) / source.attr.size;
    return [m, Math.sqrt(v / attr.size)];
  };
  return withAttr(attr)(map(f, source));
}
