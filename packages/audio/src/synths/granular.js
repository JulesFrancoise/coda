import * as wavesLoaders from 'waves-loaders';
import * as wavesAudio from 'waves-audio';
import { parseParameters } from '@coda/prelude';
import BaseAudioEngine from '../core/base';
import PolyAudioEngine from '../core/poly';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
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
  period: {
    type: 'float|array<float>',
    default: 0.01,
  },
  duration: {
    type: 'float|array<float>',
    default: 0.1,
  },
  position: {
    type: 'float|array<float>',
    default: 0,
  },
  positionVar: {
    type: 'float|array<float>',
    default: 0.003,
  },
  attackAbs: {
    type: 'float|array<float>',
    default: 0,
  },
  attackRel: {
    type: 'float|array<float>',
    default: 0.5,
  },
  releaseAbs: {
    type: 'float|array<float>',
    default: 0,
  },
  releaseRel: {
    type: 'float|array<float>',
    default: 0.5,
  },
  resampling: {
    type: 'float|array<float>',
    default: 0,
  },
  resamplingVar: {
    type: 'float|array<float>',
    default: 0,
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
 * Granular engine definition
 * @private
 * @extends BaseEngine
 */
export class GranularEngine extends BaseAudioEngine {
  /**
  * @param  {Object} [options] Granular synthesis parameters
  * @param  {String} [options.file=''] Default audio file
  * @param  {Number} [options.period=0.01] Grain period
  * @param  {Number} [options.duration=0.1] Grain duration
  * @param  {Number} [options.position=0] Grain position
  * @param  {Number} [options.positionVar=0] Grain position random variation
  * @param  {Number} [options.attackAbs=0] Grain attack (absolute)
  * @param  {Number} [options.attackRel=0.5] Grain attack (relative to duration)
  * @param  {Number} [options.releaseAbs=0] Grain release (absolute)
  * @param  {Number} [options.releaseRel=0.5] Grain release (relative to duration)
  * @param  {Number} [options.resampling=0] Grain resampling
  * @param  {Number} [options.resamplingVar=0] Grain resampling  random variation
  * @param  {Number} [options.gain=1] Grain gain
  * @param  {Number} [options.throttle=20] Throttle time for stream parameters
   */
  constructor(options) {
    super(options.throttle);
    this.running = false;
    this.granularEngine = new wavesAudio.GranularEngine({
      periodAbs: options.period,
      durationAbs: options.duration,
      position: options.position,
      positionVar: options.positionVar,
      attackAbs: options.attackAbs,
      attackRel: options.attackRel,
      releaseAbs: options.releaseAbs,
      releaseRel: options.releaseRel,
      resampling: options.resampling,
      resamplingVar: options.resamplingVar,
      gain: options.gain,
    });
    this.granularEngine.connect(this.output);
    this.audioScheduler = wavesAudio.getScheduler();
    this.loader = new wavesLoaders.AudioBufferLoader();
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
      'position',
      options.position,
      (value) => {
        this.granularEngine.position = value * this.granularEngine.bufferDuration;
      },
    );
    this.defineParameter(
      'period',
      options.period,
      (value) => {
        this.granularEngine.periodAbs = value;
      },
    );
    this.defineParameter(
      'duration',
      options.duration,
      (value) => {
        this.granularEngine.durationAbs = value;
      },
    );
    this.defineParameter(
      'positionVar',
      options.positionVar,
      (value) => {
        this.granularEngine.positionVar = value;
      },
    );
    this.defineParameter(
      'attackAbs',
      options.attackAbs,
      (value) => {
        this.granularEngine.attackAbs = value;
      },
    );
    this.defineParameter(
      'attackRel',
      options.attackRel,
      (value) => {
        this.granularEngine.attackRel = value;
      },
    );
    this.defineParameter(
      'releaseAbs',
      options.releaseAbs,
      (value) => {
        this.granularEngine.releaseAbs = value;
      },
    );
    this.defineParameter(
      'releaseRel',
      options.releaseRel,
      (value) => {
        this.granularEngine.releaseRel = value;
      },
    );
    this.defineParameter(
      'resampling',
      options.resampling,
      (value) => {
        this.granularEngine.resampling = value;
      },
    );
    this.defineParameter(
      'resamplingVar',
      options.resamplingVar,
      (value) => {
        this.granularEngine.resamplingVar = value;
      },
    );
    this.defineParameter(
      'gain',
      options.gain,
      (value) => {
        this.granularEngine.gain = value;
      },
    );
  }

  /**
   * Load a new audio file
   * @param  {String} filename File name (in /media)
   * @return {GranularEngine} Granular engine instance
   */
  load(filename) {
    const fp = filename.split('.');
    const fext = fp[fp.length - 1];
    const audioFile = (['flac', 'wav', 'mp3', 'ogg', 'aif', 'aiff'].includes(fext))
      ? `${this.filePrefix}${filename}`
      : `${this.filePrefix}${filename}.${this.fileExt}`;
    this.loader.load(audioFile).then((loaded) => {
      this.granularEngine.buffer = loaded;
      this.position = this.position;
      this.start();
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log('[granular] Error loading file: ', err);
    });
    return this;
  }

  /**
   * Start the synthesizer
   * @return {GranularEngine} Granular engine instance
   */
  start() {
    if (this.running) return this;
    this.audioScheduler.add(this.granularEngine);
    this.running = true;
    return this;
  }

  /**
   * Stop the synthesizer
   * @return {GranularEngine} Granular engine instance
   */
  stop() {
    if (!this.running) return this;
    this.audioScheduler.remove(this.granularEngine);
    this.running = false;
    return this;
  }
}

