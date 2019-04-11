import { parseParameters, validateStream, withAttr } from '@coda/prelude';
import { multicast } from '@most/core';
import schmitt from './schmitt';
import delta from './delta';
import { mul } from './elementwise';
import intensity from './intensity';

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
  up: {
    type: 'float',
    default: 0.2,
  },
  down: {
    type: 'float',
    default: 0.1,
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
  samplerate: {
    required: true,
    check: { min: 1 },
  },
};

/**
 * Simple multidimensional kick detection.
 *
 * @param  {Object} [options={}] Kick detection Options
 * @param  {Number} [options.feedback=0.9] intensity feedback
 * @param  {Number} [options.gain=0.2] intensity gain
 * @param  {Number} [options.up=40] Upper Threshold for kick detection
 * @param  {Number} [options.down=30] Release threshold
 * @param  {Stream} source Source Stream (scalar or vector)
 * @return {Stream} Binary Kick detection stream
 */
export default function kick(options = {}, source) {
  validateStream('kick', specification, source.attr);
  const {
    feedback,
    gain,
    up,
    down,
  } = parseParameters(definitions, options);
  let energy = intensity({ feedback, gain }, source);
  energy = withAttr(energy.attr)(multicast(energy));
  return withAttr({ format: 'scalar', size: 1 })(mul(
    schmitt({ up, down }, delta({}, energy)),
    energy,
  ));
}
