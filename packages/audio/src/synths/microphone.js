import { parseParameters } from '@coda/prelude';
import { audioContext } from '../core/master';
import BaseAudioEngine from '../core/base';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  gain: {
    type: 'float',
    default: 0.5,
    min: 0,
  },
};

/**
 * Microphone Source Node
 */
export class MicrophoneSource extends BaseAudioEngine {
  /**
   * @param {Object} options Options
   * @param {Number} [options.gain=0.5] Gain
   */
  constructor(options) {
    super(options);
    this.init();
    this.defineParameter(
      'gain',
      options.gain,
      (value) => {
        this.output.gain.setValueAtTime(value, audioContext.currentTime);
      },
    );
  }

  /**
   * Initialize the audio source
   * @return {Promise} [description]
   * @private
   */
  async init() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.source = audioContext.createMediaStreamSource(stream);
      this.source.connect(this.output);
    } catch (e) {
      // eslint-disable-next-line
      console.log('Error accessing audio input', e);
    }
    return this;
  }
}

/**
 * Create an audio source from the microphone
 *
 * @augments MicrophoneSource
 * @augments BaseAudioEngine
 *
 * @property {Number|Stream<Number>} gain Source gain
 *
 * @param  {Object} [options={}] Options
 * @param  {Number} [options.gain=0.5] Gain
 * @return {MicrophoneSource}
 *
 *
 * @example
 * // Create a source from the microphone
 * m = microphone();
 *
 * // Create a chorus effect and connect the microphone input
 * c = chorus({ rate: 0.9 }).connect();
 * m.connect(c);
 *
 * // Modulate chorus parameters
 * c.feedback = 0.97;
 * c.delay = 0.45;
 * c.rate = 10;
 */
export default function microphone(options = {}) {
  const opts = parseParameters(definitions, options);
  return new MicrophoneSource(opts);
}
