import { parseParameters } from '@coda/prelude';
import { audioContext } from 'waves-audio';
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
 */
class AudioFilter extends BaseAudioEffect {
  constructor(options) {
    super();
    this.filt = new tuna.AudioFilter(options);
    this.input.connect(this.filt);
    this.filt.connect(audioContext.destination);
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
 * Create a AudioFilter effect
 *
 * @param  {Object} [options={}] AudioFilter parameters
 * @return {AudioFilter}              AudioFilter engine
 */
export default function filt(options = {}) {
  const opts = parseParameters(definitions, options);
  return new AudioFilter(opts);
}
