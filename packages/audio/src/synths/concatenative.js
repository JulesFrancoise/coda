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
  repeat: {
    type: 'boolean|array<boolean>',
    default: true,
  },
  periodAbs: {
    type: 'float|array<float>',
    default: 0,
  },
  periodRel: {
    type: 'float|array<float>',
    default: 1,
  },
  periodVar: {
    type: 'float|array<float>',
    default: 0,
  },
  durationAbs: {
    type: 'float|array<float>',
    default: 0,
  },
  durationRel: {
    type: 'float|array<float>',
    default: 1,
  },
  index: {
    type: 'float|array<float>',
    default: 0,
  },
  positionVar: {
    type: 'float|array<float>',
    default: 0,
  },
  attackAbs: {
    type: 'float|array<float>',
    default: 0.001,
  },
  attackRel: {
    type: 'float|array<float>',
    default: 0,
  },
  releaseAbs: {
    type: 'float|array<float>',
    default: 0.001,
  },
  releaseRel: {
    type: 'float|array<float>',
    default: 0,
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
  cyclic: {
    type: 'boolean|array<boolean>',
    default: 1,
  },
  throttle: {
    type: 'float',
    default: false,
  },
};

/**
 * Concatenative engine definition
 * @private
 * @extends BaseEngine
 */
