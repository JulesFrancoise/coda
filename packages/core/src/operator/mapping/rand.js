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
const specification = params => ({
  format: {
    required: false,
    transform() {
      return params.size > 1 ? 'vector' : 'scalar';
    },
  },
  size: {
    required: false,
    transform() {
      return params.size;
    },
  },
});

/**
 * Generate a random vector
 * @ignore
 */
function randVect(n) {
  const arr = new Array(n).fill(null);
  return () => arr.map(Math.random);
}

/**
 * The rand operator generates a stream of scalars or vectors with random
 * values uniformally distributed over [0; 1].
 *
 * @param  {Object} [options={}]       Scaling options
 * @param  {Number} [options.dim=1]    Dimension of the output stream
 * @param  {Stream} source             Input stream
 * @return {Stream}                    Scaled stream
 *
 * @example
 * import * from 'mars';
 *
 * const process = periodic(100).rand().tap(log);
 * runEffects(process.take(10), newDefaultScheduler());
 */
export default function rand(options = {}, source) {
  const params = parseParameters(definitions, options);
  const attr = validateStream('rand', specification(params), source.attr);
  const f = (attr.format === 'scalar') ? Math.random : randVect(params.size);
  return withAttr(attr)(map(f, source));
}
