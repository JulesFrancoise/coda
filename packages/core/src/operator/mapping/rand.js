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
 * values uniformally distributed over \[0; 1\].
 *
 * @param  {Object} [options={}]       Scaling options
 * @param  {Number} [options.size=1]   Dimension of the output stream
 * @param  {Stream} source             Input stream
 * @return {Stream}                    Scaled stream
 *
 * @example
 * randValues = periodic(500).rand().tap(console.log);
 * noise = periodic(10).rand({ size: 3 }).plot();
 */
export default function rand(options = {}, source) {
  const params = parseParameters(definitions, options);
  const attr = validateStream('rand', specification(params), source.attr);
  const f = (attr.format === 'scalar') ? Math.random : randVect(params.size);
  return withAttr(attr)(map(f, source));
}