export class ConcatenativeEngine extends BaseAudioEngine {
  /**
   * @param  {Object} [options] Concatenative synthesis parameters
   * @param  {String} [options.file=''] Default audio file
   * @param  {String} [options.filePrefix='/media/'] Address where audio files are stored
   * @param  {String} [options.fileExt='flac'] Audio files extension
   * @param  {number} [options.periodAbs=0] Segment period (absolute, in s)
   * @param  {number} [options.periodRel=1] Segment period (relative to segment duration)
   * @param  {number} [options.periodVar=0] Segment period random variation
   * @param  {number} [options.durationAbs=1] Segment duration (absolute, in s)
   * @param  {number} [options.durationRel=1] Segment duration (relative to segment duration)
   * @param  {number} [options.index=0] Segment index
   * @param  {number} [options.positionVar=0] Segment position random variation
   * @param  {number} [options.attackAbs=0.001] Segment attack (absolute)
   * @param  {number} [options.attackRel=0] Segment attack (relative to duration)
   * @param  {number} [options.releaseAbs=0.001] Segment release (absolute)
   * @param  {number} [options.releaseRel=0] Segment release (relative to duration)
   * @param  {number} [options.resampling=0] Segment resampling
   * @param  {number} [options.resamplingVar=0] Segment resampling  random variation
   * @param  {number} [options.gain=1] Segment gain
   * @param  {Boolean} [options.repeat=true] Allow segment repeat
   * @param  {number} [options.throttle=20] Throttle time for stream parameters
   */
  constructor(options) {
    super(options.throttle);
    this.running = false;
    this.concatenativeEngine = new wavesAudio.SegmentEngine({
      periodAbs: options.periodAbs,
      periodRel: options.periodRel,
      periodVar: options.periodVar,
      durationAbs: options.durationAbs,
      durationRel: options.durationRel,
      positionVar: options.positionVar,
      attackAbs: options.attackAbs,
      attackRel: options.attackRel,
      releaseAbs: options.releaseAbs,
      releaseRel: options.releaseRel,
      resampling: options.resampling,
      resamplingVar: options.resamplingVar,
      gain: options.gain,
      cyclic: options.cyclic,
    });
    this.concatenativeEngine.connect(this.output);
    this.audioScheduler = wavesAudio.getScheduler();
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
        this.concatenativeEngine.segmentIndex = value;
        if (!this.repeat) {
          this.concatenativeEngine.trigger();
        }
      },
    );
    this.defineParameter(
      'repeat',
      options.repeat,
      (value) => {
        this.stop();
        this.start(value);
      },
    );
    this.defineParameter(
      'periodAbs',
      options.periodAbs,
      (value) => {
        this.concatenativeEngine.periodAbs = value;
        this.concatenativeEngine.periodRel = 0;
      },
    );
    this.defineParameter(
      'periodRel',
      options.periodRel,
      (value) => {
        this.concatenativeEngine.periodRel = value;
        this.concatenativeEngine.periodAbs = 0;
      },
    );
    this.defineParameter(
      'periodVar',
      options.periodVar,
      (value) => {
        this.concatenativeEngine.periodVar = value;
      },
    );
    this.defineParameter(
      'durationAbs',
      options.durationAbs,
      (value) => {
        this.concatenativeEngine.durationAbs = value;
        this.concatenativeEngine.durationRel = 0;
      },
    );
    this.defineParameter(
      'durationRel',
      options.durationRel,
      (value) => {
        this.concatenativeEngine.durationRel = value;
        this.concatenativeEngine.durationAbs = 0;
      },
    );
    this.defineParameter(
      'positionVar',
      options.positionVar,
      (value) => {
        this.concatenativeEngine.positionVar = value;
      },
    );
    this.defineParameter(
      'attackAbs',
      options.attackAbs,
      (value) => {
        this.concatenativeEngine.attackAbs = value;
        this.concatenativeEngine.attackRel = 0;
      },
    );
    this.defineParameter(
      'attackRel',
      options.attackRel,
      (value) => {
        this.concatenativeEngine.attackRel = value;
        this.concatenativeEngine.attackAbs = 0;
      },
    );
    this.defineParameter(
      'releaseAbs',
      options.releaseAbs,
      (value) => {
        this.concatenativeEngine.releaseAbs = value;
        this.concatenativeEngine.releaseRel = 0;
      },
    );
    this.defineParameter(
      'releaseRel',
      options.releaseRel,
      (value) => {
        this.concatenativeEngine.releaseRel = value;
        this.concatenativeEngine.releaseAbs = 0;
      },
    );
    this.defineParameter(
      'resampling',
      options.resampling,
      (value) => {
        this.concatenativeEngine.resampling = value;
      },
    );
    this.defineParameter(
      'resamplingVar',
      options.resamplingVar,
      (value) => {
        this.concatenativeEngine.resamplingVar = value;
      },
    );
    this.defineParameter(
      'gain',
      options.gain,
      (value) => {
        this.concatenativeEngine.gain = value;
      },
    );
    this.defineParameter(
      'cyclic',
      options.cyclic,
      (value) => {
        this.concatenativeEngine.cyclic = value;
      },
    );
  }

  /**
   * Load a new audio file
   *
   * @todo Code example
   *
   * @param  {String} filename Audio file name
   * @return {ConcatenativeEngine} Concatenative engine instance
   */
  async load(filename) {
    const fp = filename.split('.');
    const fext = fp[fp.length - 1];
    const hasExt = (['flac', 'wav', 'mp3', 'ogg', 'aif', 'aiff'].includes(fext));
    const fname = hasExt ? fp.slice(0, fp.length - 1).join('.') : filename;
    const audioFile = hasExt
      ? `${this.filePrefix}${filename}`
      : `${this.filePrefix}${filename}.${this.fileExt}`;
    const descFile = `${this.filePrefix}${fname}.json`;
    try {
      const [buffer, markers] = await this.loader.load([audioFile, descFile]);
      this.concatenativeEngine.buffer = buffer;
      this.concatenativeEngine.positionArray = markers.time;
      this.concatenativeEngine.durationArray = markers.duration;
      this.markers = markers;
      this.segmentIndex = this.segmentIndex;
      this.stop();
      this.start(this.repeat);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`[concatenative] Error loading file: "${filename}"`);
    }
    return this;
  }

  /**
   * Start the synthesizer
   * @return {ConcatenativeEngine} Concatenative engine instance
   */
  start(repeat) {
    if (this.running) return this;
    if (repeat) {
      this.audioScheduler.add(this.concatenativeEngine);
      this.running = true;
    }
    return this;
  }

  /**
   * Stop the synthesizer
   * @return {ConcatenativeEngine} Concatenative engine instance
   */
  stop() {
    if (!this.running) return this;
    this.audioScheduler.remove(this.concatenativeEngine);
    this.running = false;
    return this;
  }
}

/**
 * Polyphonic concatenative engine definition
 * @private
 */
