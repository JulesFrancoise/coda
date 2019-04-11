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
    min: 0,
    max: 8,
  },
  feedback: {
    type: 'float',
    default: 0.4,
    min: 0,
    max: 1,
  },
  depth: {
    type: 'float',
    default: 0.7,
    min: 0,
    max: 1,
  },
  delay: {
    type: 'float',
    default: 0.0045,
    // default: 0.45,
    min: 0,
    max: 1,
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
   * @param {Number} [options.feedback=0.4] Feedback level
   * @param {Number} [options.depth=0.7]    Feedback level
   * @param {Number} [options.delay=0.0045] Delay time (s)
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
    this.defineParameter('depth', options.depth, (x) => {
      this.chorus.depth = x;
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
 * @param {Number} [options.feedback=0.4] Feedback level
 * @param {Number} [options.depth=0.7]    Feedback level
 * @param {Number} [options.delay=0.0045] Delay time (s)
 * @return {Chorus} Chorus engine
 */
export default function chorus(options = {}) {
  const opts = parseParameters(definitions, options);
  return new Chorus(opts);
}
