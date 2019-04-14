import { parseParameters } from '@coda/prelude';
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
 * @private
 * @extends BaseAudioEffect
 *
 * @property {Number|Stream<Number>} pan Pan position (-1 < 1)
 */
class Panner extends BaseAudioEffect {
  /**
   * @param {Object} [options={}]    Effect options
   * @param {Number} [options.pan=0] Pan position (-1 < 1)
   */
  constructor(options) {
    super();
    this.panner = new tuna.Panner(options);
    this.input.connect(this.panner);
    this.panner.connect(this.wetNode);
    this.defineParameter('pan', options.pan, (x) => {
      this.panner.pan = x;
    });
  }
}

/**
 * Create a Panner effect
 *
 * Based on the Tuna Audio effect library: https://github.com/Theodeus/tuna/
 *
 * @param {Object} [options={}]    Effect options
 * @param {Number} [options.pan=0] Pan position (-1 < 1)
 * @return {Panner} Panner engine
 */
export default function panner(options = {}) {
  const opts = parseParameters(definitions, options);
  return new Panner(opts);
}
