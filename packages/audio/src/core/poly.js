import {
  runEffects,
  tap,
  takeWhile,
  throttle,
} from '@most/core';
import { newDefaultScheduler } from '@most/scheduler';
import BaseAudioEngine from './base';
import Master from './master';

/**
 * Base architecture for Polyphonic Audio engines accepting stream parameters
 * @private
 */
export default class PolyAudioEngine extends BaseAudioEngine {
  /**
   * @param {Number}   [voices=1]     Number of voices (polyphony)
   * @param {Function} MonoSynthClass Monophonic Synthesizer class
   * @param {Object}   options        Synth options
   */
  constructor(voices = 1, MonoSynthClass, options) {
    super();
    /**
     * Number of voices (polyphony)
     * @type {Number}
     */
    this.voices = voices;
    const individualOptions = Array.from(Array(voices), (_, i) => {
      const opt = {};
      Object.keys(options).forEach((name) => {
        if (Array.isArray(options[name])) {
          opt[name] = options[name][i];
        } else {
          opt[name] = options[name];
        }
      });
      return opt;
    });
    /**
     * Synthesizers
     * @type {Array}
     */
    this.synths = Array.from(Array(voices), (_, i) => new MonoSynthClass(individualOptions[i]));
    this.synths.forEach((synth) => {
      synth.connect(this.output);
    });
  }

  /**
   * Defines the object as a synthesizer
   * @type {Boolean}
   */
  get isSynth() { // eslint-disable-line
    return true;
  }

  /**
   * Defines the object as a polyphonic synthesizer
   * @type {Boolean}
   */
  get isPoly() { // eslint-disable-line
    return true;
  }

  /**
   * Connnect the audio engine to a given destination (AudioNode or Engine)
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
      this.output.connect(Master.masterGainNode);
    }
    return this;
  }

  /**
   * Disconnnect the audio engine to a given destination (AudioNode or Engine)
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
      this.output.disconnect(Master.masterGainNode);
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
  defineParameter(name, defaultValue, throttleTime = 20) {
    let current = defaultValue;
    let stream = null;
    let running = false;
    let isArray = false;
    Object.defineProperty(this, name, {
      get() {
        if (isArray) {
          return this.synths.map(x => x[name]);
        }
        return current;
      },
      async set(value) {
        if (stream) {
          running = false;
          await stream;
          stream = null;
        }
        if (value.isStream) {
          // Handle streams of vectors? => for now yes...
          running = true;
          stream = runEffects(
            takeWhile(
              () => running,
              tap((x) => {
                if (Array.isArray(x)) {
                  x.forEach((val, i) => {
                    this.synths[i][name] = val;
                  });
                } else {
                  this.synths.forEach((synth) => {
                    const s = synth;
                    s[name] = x;
                  });
                }
              }, throttle(throttleTime, value)),
            ),
            newDefaultScheduler(),
          );
        } else if (Array.isArray(value)) {
          value.forEach((val, i) => {
            this.synths[i][name] = val;
          });
          isArray = true;
        } else {
          this.synths.forEach((synth) => {
            const s = synth;
            s[name] = value;
          });
        }
        current = value;
      },
    });
    if (Array.isArray(defaultValue)) {
      defaultValue.forEach((val, i) => {
        this.synths[i][name] = val;
      });
    } else {
      this.synths.forEach((synth) => {
        const s = synth;
        s[name] = defaultValue;
      });
    }
    this.disposeFuncs.push(async () => {
      if (stream) {
        running = false;
        await stream;
        stream = null;
      }
    });
  }

  /**
   * Start the synthesizer
   * @return {ConcatenativeEngine} Concatenative engine instance
   */
  start() {
    this.synths.forEach((x) => {
      x.start();
    });
  }

  /**
   * Stop the synthesizer
   * @return {ConcatenativeEngine} Concatenative engine instance
   */
  stop() {
    this.synths.forEach((x) => {
      x.stop();
    });
  }

  /**
   * Properly dispose the synthesizer (terminate parameter streams)
   */
  dispose() {
    this.stop();
    this.synths.forEach((synth) => { synth.dispose(); });
    this.disposeFuncs.forEach((f) => { f(); });
  }
}
