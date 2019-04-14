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
 * The `dbtoa` operator converts a stream of scalar or vector values from
 * deciBels to amplitude.
 *
 * @param  {Stream} source Input stream (dB values)
 * @return {Stream}  Scaled stream (amplitude values)
 *
 * @example
 * a = now([0, -6, -Infinity])
 *   .tap(x => console.log(`deciBels: [${x}]`))
 *   .dbtoa()
 *   .tap(x => console.log(`Amplitude: [${x}]`));
 */
export default function dbtoa(source) {
  const attr = validateStream('dbtoa', specification, source.attr);
  const func = (attr.format === 'scalar')
    ? db => 10 ** (db / 20)
    : x => x.map(db => 10 ** (db / 20));
  return withAttr(attr)(map(func, source));
}
