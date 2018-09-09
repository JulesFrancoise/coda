import { audioContext } from 'waves-audio';
import BaseAudioEngine from './base';

/**
 * Base architecture for Audio Effects engines accepting stream parameters
 */
export default class BaseAudioEffect extends BaseAudioEngine {
  constructor() {
    super();
    /**
     * Input audio node
     * @type {GainNode}
     */
    this.input = audioContext.createGain();
    /**
     * Output dry level
     * @type {GainNode}
     */
    this.dry = audioContext.createGain();
    /**
     * Output wet level
     * @type {GainNode}
     */
    this.wet = audioContext.createGain();
    this.input.connect(this.dry);
    this.dry.connect(this.output);
    this.wet.connect(this.output);
    /**
     * drywet: Dry/wet level
     */
    this.defineParameter('drywet', 1, (value) => {
      this.dry.gain.setValueAtTime(1 - value, audioContext.currentTime);
      this.wet.gain.setValueAtTime(value, audioContext.currentTime);
    });
  }

  /**
   * Defines the engine as a composite audio node
   * @return {Boolean} true
   */
  get isCompositeAudioNode() { // eslint-disable-line
    return true;
  }
}