/**
 * Polyphonic granular engine definition
 * @private
 */
export class PolyGranularEngine extends PolyAudioEngine {
  constructor(options) {
    super(options.voices, GranularEngine, options);
    this.defineParameter('file', options.file);
    this.defineParameter('position', options.position);
    this.defineParameter('period', options.period);
    this.defineParameter('duration', options.duration);
    this.defineParameter('positionVar', options.positionVar);
    this.defineParameter('attackAbs', options.attackAbs);
    this.defineParameter('attackRel', options.attackRel);
    this.defineParameter('releaseAbs', options.releaseAbs);
    this.defineParameter('releaseRel', options.releaseRel);
    this.defineParameter('resampling', options.resampling);
    this.defineParameter('resamplingVar', options.resamplingVar);
    this.defineParameter('gain', options.gain);
  }

  /**
   * Start the synthesizer
   * @return {GranularEngine} Granular engine instance
   */
  start() {
    this.synths.forEach((x) => {
      x.start();
    });
  }

  /**
   * Stop the synthesizer
   * @return {GranularEngine} Granular engine instance
   */
  stop() {
    this.synths.forEach((x) => {
      x.stop();
    });
  }
}

/**
 * Create a polyphonic granular synthesizer
 *
 * @param  {Object} [options={}] Granular synthesis parameters
 * @param  {Number} [options.voices=1] Number of voices (polyphony)
 * @param  {String} [options.file=''] Default audio file
 * @param  {String} [options.filePrefix=''] Address where audio files are stored
 * @param  {String} [options.fileExt=''] Audio files extension
 * @param  {Number} [options.period=0.01] Grain period
 * @param  {Number} [options.duration=0.1] Grain duration
 * @param  {Number} [options.position=0] Grain position
 * @param  {Number} [options.positionVar=0] Grain position random variation
 * @param  {Number} [options.attackAbs=0] Grain attack (absolute)
 * @param  {Number} [options.attackRel=0.5] Grain attack (relative to duration)
 * @param  {Number} [options.releaseAbs=0] Grain release (absolute)
 * @param  {Number} [options.releaseRel=0.5] Grain release (relative to duration)
 * @param  {Number} [options.resampling=0] Grain resampling
 * @param  {Number} [options.resamplingVar=0] Grain resampling  random variation
 * @param  {Number} [options.gain=1] Grain gain
 * @param  {Number} [options.throttle=20] Throttle time for stream parameters
 * @return {GranularEngine}      Granular synthesis engine
 */
export default function granular(options = {}) {
  const opts = parseParameters(definitions, options);
  return new PolyGranularEngine(opts);
}
