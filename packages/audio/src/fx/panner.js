import { parseParameters } from '@coda/prelude';
import { audioContext } from 'waves-audio';
import BaseAudioEffect from '../core/effect';
import tuna from '../lib/tuna';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  pan: {
    type: 'float',
    default: 0,
    min: -1,
    max: 1,
  },
};

/**
 * Panner audio effect
 */
class Panner extends BaseAudioEffect {
  constructor(options) {
    super();
    this.panner = new tuna.Panner(options);
    this.input.connect(this.panner);
    this.panner.connect(audioContext.destination);
    this.defineParameter('pan', options.pan, (x) => {
      this.panner.pan = x;
    });
  }
}

/**
 * Create a Panner effect
 *
 * @param  {Object} [options={}] Panner parameters
 * @return {Panner}              Panner engine
 */
export default function panner(options = {}) {
  const opts = parseParameters(definitions, options);
  return new Panner(opts);
}
