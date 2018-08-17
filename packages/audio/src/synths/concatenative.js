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
  periodAbs: {
    type: 'float|array<float>',
    default: 0,
  },
  periodRel: {
    type: 'float|array<float>',
    default: 1,
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
  throttle: {
    type: 'float',
    default: 20,
  },
};

/**
 * Concatenative engine definition
 * @extends BaseEngine
 */
export class ConcatenativeEngine extends BaseAudioEngine {
  /**
  * @param  {Object} [options] Concatenative synthesis parameters
  * @param  {String} [options.file=''] Default audio file
  * @param  {Number} [options.periodAbs=0] Segment period (absolute, in s)
  * @param  {Number} [options.periodRel=1] Segment period (relative to segment duration)
  * @param  {Number} [options.durationAbs=1] Segment duration (absolute, in s)
  * @param  {Number} [options.durationRel=1] Segment duration (relative to segment duration)
  * @param  {Number} [options.index=0] Segment index
  * @param  {Number} [options.positionVar=0] Segment position random variation
  * @param  {Number} [options.attackAbs=0.001] Segment attack (absolute)
  * @param  {Number} [options.attackRel=0] Segment attack (relative to duration)
  * @param  {Number} [options.releaseAbs=0.001] Segment release (absolute)
  * @param  {Number} [options.releaseRel=0] Segment release (relative to duration)
  * @param  {Number} [options.resampling=0] Segment resampling
  * @param  {Number} [options.resamplingVar=0] Segment resampling  random variation
  * @param  {Number} [options.gain=0] Segment gain
  * @param  {Number} [options.throttle=20] Throttle time for stream parameters
   */
  constructor(options) {
    super(options.throttle);
    this.running = false;
    this.concatenativeEngine = new wavesAudio.SegmentEngine({
      periodAbs: options.periodAbs,
      periodRel: options.periodRel,
      durationAbs: options.durationAbs,
      durationRel: options.durationRel,
      index: options.index,
      positionVar: options.positionVar,
      attackAbs: options.attackAbs,
      attackRel: options.attackRel,
      releaseAbs: options.releaseAbs,
      releaseRel: options.releaseRel,
      resampling: options.resampling,
      resamplingVar: options.resamplingVar,
      gain: options.gain,
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
      },
    );
    this.defineParameter(
      'attackRel',
      options.attackRel,
      (value) => {
        this.concatenativeEngine.attackRel = value;
      },
    );
    this.defineParameter(
      'releaseAbs',
      options.releaseAbs,
      (value) => {
        this.concatenativeEngine.releaseAbs = value;
      },
    );
    this.defineParameter(
      'releaseRel',
      options.releaseRel,
      (value) => {
        this.concatenativeEngine.releaseRel = value;
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
  }

  /**
   * Load a new audio file
   * @param  {String} filename File name (in /media)
   * @return {ConcatenativeEngine} Concatenative engine instance
   */
  load(filename) {
    const audioFile = `${this.filePrefix}${filename}.${this.fileExt}`;
    const descFile = `${this.filePrefix}${filename}.json`;
    this.loader.load([audioFile, descFile]).then(([buffer, markers]) => {
      this.concatenativeEngine.buffer = buffer;
      this.concatenativeEngine.positionArray = markers.time;
      this.concatenativeEngine.durationArray = markers.duration;
      this.segmentIndex = this.segmentIndex;
      this.start();
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log('[concatenative] Error loading file: ', err);
    });
    return this;
  }

  /**
   * Start the synthesizer
   * @return {ConcatenativeEngine} Concatenative engine instance
   */
  start() {
    if (this.running) return this;
    this.audioScheduler.add(this.concatenativeEngine);
    this.running = true;
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
 */
export class PolyConcatenativeEngine extends PolyAudioEngine {
  constructor(options) {
    const individualOptions = Array.from(Array(options.voices), (_, i) => {
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
    super(options.voices, ConcatenativeEngine, individualOptions);
    this.defineParameter('file', options.file);
    this.defineParameter('index', options.index);
    this.defineParameter('periodAbs', options.periodAbs);
    this.defineParameter('periodRel', options.periodRel);
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
}

/**
 * Create a polyphonic concatenative synthesizer
 *
 * @param  {Object} [options={}] Concatenative synthesis parameters
 * @param  {Number} [options.voices=1] Number of voices (polyphony)
 * @param  {String} [options.file=''] Default audio file
 * @param  {String} [options.filePrefix=''] Address where audio files are stored
 * @param  {String} [options.fileExt=''] Audio files extension
 * @param  {Number} [options.periodAbs=0] Segment period (absolute, in s)
 * @param  {Number} [options.periodRel=1] Segment period (relative to segment duration)
 * @param  {Number} [options.durationAbs=1] Segment duration (absolute, in s)
 * @param  {Number} [options.durationRel=1] Segment duration (relative to segment duration)
 * @param  {Number} [options.index=0] Segment index
 * @param  {Number} [options.positionVar=0] Segment position random variation
 * @param  {Number} [options.attackAbs=0.001] Segment attack (absolute)
 * @param  {Number} [options.attackRel=0] Segment attack (relative to duration)
 * @param  {Number} [options.releaseAbs=0.001] Segment release (absolute)
 * @param  {Number} [options.releaseRel=0] Segment release (relative to duration)
 * @param  {Number} [options.resampling=0] Segment resampling
 * @param  {Number} [options.resamplingVar=0] Segment resampling  random variation
 * @param  {Number} [options.gain=0] Segment gain
 * @param  {Number} [options.throttle=20] Throttle time for stream parameters
 * @return {ConcatenativeEngine}      Concatenative synthesis engine
 */
export default function concatenative(options = {}) {
  const opts = parseParameters(definitions, options);
  return new PolyConcatenativeEngine(opts);
}
