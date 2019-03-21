import { parseParameters } from '@coda/prelude';
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
 *
 * @augments BaseAudioEffect
 *
 * @property {Number|Stream<Number>} bits Number of bits (decimation)
 * @property {Number|Stream<Number>} normfreq Normalized downsampling frequency
 * @property {Number|Stream<Number>} bufferSize Buffer size
 *
 * @param {Object} options                   Effect options
 * @param {Number} [options.bits=16]         Number of bits (decimation)
 * @param {Number} [options.normfreq=0.1]    Normalized downsampling frequency
 * @param {Number} [options.bufferSize=4096] Buffer size
 */
class Bitcrusher extends BaseAudioEffect {
  constructor(options) {
    super();
    this.bitcrusher = new tuna.Bitcrusher(options);
    this.input.connect(this.bitcrusher);
    this.bitcrusher.connect(this.wetNode);
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
 * Create a Bitcrusher audio effect.
 *
 * Based on the Tuna Audio effect library: https://github.com/Theodeus/tuna/
 *
 * @augments Bitcrusher
 * @augments BaseAudioEffect
 *
 * @param  {Object} [options={}]              Bitcrusher parameters
 * @param  {Number} [options.bits=16]         Number of bits (decimation)
 * @param  {Number} [options.normfreq=0.1]    Normalized downsampling frequency
 * @param  {Number} [options.bufferSize=4096] Buffer size
 * @return {Bitcrusher}                       Bitcrusher engine
 */
export default function bitcrusher(options = {}) {
  const opts = parseParameters(definitions, options);
  return new Bitcrusher(opts);
}
