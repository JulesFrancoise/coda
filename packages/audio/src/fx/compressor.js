import { parseParameters } from '@coda/prelude';
import BaseAudioEffect from '../core/effect';
import tuna from '../lib/tuna';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  threshold: {
    type: 'float',
    default: -1,
    min: -100,
    max: 0,
  },
  makeupGain: {
    type: 'float',
    default: 1,
    min: 0,
  },
  attack: {
    type: 'float',
    default: 1,
    min: 0,
  },
  release: {
    type: 'float',
    default: 0,
    min: 0,
  },
  ratio: {
    type: 'float',
    default: 4,
    min: 0,
    max: 20,
  },
  knee: {
    type: 'float',
    default: 5,
    min: 0,
    max: 40,
  },
  automakeup: {
    type: 'boolean',
    default: true,
  },
};

/**
 * Compressor audio effect
 */
class Compressor extends BaseAudioEffect {
  constructor(options) {
    super();
    this.compressor = new tuna.Compressor(options);
    this.input.connect(this.compressor);
    this.compressor.connect(this.wet);
    this.defineParameter('threshold', options.threshold, (x) => {
      this.compressor.threshold = x;
    });
    this.defineParameter('makeupGain', options.makeupGain, (x) => {
      this.compressor.makeupGain = x;
    });
    this.defineParameter('attack', options.attack, (x) => {
      this.compressor.attack = x;
    });
    this.defineParameter('release', options.release, (x) => {
      this.compressor.release = x;
    });
    this.defineParameter('ratio', options.ratio, (x) => {
      this.compressor.ratio = x;
    });
    this.defineParameter('knee', options.knee, (x) => {
      this.compressor.knee = x;
    });
    this.defineParameter('automakeup', options.automakeup, (x) => {
      this.compressor.automakeup = x;
    });
  }
}

/**
 * Create a Compressor effect
 *
 * @param  {Object} [options={}] Compressor parameters
 * @return {Compressor}              Compressor engine
 */
export default function compressor(options = {}) {
  const opts = parseParameters(definitions, options);
  return new Compressor(opts);
}
