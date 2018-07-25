import { audioContext } from 'waves-audio';
import BaseAudioEngine from './base';

/**
 * Base architecture for Audio engines accepting stream parameters
 */
export default class BaseAudioEffect extends BaseAudioEngine {
  constructor() {
    super();
    this.input = audioContext.createGain();
    this.dry = audioContext.createGain();
    this.wet = audioContext.createGain();
    this.input.connect(this.dry);
    this.dry.connect(this.output);
    this.wet.connect(this.output);
    this.defineParameter('drywet', 1, (value) => {
      this.dry.gain.setValueAtTime(1 - value, audioContext.currentTime);
      this.wet.gain.setValueAtTime(value, audioContext.currentTime);
    });
  }

  get isCompositeAudioNode() { // eslint-disable-line
    return true;
  }
}