export class PolyConcatenativeEngine extends PolyAudioEngine {
  /**
   * @param  {Object} [options] Concatenative synthesis parameters
   * @param  {number} [options.voices=1] Number of voices (polyphony)
   * @param  {String} [options.file=''] Default audio file
   * @param  {String} [options.filePrefix='/media/'] Address where audio files are stored
   * @param  {String} [options.fileExt='flac'] Audio files extension
   * @param  {number} [options.periodAbs=0] Segment period (absolute, in s)
   * @param  {number} [options.periodRel=1] Segment period (relative to segment duration)
   * @param  {number} [options.periodVar=0] Segment period random variation
   * @param  {number} [options.durationAbs=1] Segment duration (absolute, in s)
   * @param  {number} [options.durationRel=1] Segment duration (relative to segment duration)
   * @param  {number} [options.index=0] Segment index
   * @param  {number} [options.positionVar=0] Segment position random variation
   * @param  {number} [options.attackAbs=0.001] Segment attack (absolute)
   * @param  {number} [options.attackRel=0] Segment attack (relative to duration)
   * @param  {number} [options.releaseAbs=0.001] Segment release (absolute)
   * @param  {number} [options.releaseRel=0] Segment release (relative to duration)
   * @param  {number} [options.resampling=0] Segment resampling
   * @param  {number} [options.resamplingVar=0] Segment resampling  random variation
   * @param  {number} [options.gain=1] Segment gain
   * @param  {Boolean} [options.repeat=true] Allow segment repeat
   * @param  {number} [options.throttle=20] Throttle time for stream parameters
   */
  constructor(options) {
    super(options.voices, ConcatenativeEngine, options);
    this.defineParameter('file', options.file);
    this.defineParameter('index', options.index);
    this.defineParameter('repeat', options.repeat);
    this.defineParameter('periodAbs', options.periodAbs);
    this.defineParameter('periodRel', options.periodRel);
    this.defineParameter('periodVar', options.periodVar);
    this.defineParameter('durationAbs', options.durationAbs);
    this.defineParameter('durationRel', options.durationRel);
    this.defineParameter('positionVar', options.positionVar);
    this.defineParameter('attackAbs', options.attackAbs);
    this.defineParameter('attackRel', options.attackRel);
    this.defineParameter('releaseAbs', options.releaseAbs);
    this.defineParameter('releaseRel', options.releaseRel);
    this.defineParameter('resampling', options.resampling);
    this.defineParameter('resamplingVar', options.resamplingVar);
    this.defineParameter('gain', options.gain);
    this.defineParameter('cyclic', options.cyclic);
  }
}

/**
 * Create a polyphonic concatenative synthesizer
 *
 * @todo Code example + Description of markers file structure
 *
 * @param  {Object} [options={}] Concatenative synthesis parameters
 * @param  {number} [options.voices=1] NNumber of voices (polyphony)
 * @param  {String} [options.file=''] Default audio file. Each audio file must be associated with
 * a JSON file containing the associated markers.
 * @param  {String} [options.filePrefix='/media/'] Address where audio files are stored
 * @param  {String} [options.fileExt='flac'] Audio files extension
 * @param  {number} [options.periodAbs=0] Segment period (absolute, in s)
 * @param  {number} [options.periodRel=1] Segment period (relative to segment duration)
 * @param  {number} [options.periodVar=0] Segment period random variation
 * @param  {number} [options.durationAbs=1] Segment duration (absolute, in s)
 * @param  {number} [options.durationRel=1] Segment duration (relative to segment duration)
 * @param  {number} [options.index=0] Segment index
 * @param  {number} [options.positionVar=0] Segment position random variation
 * @param  {number} [options.attackAbs=0.001] Segment attack (absolute)
 * @param  {number} [options.attackRel=0] Segment attack (relative to duration)
 * @param  {number} [options.releaseAbs=0.001] Segment release (absolute)
 * @param  {number} [options.releaseRel=0] Segment release (relative to duration)
 * @param  {number} [options.resampling=0] Segment resampling
 * @param  {number} [options.resamplingVar=0] Segment resampling  random variation
 * @param  {number} [options.gain=1] Segment gain
 * @param  {Boolean} [options.repeat=true] Allow segment repeat
 * @param  {number} [options.throttle=20] Throttle time for stream parameters
 * @return {ConcatenativeEngine}      Concatenative synthesis engine
 */
export default function concatenative(options = {}) {
  const opts = parseParameters(definitions, options);
  return new PolyConcatenativeEngine(opts);
}
