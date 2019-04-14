import { validateStream, withAttr } from '@coda/prelude';
import { map } from '@most/core';

/**
 * Stream I/O Attributes Specification
 * @ignore
 */
const specification = numIdx => ({
  format: {
    required: true,
    check: ['scalar', 'vector'],
    transform() {
      return numIdx > 1 ? 'vector' : 'scalar';
    },
  },
  size: {
    required: true,
    check: { min: 1 },
    transform() {
      return numIdx;
    },
  },
});

/**
 * Check if the array of indices is valid given the size of the input stream
 * @ignore
 * @param  {Array} a     Array of indices
 * @param  {number} size Size of the input stream
 * @return {boolean}     whether the indices are valid
 */
function indicesValid(a, size) {
  return a.map(x => (typeof x === 'number') && Math.floor(x) === x && x < size)
    .reduce((b, x) => b && x, true);
}

/**
 * Select the channels of a numeric stream from a set of indices
 *
 * @param  {Number|Array} indices The index or array of indices
 * @param  {Stream} source The input stream (scalar or vector)
 * @return {Stream} The stream of vectors with values at the selected indices
 *
 * @example
 * a = periodic(100).rand({ size: 5 }).plot({ stacked: true });
 * b = a.select([0, 0, 2]).plot({ stacked: true });
 * c = a.select(1).plot();
 */
export default function select(indices, source) {
  const idx = (typeof indices === 'number') ? [indices] : indices;
  const attr = validateStream('select', specification(idx.length), source.attr);
  if (!indicesValid(idx, source.attr.size)) {
    throw new Error('Indices must be an array of integers in the range of the source stream');
  }
  const selectionFunction = (source.attr.format === 'scalar')
    ? frame => idx.map(() => frame)
    : frame => idx.map(i => frame[i]);
  return withAttr(attr)(map(selectionFunction, source));
}
