import { parseParameters, withAttr, validateStream } from '@coda/prelude';
import { switchLatest, map, tap } from '@most/core';
import line from './line';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  duration: {
    type: 'float',
    default: 1000,
  },
  period: {
    type: 'float',
    default: 10,
  },
};

/**
 * Stream I/O Attributes Specification
 * @ignore
 */
const specification = sr => ({
  format: {
    required: true,
    check: ['scalar', 'vector'],
    transform() {
      return 'scalar';
    },
  },
  size: {
    required: true,
    check: { min: 1, max: 2 },
    transform() {
      return 1;
    },
  },
  samplerate: {
    required: false,
    transform() {
      return sr;
    },
  },
});

/**
 * Generate an infinite data stream of various ramps triggered from an input stream.
 * The input stream can be scalar, in this case each event specifies the target value
 * and the line duration is fixed, or it can be a vector stream with two values,
 * the target value and the ramp duration.
 *
 * @param  {Object} [options={}] Line options
 * @param  {Number} [options.duration=1000] Duration in ms
 * @param  {Number} [options.period=10] Sampling period in ms
 * @param  {Stream} source Source stream
 * @return {Stream} Finite stream
 */
export default function lineto(options = {}, source) {
  const {
    duration,
    period,
  } = parseParameters(definitions, options);
  const sr = 1000 / period;
  const attr = validateStream('lineto', specification(sr), source.attr);
  let value = 0;
  let f;
  if (source.attr.format === 'scalar') {
    f = (x) => {
      const l = tap(
        (y) => { value = y; },
        line({ start: value, end: x, duration }),
      );
      return l;
    };
  } else {
    f = (x) => {
      const l = tap(
        (y) => { value = y; },
        line({ start: value, end: x[0], duration: x[1] }),
      );
      return l;
    };
  }
  return withAttr(attr)(switchLatest(map(f, source)));
}
