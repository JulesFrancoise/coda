import { parseParameters } from '@coda/prelude';
import BaseAudioEffect from '../core/effect';
import tuna from '../lib/tuna';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  cutoff: {
    type: 'float',
    default: 0.065,
    min: 0,
    max: 1,
  },
  resonance: {
    type: 'float',
    default: 3.5,
    min: 0,
    max: 4,
  },
  bufferSize: {
    type: 'float',
    default: 4096,
    min: 256,
    max: 16384,
  },
};

/**
 * MoogFilter audio effect
 * @private
 * @extends BaseAudioEffect
 *
 * @property {Number|Stream<Number>} cutoff Cutoff frequency (Hz)
 * @property {Number|Stream<Number>} resonance Filter resonance
 * @property {Number|Stream<Number>} bufferSize Buffer size
 */
class MoogFilter extends BaseAudioEffect {
  /**
   * @param {Object} [options={}] MoogFilter parameters
   * @param {Number} [options.cutoff=0.065] Cutoff frequency (Hz)
   * @param {Number} [options.resonance=3.5] Filter resonance
   * @param {Number} [options.bufferSize=4096] Buffer size
   */
  constructor(options) {
    super();
    this.moogFilter = new tuna.MoogFilter(options);
    this.input.connect(this.moogFilter);
    this.moogFilter.connect(this.wetNode);
    this.defineParameter('cutoff', options.cutoff, (x) => {
      this.moogFilter.cutoff = x;
    });
    this.defineParameter('resonance', options.resonance, (x) => {
      this.moogFilter.resonance = x;
    });
    this.defineParameter('bufferSize', options.bufferSize, (x) => {
      this.moogFilter.bufferSize = x;
    });
  }
}

/**
 * Create a MoogFilter effect
 *
 * Based on the Tuna Audio effect library: https://github.com/Theodeus/tuna/
 *
 * @param  {Object} [options={}] MoogFilter parameters
 * @param  {Number} [options.cutoff=0.065] Cutoff frequency (Hz)
 * @param  {Number} [options.resonance=3.5] Filter resonance
 * @param  {Number} [options.bufferSize=4096] Buffer size
 * @return {MoogFilter} MoogFilter engine
 */
export default function moogFilter(options = {}) {
  const opts = parseParameters(definitions, options);
  return new MoogFilter(opts);
}
