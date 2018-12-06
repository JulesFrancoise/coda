import { parseParameters, validateStream, withAttr } from '@coda/prelude';
import { map } from '@most/core';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  size: {
    type: 'integer',
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
 * underlying moving average factory for scalar values
 * @ignore
 * @param  {number} size Size of the moving average filter
 * @return {Function}    Moving average filter function (closure)
 */
function movingAverage(size) {
  const buffer = [];
  let full = false;
  let i = 0;
  let avg = 0;
  return (x) => {
    if (!full) {
      buffer.push(x / size);
      full = buffer.length === size;
      avg = buffer.reduce((s, v) => s + v, 0) * (size / buffer.length);
      return avg;
    }
    avg -= buffer[i];
    buffer[i] = x / size;
    avg += buffer[i];
    i = (i + 1) % size;
    return avg;
  };
}

/**
 * Compute a moving average on a scalar or vector stream
 *
 * @param  {Object} [options] Moving Average Filter options
 * @param  {String} [options.size=1] Size in frames of the moving
 * average filter.
 * @param  {Stream} [source] Input stream (scalar or vectorial)
 * @return {Stream}          Stream of filtered values
 *
 * @example
 * noise = periodic(10).rand().plot();
 * filtered = noise.mvavrg({ size: 20 }).plot();
 */
export default function mvavrg(options, source) {
  const attr = validateStream('mvavrg', specification, source.attr);
  const params = parseParameters(definitions, options);
  let filterFunction;
  if (attr.format === 'scalar') {
    filterFunction = movingAverage(params.size);
  } else {
    const filters = [];
    for (let i = 0; i < attr.size; i += 1) {
      filters.push(movingAverage(params.size));
    }
    filterFunction = frame => frame.map((x, i) => filters[i](x));
  }
  return withAttr(attr)(map(filterFunction, source));
}
