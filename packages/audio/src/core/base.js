import {
  runEffects,
  tap,
  takeWhile,
  throttle,
} from '@most/core';
import { newDefaultScheduler } from '@most/scheduler';
import Master, { audioContext } from './master';

/**
 * Base architecture for Audio engines accepting stream parameters
 */
export default class BaseAudioEngine {
  constructor() {
    /**
     * Output AudioNode
     * @type {GainNode}
     * @private
     */
    this.output = audioContext.createGain();
    /**
     * Set of functions used to dispose the synthesizer
     * @type {Array<Function>}
     * @private
     */
    this.disposeFuncs = [];
  }

  /**
   * Defines the object as a synthesizer
   * @type {Boolean}
   */
  get isSynth() { // eslint-disable-line
    return true;
  }

  /**
   * Connect the audio engine to a given destination (AudioNode or Engine). By default, the
   * destination is the audio context destination
   * @param  {AudioNode|BaseAudioEngine} [destination=null] destination
   * @return {BaseAudioEngine}
   */
  connect(destination = null) {
    if (destination) {
      if (destination.isCompositeAudioNode) {
        this.output.connect(destination.input);
      } else {
        this.output.connect(destination);
      }
    } else {
      this.output.connect(Master.masterGainNode);
    }
    return this;
  }

  /**
   * Disconnect the audio engine from a given destination (AudioNode or Engine). By default, the
   * destination is the audio context destination
   * @param  {AudioNode|BaseAudioEngine} [destination=null] destination
   * @return {BaseAudioEngine}
   */
  disconnect(destination = null) {
    if (destination) {
      if (destination.isCompositeAudioNode) {
        this.output.disconnect(destination.input);
      } else {
        this.output.disconnect(destination);
      }
    } else {
      this.output.disconnect(Master.masterGainNode);
    }
    return this;
  }

  /**
   * Add a new parameter to the Synth. The parameter accepts either fixed values or streams of
   * values
   *
   * @param {String}   name         Parameter name
   * @param {*}        defaultValue Default value
   * @param {Function} callback     Callback function, called whenever a new value is available
   * for the parameter
   *
   * @private
   */
  defineParameter(name, defaultValue, callback, throttleTime = 20) {
    let current = defaultValue;
    let stream = null;
    let running = false;
    Object.defineProperty(this, name, {
      get() {
        return current;
      },
      async set(value) {
        if (stream) {
          running = false;
          await stream;
          stream = null;
        }
        if (value && value.isStream) {
          running = true;
          stream = runEffects(
            takeWhile(
              () => running,
              tap(callback, throttle(throttleTime, value)),
            ),
            newDefaultScheduler(),
          );
        } else {
          callback(value);
        }
        current = value;
      },
    });
    callback(defaultValue);
    this.disposeFuncs.push(async () => {
      if (stream) {
        running = false;
        await stream;
        stream = null;
      }
    });
  }

  /**
   * Properly dispose the synthesizer (terminates parameter streams).
   * @private
   */
  dispose() {
    this.output.disconnect();
    this.disposeFuncs.forEach((f) => { f(); });
  }
}
