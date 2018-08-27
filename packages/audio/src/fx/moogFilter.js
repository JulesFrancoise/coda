import { parseParameters } from '@coda/prelude';
import { audioContext } from 'waves-audio';
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
 */
class MoogFilter extends BaseAudioEffect {
  constructor(options) {
    super();
    this.moogFilter = new tuna.MoogFilter(options);
    this.input.connect(this.moogFilter);
    this.moogFilter.connect(audioContext.destination);
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
 * @param  {Object} [options={}] MoogFilter parameters
 * @return {MoogFilter}              MoogFilter engine
 */
export default function moogFilter(options = {}) {
  const opts = parseParameters(definitions, options);
  return new MoogFilter(opts);
}
