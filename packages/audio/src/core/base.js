import { audioContext } from 'waves-audio';
import { runEffects, tap, takeWhile, throttle } from '@most/core';
import { newDefaultScheduler } from '@most/scheduler';

/**
 * Base architecture for Audio engines accepting stream parameters
 */
export default class BaseAudioEngine {
  constructor() {
    this.output = audioContext.createGain();
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
   * Connnect the audio engine to a given destination (AudioNode or Engin)
   * @param  {AudioNode|BaseAudioEngine|null} [destination=null] destination
   * @return {BaseAudioEngine}
   */
  connect(destination = null) {
    if (destination) {
      // eslint-disable-next-line no-underscore-dangle
      if (destination.isCompositeAudioNode) {
        this.output.connect(destination.input);
      } else {
        this.output.connect(destination);
      }
    } else {
      this.output.connect(audioContext.destination);
    }
    return this;
  }

  /**
   * Disconnnect the audio engine to a given destination (AudioNode or Engin)
   * @param  {AudioNode|BaseAudioEngine|null} [destination=null] destination
   * @return {BaseAudioEngine}
   */
  disconnect(destination = null) {
    if (destination) {
      // eslint-disable-next-line no-underscore-dangle
      if (destination.isCompositeAudioNode) {
        this.output.disconnect(destination.input);
      } else {
        this.output.disconnect(destination);
      }
    } else {
      this.output.disconnect(audioContext.destination);
    }
    return this;
  }

  /**
   * Add a new parameter to the Synth. The parameter accepts either fixed values
   * or streams of values
   * @param {String}   name         Parameter name
   * @param {*}        defaultValue Default value
   * @param {Function} callback     Callback function, called whenever a new
   * value is available for the parameter
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
        if (value.isStream) {
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
   * Properly dispose the synthesizer (terminate parameter streams)
   */
  dispose() {
    this.stop();
    this.disposeFuncs.forEach((f) => { f(); });
  }
}
