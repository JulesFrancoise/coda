import { parseParameters, validateStream, withAttr } from '@coda/prelude';
import { multicast } from '@most/core';
import schmitt from './schmitt';
import delta from './delta';
import { sum } from './reduce';
import { mul } from './elementwise';
import wavelet from './wavelet';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  fmin: {
    type: 'float',
    default: 10,
    min: 1e-10,
  },
  threshold: {
    type: 'float',
    default: 40,
  },
  thresholdRelease: {
    type: 'float',
    default: 30,
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
 * Simple multidimensional kick detection using the continuous wavelet
 * transform.
 *
 * We use a wavelet transform to measure the signal's
 * energy in a high frequency range (> 10 Hz). The derivation of the total
 * energy allows us to track rapid changes. Onsets are finally detected using a
 * Schmitt trigger.
 *
 * @param  {Object} [options={}] Kick detection Options
 * @param  {Object} [options.fmin={10}] Minimum frequency for the Wavelet
 * Transform
 * @param  {Object} [options.threshold={40}] Upper Threshold for kick detection
 * @param  {Object} [options.thresholdRelease={30}] Release threshold
 * @param  {Stream} source       Source Stream (scalar or vector)
 * @return {Stream}              Binary Kick detection stream
 */
export default function kicks(options = {}, source) {
  validateStream('kicks', specification, source.attr);
  const params = parseParameters(definitions, options);
  let energy = sum(wavelet({
    bandsPerOctave: 8,
    carrier: 2,
    frequencyMin: params.fmin,
    optimisation: 'standard2',
  }, source));
  energy = withAttr(energy.attr)(multicast(energy));
  return mul(
    schmitt({ up: params.threshold, down: params.thresholdRelease }, delta({}, energy)),
    energy,
  );
}
