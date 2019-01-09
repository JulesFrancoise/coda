import { parseParameters } from '@coda/prelude';
import BaseAudioEffect from '../core/effect';
import tuna from '../lib/tuna';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  rate: {
    type: 'float',
    default: 1.5,
  },
  feedback: {
    type: 'float',
    default: 0.2,
  },
  delay: {
    type: 'float',
    default: 0.45,
  },
};

/**
 * Chorus audio effect
 * @private
 * @extends BaseAudioEffect
 * @property {Number|Stream<Number>} rate Chorus rate (Hz)
 * @property {Number|Stream<Number>} feedback Feedback level
 * @property {Number|Stream<Number>} delay Delay time (s)
 */
class Chorus extends BaseAudioEffect {
  /**
   * @param {Object} options                Effect options
   * @param {Number} [options.rate=1.5]     Chorus rate (Hz)
   * @param {Number} [options.feedback=0.2] Feedback level
   * @param {Number} [options.delay=0.45] Delay time (s)
   */
  constructor(options) {
    super();
    /**
     * Chorus engine (from the Tuna library)
     * @type {tuna.Chorus}
     */
    this.chorus = new tuna.Chorus(options);
    this.input.connect(this.chorus);
    this.chorus.connect(this.wetNode);
    this.defineParameter('rate', options.rate, (x) => {
      this.chorus.rate = x;
    });
    this.defineParameter('feedback', options.feedback, (x) => {
      this.chorus.feedback = x;
    });
    this.defineParameter('delay', options.delay, (x) => {
      this.chorus.delay = x;
    });
  }
}

/**
 * Create a Chorus effect
 *
 * Based on the Tuna Audio effect library: https://github.com/Theodeus/tuna/
 *
 * @param {Object} [options={}]           Effect options
 * @param {Number} [options.rate=1.5]     Chorus rate (Hz)
 * @param {Number} [options.feedback=0.2] Feedback level
 * @param {Number} [options.delay=0.45]   Delay time (s)
 * @return {Chorus} Chorus engine
 */
export default function chorus(options = {}) {
  const opts = parseParameters(definitions, options);
  return new Chorus(opts);
}
