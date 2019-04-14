import { audioContext } from './master';
import BaseAudioEngine from './base';

/**
 * Base architecture for Audio Effects engines accepting stream parameters
 * @property {Number|Stream<Number>} ingain Input gain
 * @property {Number|Stream<Number>} dry Dry level (direct audio)
 * @property {Number|Stream<Number>} wet Wet level (effect audio)
 */
export default class BaseAudioEffect extends BaseAudioEngine {
  constructor() {
    super();
    /**
     * Input audio node
     * @type {GainNode}
     * @private
     */
    this.input = audioContext.createGain();
    /**
     * Output dry level
     * @type {GainNode}
     * @private
     */
    this.dryNode = audioContext.createGain();
    /**
     * Output wet level
     * @type {GainNode}
     * @private
     */
    this.wetNode = audioContext.createGain();
    this.input.connect(this.dryNode);
    this.dryNode.connect(this.output);
    this.wetNode.connect(this.output);
    this.defineParameter('ingain', 1, (value) => {
      this.input.gain.setValueAtTime(value, audioContext.currentTime);
    });
    this.defineParameter('dry', 0, (value) => {
      this.dryNode.gain.setValueAtTime(value, audioContext.currentTime);
    });
    this.defineParameter('wet', 1, (value) => {
      this.wetNode.gain.setValueAtTime(value, audioContext.currentTime);
    });
  }

  /**
   * Defines the engine as a composite audio node
   * @return {Boolean} true
   */
  get isCompositeAudioNode() { // eslint-disable-line
    return true;
  }

  /**
   * Dispose synth
   * @private
   */
  dispose() {
    this.dryNode.disconnect();
    this.wetNode.disconnect();
    this.input.disconnect();
    super.dispose();
  }
}
