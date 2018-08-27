import { parseParameters } from '@coda/prelude';
import { audioContext } from 'waves-audio';
import BaseAudioEffect from '../core/effect';
import tuna from '../lib/tuna';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  bits: {
    type: 'integer',
    default: 16,
    min: 1,
    max: 16,
  },
  normfreq: {
    type: 'float',
    default: 0.1,
    min: 0,
    max: 1,
  },
  bufferSize: {
    type: 'integer',
    default: 4096,
    min: 256,
    max: 16384,
  },
};

/**
 * Bitcrusher audio effect
 */
class Bitcrusher extends BaseAudioEffect {
  constructor(options) {
    super();
    this.bitcrusher = new tuna.Bitcrusher(options);
    this.input.connect(this.bitcrusher);
    this.bitcrusher.connect(audioContext.destination);
    this.defineParameter('bits', options.bits, (x) => {
      this.bitcrusher.bits = x;
    });
    this.defineParameter('normfreq', options.normfreq, (x) => {
      this.bitcrusher.normfreq = x;
    });
    this.defineParameter('bufferSize', options.bufferSize, (x) => {
      this.bitcrusher.bufferSize = x;
    });
  }
}

/**
 * Create a Bitcrusher effect
 *
 * @param  {Object} [options={}] Bitcrusher parameters
 * @return {Bitcrusher}              Bitcrusher engine
 */
export default function bitcrusher(options = {}) {
  const opts = parseParameters(definitions, options);
  return new Bitcrusher(opts);
}
