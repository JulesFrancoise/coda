import { parseParameters } from '@coda/prelude';
import BaseAudioEffect from '../core/effect';
import tuna from '../lib/tuna';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  intensity: {
    type: 'float',
    default: 0.3,
    min: 0,
    max: 1,
  },
  rate: {
    type: 'float',
    default: 4,
    min: 0.001,
  },
  stereoPhase: {
    type: 'float',
    default: 0,
    min: 0,
    max: 180,
  },
};

/**
 * Tremolo audio effect
 * @private
 * @extends BaseAudioEffect
 *
 * @property {Number|Stream<Number>} intensity   Intensity
 * @property {Number|Stream<Number>} rate        Rate
 * @property {Number|Stream<Number>} stereoPhase Stereo Phase (deg)
 */
class Tremolo extends BaseAudioEffect {
  /**
   * @param {Object} [options={}]            Effect options
   * @param {Number} [options.intensity=0.3] intensity
   * @param {Number} [options.rate=4]        Rate
   * @param {Number} [options.stereoPhase=0] Stereo Phase (deg)
   */
  constructor(options) {
    super();
    this.tremolo = new tuna.Tremolo(options);
    this.input.connect(this.tremolo);
    this.tremolo.connect(this.wetNode);
    this.defineParameter('intensity', options.intensity, (x) => {
      this.tremolo.intensity = x;
    });
    this.defineParameter('rate', options.rate, (x) => {
      this.tremolo.rate = x;
    });
    this.defineParameter('stereoPhase', options.stereoPhase, (x) => {
      this.tremolo.stereoPhase = x;
    });
  }
}

/**
 * Create a Tremolo effect
 *
 * Based on the Tuna Audio effect library: https://github.com/Theodeus/tuna/
 *
 * @param {Object} [options={}]            Effect options
 * @param {Number} [options.intensity=0.3] intensity
 * @param {Number} [options.rate=4]        Rate
 * @param {Number} [options.stereoPhase=0] Stereo Phase (deg)
 * @return {Tremolo} Tremolo engine
 */
export default function tremolo(options = {}) {
  const opts = parseParameters(definitions, options);
  return new Tremolo(opts);
}
