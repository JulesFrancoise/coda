import { parseParameters } from '@coda/prelude';
import KNN from '../lib/knn';
import PolyAudioEngine from '../core/poly';
import { definitions as concatDefs, ConcatenativeEngine } from './concatenative';

/**
 * Synthesizer parameter definitions
 * @type {Object}
 * @ignore
 */
const definitions = {
  ...concatDefs,
  descriptors: {
    type: 'array<string>',
    default: ['loudness'],
  },
  target: {
    type: 'array<float>',
    default: [0],
  },
  k: {
    type: 'integer',
    default: 1,
  },
};

/**
 * Catart-style descriptor-driven corpus-based concatenative synthesis
 * @extends ConcatenativeEngine
 */
export class CatartEngine extends ConcatenativeEngine {
  /**
   * @param  {Object} [options] Concatenative synthesis parameters
   * @param  {String} [options.file=''] Default audio file
   * @param  {String} [options.filePrefix='/media/'] Address where audio files are stored
   * @param  {String} [options.fileExt='flac'] Audio files extension
   * @param  {Array<string>} [options.descriptors=['loudness']] List of descriptors to consider
   * @param  {Array<number>} [options.target=[0]] Target descriptors for driving the synthesis
   * @param  {number} [options.k=1] Number of KNN Neighbors (randomized inn segment playback)
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
   * @param  {number} [options.gain=0] Segment gain
   * @param  {number} [options.throttle=20] Throttle time for stream parameters
   */
  constructor(options) {
    super(options);
    this.knn = null;
    this.defineParameter(
      'descriptors',
      options.descriptors,
      () => {
        this.updateKNN();
      },
    );
    this.defineParameter(
      'k',
      options.k,
      () => {
        this.updateKNN();
      },
    );
    this.defineParameter(
      'target',
      options.target,
      (value) => {
        this.predict((typeof value === 'number') ? [value] : value);
      },
    );
  }

  /**
   * Load an audio file and the associated markers
   *
   * @todo Code example
   *
   * @param  {String} filename Audio file name
   * @return {CatartEngine} Synth instance
   */
  async load(filename) {
    await super.load(filename);
    const availableDescriptors = Object.keys(this.markers);
    this.descriptors.forEach((descriptor) => {
      if (!availableDescriptors.includes(descriptor)) {
        throw new Error(`Descriptor ${descriptor} is not available with the current audio file`);
      }
    });
    this.updateKNN();
    return this;
  }

  /**
   * Update the KNN's KD-Tree when relevant changes occur (audio file, descriptors).
   */
  updateKNN() {
    if (!this.concatenativeEngine.buffer) return;
    this.knn = null;
    const len = this.markers.time.length;
    const descData = new Array(len);
    for (let i = 0; i < len; i += 1) {
      descData[i] = this.descriptors.map(desc => this.markers[desc][i]).concat([i]);
    }
    this.knn = new KNN(descData, { k: this.k });
    this.updateNormalization(descData);
  }

  /**
   * Update the min/max bounds of the descriptor data for normalizing the target descriptors
   * @private
   *
   * @param  {Array<Array<number>>} data descriptor data
   */
  updateNormalization(data) {
    const dim = data[0].length - 1;
    const start = {
      min: Array.from(Array(dim), () => +Infinity),
      max: Array.from(Array(dim), () => -Infinity),
    };
    this.bounds = data.reduce((a, v) => {
      const mm = a;
      for (let i = 0; i < dim; i += 1) {
        if (v[i] > a.max[i]) mm.max[i] = v[i];
        if (v[i] < a.min[i]) mm.min[i] = v[i];
      }
      return mm;
    }, start);
  }

  /**
   * Estimate the nearest neighbors from a target value, and select an audio segment. If the number
   * of neighbors `k` is > 1, then a segment is randomly selected from the k nearest segments.
   * @param  {Array<number>} v Target descriptors
   */
  predict(v) {
    if (!this.knn) return;
    const scaledV = v.map((x, i) =>
      this.bounds.min[i] + (x * (this.bounds.max[i] - this.bounds.min[i])));
    const segments = this.knn.predict(scaledV);
    const { index } = segments[(this.k > 1) ? Math.floor(Math.random() * this.k) : 0];
    this.concatenativeEngine.segmentIndex = index;
  }
}

/**
 * Polyphonic Catart-style descriptor-driven corpus-based concatenative synthesis
 */
export class PolyCatartEngine extends PolyAudioEngine {
  /**
   * @param  {Object} [options] Concatenative synthesis parameters
   * @param  {number} [options.voices=1] Number of voices (polyphony)
   * @param  {String} [options.file=''] Default audio file
   * @param  {String} [options.filePrefix='/media/'] Address where audio files are stored
   * @param  {String} [options.fileExt='flac'] Audio files extension
   * @param  {Array<string>} [options.descriptors=['loudness']] List of descriptors to consider
   * @param  {Array<number>} [options.target=[0]] Target descriptors for driving the synthesis
   * @param  {number} [options.k=1] Number of KNN Neighbors (randomized inn segment playback)
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
   * @param  {number} [options.gain=0] Segment gain
   * @param  {number} [options.throttle=20] Throttle time for stream parameters
   */
  constructor(options) {
    const descriptors = Array(options.voices).fill(options.descriptors);
    super(options.voices, CatartEngine, { ...options, descriptors });
    this.defineParameter('file', options.file);
    this.defineParameter('descriptors', descriptors);
    this.defineParameter('target', options.target);
    this.defineParameter('k', options.k);
    this.defineParameter('index', options.index);
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
  }
}

/**
 * Create a Polyphonic Catart-style descriptor-driven corpus-based concatenative synthesis
 *
 * @todo Code example + Description of markers file structure
 *
 * @param  {Object} [options={}] Concatenative synthesis parameters
 * @param  {number} [options.voices=1] NNumber of voices (polyphony)
 * @param  {String} [options.file=''] Default audio file. Each audio file must be associated with
 * a JSON file containing the associated markers.
 * @param  {String} [options.filePrefix='/media/'] Address where audio files are stored
 * @param  {String} [options.fileExt='flac'] Audio files extension
 * @param  {Array<string>} [options.descriptors=['loudness']] List of descriptors to consider
 * @param  {Array<number>} [options.target=[0]] Target descriptors for driving the synthesis
 * @param  {number} [options.k=1] Number of KNN Neighbors (randomized inn segment playback)
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
 * @param  {number} [options.gain=0] Segment gain
 * @param  {number} [options.throttle=20] Throttle time for stream parameters
 * @return {ConcatenativeEngine}      Concatenative synthesis engine
 */
export default function catart(options = {}) {
  const opts = parseParameters(definitions, options);
  return new PolyCatartEngine(opts);
}