import { parseParameters } from '@coda/prelude';
import BaseAudioEffect from '../core/effect';
import tuna from '../lib/tuna';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  frequency: {
    type: 'float',
    default: 440,
    min: 20,
    max: 22050,
  },
  Q: {
    type: 'float',
    default: 1,
    min: 0.001,
    max: 100,
  },
  gain: {
    type: 'float',
    default: 0,
    min: -40,
    max: 40,
  },
  filterType: {
    type: 'enum',
    default: 'lowpass',
    list: [
      'lowpass',
      'highpass',
      'bandpass',
      'lowshelf',
      'highshelf',
      'peaking',
      'notch',
      'allpass',
    ],
  },
};

/**
 * AudioFilter audio effect
 * @private
 * @property {Number|Stream<Number>} frequency  Cutoff Frequency (Hz)
 * @property {Number|Stream<Number>} Q          Q factor (resonance)
 * @property {Number|Stream<Number>} gain       Filter gain
 * @property {String|Stream<String>} filterType Filter type (lowpass, highpass, bandpass, lowshelf,
 * highshelf, peaking, notch, allpass)
 */
class AudioFilter extends BaseAudioEffect {
  /**
   * @param {Object} [options={}]         AudioFilter parameters
   * @param {Number} [options.frequency=440] Cutoff Frequency (Hz)
   * @param {Number} [options.Q=1] Q factor (resonance)
   * @param {Number} [options.gain=0] Filter gain
   * @param {String} [options.filterType='lowpass'] Filter type (lowpass, highpass, bandpass,
   * lowshelf, highshelf, peaking, notch, allpass)
   */
  constructor(options) {
    super();
    this.filt = new tuna.Filter(options);
    this.input.connect(this.filt);
    this.filt.connect(this.wetNode);
    this.defineParameter('frequency', options.frequency, (x) => {
      this.filt.frequency = x;
    });
    this.defineParameter('Q', options.Q, (x) => {
      this.filt.Q = x;
    });
    this.defineParameter('gain', options.gain, (x) => {
      this.filt.gain = x;
    });
    this.defineParameter('filterType', options.filterType, (x) => {
      this.filt.filterType = x;
    });
  }
}

/**
 * Create an Audio Filter effect
 *
 * Based on the Tuna Audio effect library: https://github.com/Theodeus/tuna/
 *
 * @param {Object} [options={}] AudioFilter parameters
 * @param {Number} [options.frequency=440] Cutoff Frequency (Hz)
 * @param {Number} [options.Q=1] Q factor (resonance)
 * @param {Number} [options.gain=0] Filter gain
 * @param {String} [options.filterType='lowpass'] Filter type (lowpass, highpass, bandpass,
 * lowshelf, highshelf, peaking, notch, allpass)
 * @return {AudioFilter} AudioFilter engine
 */
export default function filt(options = {}) {
  const opts = parseParameters(definitions, options);
  return new AudioFilter(opts);
}
