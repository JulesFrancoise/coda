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
    default: 0.0045,
  },
};

/**
 * Chorus audio effect
 */
class Chorus extends BaseAudioEffect {
  constructor(options) {
    super();
    this.chorus = new tuna.Chorus(options);
    this.input.connect(this.chorus);
    this.chorus.connect(this.wet);
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
 * @param  {Object} [options={}] Chorus parameters
 * @return {Chorus}              Chorus engine
 */
export default function chorus(options = {}) {
  const opts = parseParameters(definitions, options);
  return new Chorus(opts);
}
