import { validateStream, withAttr } from '@coda/prelude';
import { map } from '@most/core';

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
  type: {
    transform() {
      return 'dB';
    },
  },
};

/**
 * The `atob` operator converts a stream of scalar or vector values from
 * amplitude to deciBels.
 *
 * @param {Stream} source Input stream (amplitude values)
 * @return {Stream} Scaled stream (dB values)
 *
 * @example
 * db = now([0, 0.5, 1])
 *   .tap(x => console.log(`Amplitude: [${x}]`))
 *   .atodb()
 *   .tap(x => console.log(`deciBels: [${x}]`));
 */
export default function atodb(source) {
  const attr = validateStream('atodb', specification, source.attr);
  const func = (attr.format === 'scalar')
    ? a => 20 * Math.log10(a)
    : x => x.map(a => 20 * Math.log10(a));
  return withAttr(attr)(map(func, source));
}
