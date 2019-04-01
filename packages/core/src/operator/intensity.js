import { parseParameters, validateStream, withAttr } from '@coda/prelude';
import { map } from '@most/core';
import delta from './delta';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  feedback: {
    type: 'float',
    default: 0.9,
    min: 0,
    max: 1,
  },
  gain: {
    type: 'float',
    default: 0.2,
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


function createScalarAccumulator(feedback, gain) {
  let history = 0;
  return function accumulator(x) {
    const y = Math.abs(x) + history;
    history = feedback * y;
    return (y * gain) ** 2;
  };
}

function createVectorAccumulator(size, feedback, gain) {
  const history = Array.from(Array(size), () => 0);
  const y = Array.from(Array(size), () => 0);
  return function accumulator(x) {
    let res = 0;
    x.forEach((xi, i) => {
      y[i] = Math.abs(xi) + history[i];
      history[i] = feedback * y[i];
      res += (y[i] * gain * 0.01) ** 2;
    });
    return res;
  };
}

/**
 * Compute the intensity of the motion from accelerometer signals
 *
 * @param  {Object} [options] Intensity calculation options
 * @param  {String} [options.feedback=0.9] Feedback rate (higher feedback = slower decay)
 * @param  {String} [options.gain=0.2] gain
 * @param  {Stream} [source] Input stream (scalar or vectorial)
 * @return {Stream} Stream of intensity values (scalar)
 *
 * @example
 * fakeAcc = periodic(10)
 *   .rand({ size: 3 })
 *   .biquad({ f0: 5 })
 *   .plot({ legend: 'accelerometer signal'});
 * intensity = fakeAcc.intensity().plot({ legend: 'Intensity' });
 */
export default function intensity(options = {}, source) {
  const attr = validateStream('intensity', specification, source.attr);
  const params = parseParameters(definitions, options);
  const f = (source.attr.format === 'scalar')
    ? createScalarAccumulator(params.feedback, params.gain)
    : createVectorAccumulator(source.attr.size, params.feedback, params.gain);
  return withAttr(attr)(map(f, delta({ size: 3 }, source)));
}
