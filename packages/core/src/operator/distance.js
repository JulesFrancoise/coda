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
    transform: () => 'scalar',
  },
  size: {
    required: true,
    check: size ? s => s === size : { min: 1 },
    transform: () => 1,
  },
});

/**
 * Compute the euclidean distance between two points
 *
 * @param  {Stream} first  Vector stream of the first point
 * @param  {Stream} second Vector stream of the second point
 * @return {Stream}        The eucliden distance between the two streams
 *
 */
export default function distance(first, second) {
  validateStream('distance', specification(first.attr.format, first.attr.size), second.attr);
  const attr = validateStream('distance', specification(), first.attr);
  const f = first.attr.format === 'scalar'
    ? (x, y) => Math.abs(y - x)
    : (x, y) => Math.sqrt(y.reduce((s, _, t) => s + ((y[t] - x[t]) * (y[t] - x[t])), 0));
  return withAttr(attr)(snapshot(f, second, first));
}
