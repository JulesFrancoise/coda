import * as wavesLoaders from 'waves-loaders';
import * as wavesAudio from 'waves-audio';
import { parseParameters } from '@coda/prelude';
import BaseAudioEngine from '../core/base';
import PolyAudioEngine from '../core/poly';

/**
 * Synthesizer parameters definitions
 * @ignore
 */
export const definitions = {
  voices: {
    type: 'integer',
    default: 1,
  },
  file: {
    type: 'string|array<string>',
    default: '',
  },
  filePrefix: {
    type: 'string',
    default: '/media/',
  },
  fileExt: {
    type: 'string',
    default: 'flac',
  },
  fadeTime: {
    type: 'float|array<float>',
    default: 0.005,
  },
  speed: {
    type: 'float|array<float>',
    default: 1,
  },
  cyclic: {
    type: 'boolean|array<boolean>',
    default: false,
  },
  gain: {
    type: 'float|array<float>',
    default: 1,
  },
  throttle: {
    type: 'float',
    default: 20,
  },
};

/**
 * Sampler engine definition
 * @private
 * @extends BaseEngine
 */
export class SamplerEngine extends BaseAudioEngine {
  /**
   * @param  {Object} [options] Sampler synthesis parameters
   * @param  {String} [options.file=''] Default audio file
   * @param  {String} [options.filePrefix='/media/'] Address where audio files are stored
   * @param  {String} [options.fileExt='flac'] Audio files extension
   * @param  {number} [options.fadeTime=600] Fade time for chaining segments
   * @param  {number} [options.cyclic=false] Loop mode
   * @param  {number} [options.gain=1] Gain
   * @param  {number} [options.throttle=20] Throttle time for stream parameters
   */
  constructor(options) {
    super(options.throttle);
    this.running = false;
    this.samplerEngine = new wavesAudio.PlayerEngine({
      fadeTime: options.fadeTime,
      centered: false,
      cyclic: options.cyclic,
      gain: options.gain,
    });
    this.samplerEngine.connect(this.output);
    this.playControl = new wavesAudio.PlayControl(this.samplerEngine);
    this.loader = new wavesLoaders.SuperLoader();
    this.filePrefix = options.filePrefix;
    this.fileExt = options.fileExt;
    this.defineParameter(
      'file',
      options.file,
      (value) => {
        this.load(value);
      },
    );
    this.defineParameter(
      'index',
      options.index,
      (value) => {
        this.samplerEngine.segmentIndex = value;
      },
    );
    this.defineParameter(
      'fadeTime',
      options.fadeTime,
      (value) => {
        this.samplerEngine.fadeTime = value;
      },
    );
    this.defineParameter(
      'cyclic',
      options.cyclic,
      (value) => {
        this.samplerEngine.cyclic = value;
      },
    );
    this.defineParameter(
      'speed',
      options.speed,
      (value) => {
        this.playControl.speed = value;
      },
    );
    // this.defineParameter(
    //   'gain',
    //   options.gain,
    //   (value) => {
    //     this.samplerEngine.gain = value;
    //   },
    // );
    this.defineParameter(
      'trigger',
      false,
      (value) => {
        if (value) {
          this.stop();
          this.start();
        } else {
          this.stop();
        }
      },
    );
  }

  /**
   * Load a new audio file
   *
   * @todo Code example
   *
   * @param  {String} filename Audio file name
   * @return {SamplerEngine} Sampler engine instance
   */
  async load(filename) {
    const audioFile = `${this.filePrefix}${filename}.${this.fileExt}`;
    try {
      const buffer = await this.loader.load(audioFile);
      this.samplerEngine.buffer = buffer;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`[sampler] Error loading file: "${filename}"`, e);
    }
    return this;
  }

  /**
   * Start the synthesizer
   * @return {SamplerEngine} Sampler engine instance
   */
  start() {
    this.playControl.start();
    return this;
  }

  /**
   * Stop the synthesizer
   * @return {SamplerEngine} Sampler engine instance
   */
  stop() {
    this.playControl.stop();
    return this;
  }
}

/**
 * Polyphonic concatenative engine definition
 * @private
 */
export class PolySamplerEngine extends PolyAudioEngine {
  /**
   * @param  {Object} [options] Sampler synthesis parameters
   * @param  {number} [options.voices=1] Number of voices (polyphony)
   * @param  {String} [options.file=''] Default audio file
   * @param  {String} [options.filePrefix='/media/'] Address where audio files are stored
   * @param  {String} [options.fileExt='flac'] Audio files extension
   * @param  {number} [options.fadeTime=600] Fade time for chaining segments
   * @param  {number} [options.cyclic=false] Loop mode
   * @param  {number} [options.gain=1] Segment gain
   * @param  {number} [options.throttle=20] Throttle time for stream parameters
   */
  constructor(options) {
    super(options.voices, SamplerEngine, options);
    this.defineParameter('file', options.file);
    this.defineParameter('index', options.index);
    this.defineParameter('fadeTime', options.fadeTime);
    this.defineParameter('cyclic', options.cyclic);
    // this.defineParameter('gain', options.gain);
    this.defineParameter('trigger', false);
  }
}

/**
 * Create a polyphonic concatenative synthesizer
 *
 * @todo Code example + Description of markers file structure
 *
 * @param  {Object} [options={}] Sampler synthesis parameters
 * @param  {String} [options.file=''] Default audio file. Each audio file must be associated with
 * a JSON file containing the associated markers.
 * @param  {String} [options.filePrefix='/media/'] Address where audio files are stored
 * @param  {String} [options.fileExt='flac'] Audio files extension
 * @param  {number} [options.fadeTime=600] Fade time for chaining segments
 * @param  {number} [options.cyclic=false] Loop mode
 * @param  {number} [options.gain=1] Segment gain
 * @param  {number} [options.throttle=20] Throttle time for stream parameters
 * @return {SamplerEngine}      Sampler synthesis engine
 */
export default function sampler(options = {}) {
  const opts = parseParameters(definitions, options);
  return new SamplerEngine(opts);
}
