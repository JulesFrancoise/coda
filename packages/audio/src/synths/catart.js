import { parseParameters } from '@coda/prelude';
import KNN from '../lib/knn';
import PolyAudioEngine from '../core/poly';
import { definitions as concatDefs, ConcatenativeEngine } from './concatenative';

/**
 * Synthesizer parameter definitions
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
 * @private
 * @extends ConcatenativeEngine
 *
 * @property {String|Stream<String>} file Default audio file
 * @property {String|Stream<String>} filePrefix Address where audio files are stored
 * @property {String|Stream<String>} fileExt Audio files extension
 * @property {Array<string>|Array<Stream<string>>} descriptors List of descriptors to consider
 * @property {Array<Number>|Array<Stream<Number>>} target Target descriptors for driving
 * the synthesis
 * @property {Number|Stream<Number>} k Number of KNN Neighbors (randomized inn segment playback)
 * @property {Number|Stream<Number>} periodAbs Segment period (absolute, in s)
 * @property {Number|Stream<Number>} periodRel Segment period (relative to segment duration)
 * @property {Number|Stream<Number>} periodVar Segment period random variation
 * @property {Number|Stream<Number>} durationAbs Segment duration (absolute, in s)
 * @property {Number|Stream<Number>} durationRel Segment duration (relative to segment duration)
 * @property {Number|Stream<Number>} index Segment index
 * @property {Number|Stream<Number>} positionVar Segment position random variation
 * @property {Number|Stream<Number>} attackAbs Segment attack (absolute)
 * @property {Number|Stream<Number>} attackRel Segment attack (relative to duration)
 * @property {Number|Stream<Number>} releaseAbs Segment release (absolute)
 * @property {Number|Stream<Number>} releaseRel Segment release (relative to duration)
 * @property {Number|Stream<Number>} resampling Segment resampling
 * @property {Number|Stream<Number>} resamplingVar Segment resampling  random variation
 * @property {Number|Stream<Number>} gain Segment gain
 * @property {Boolean|Stream<Boolean>} [options.repeat=true] Allow segment repeat
 * @property {Number|Stream<Number>} throttle Throttle time for stream parameters
 */
export class CatartEngine extends ConcatenativeEngine {
  /**
   * @param  {Object} [options] Concatenative synthesis parameters
   * @param  {String} [options.file=''] Default audio file
   * @param  {String} [options.filePrefix='/media/'] Address where audio files are stored
   * @param  {String} [options.fileExt='flac'] Audio files extension
   * @param  {Array<string>} [options.descriptors=['loudness']] List of descriptors to consider
   * @param  {Array<Number>} [options.target=[0]] Target descriptors for driving the synthesis
   * @param  {Number} [options.k=1] Number of KNN Neighbors (randomized inn segment playback)
   * @param  {Number} [options.periodAbs=0] Segment period (absolute, in s)
   * @param  {Number} [options.periodRel=1] Segment period (relative to segment duration)
   * @param  {Number} [options.periodVar=0] Segment period random variation
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
   * @param  {Number} [options.gain=1] Segment gain
   * @param  {Boolean} [options.repeat=true] Allow segment repeat
   * @param  {Number} [options.throttle=20] Throttle time for stream parameters
   */
  constructor(options) {
    super(options);
    this.knn = null;
    this.descriptors = options.descriptors;
    this.previousIndex = -1;
    this.defineParameter(
      'k',
      options.k,
      () => {
        this.updateKNN();
      },
    );
    this.defineParameter(
      'target',
      // this.descriptors.length,
      options.target,
      (value) => {
        this.predict((typeof value === 'number') ? [value] : value);
      },
    );
    this.updateKNN();
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
      descData[i] = this.descriptors.map(desc => this.markers[desc][i]);
    }
    // Normalize data
    const dim = descData[0].length;
    const bounds = descData.reduce((a, v) => {
      const mm = a;
      for (let i = 0; i < dim; i += 1) {
        if (v[i] > a.max[i]) mm.max[i] = v[i];
        if (v[i] < a.min[i]) mm.min[i] = v[i];
      }
      return mm;
    }, {
      min: Array.from(Array(dim), () => +Infinity),
      max: Array.from(Array(dim), () => -Infinity),
    });
    descData.forEach((v, j) => {
      descData[j] = v.map((x, i) => ((x - bounds.min[i]) / (bounds.max[i] - bounds.min[i])))
        .concat([j]);
    });
    this.knn = new KNN(descData, { k: this.k });
  }

  /**
   * Estimate the nearest neighbors from a target value, and select an audio segment. If the Number
   * of neighbors `k` is > 1, then a segment is randomly selected from the k nearest segments.
   * @param  {Array<Number>} v Target descriptors
   */
  predict(v) {
    if (!this.knn) return;
    const segments = this.knn.predict(v);
    const { index } = segments[(this.k > 1) ? Math.floor(Math.random() * this.k) : 0];
    if (this.repeat) {
      this.concatenativeEngine.segmentIndex = index;
    } else {
      if (this.previousIndex === index) return;
      this.concatenativeEngine.segmentIndex = index;
      this.concatenativeEngine.trigger();
      this.previousIndex = index;
    }
  }
}

/**
 * Polyphonic Catart-style descriptor-driven corpus-based concatenative synthesis
 * @private
 * @property {String|Array<String>|Stream<String>|Array<Stream<String>>} file Default audio file
 * @property {Array<string>|Stream<Array<string>>} descriptors List of descriptors to consider
 * @property {Array<Number>|Stream<Array<Number>>} target Target descriptors for driving
 * the synthesis
 * @property {Number|Array<Number>|Stream<Number>|Array<Stream<Number>>} k Number of KNN
 * Neighbors (randomized in segment playback)
 * @property {Number|Array<Number>|Stream<Number>|Array<Stream<Number>>} periodAbs Segment period
 * (absolute, in s)
 * @property {Number|Array<Number>|Stream<Number>|Array<Stream<Number>>} periodRel Segment period
 * (relative to segment duration)
 * @property {Number|Array<Number>|Stream<Number>|Array<Stream<Number>>} periodVar Segment period
 * random variation
 * @property {Number|Array<Number>|Stream<Number>|Array<Stream<Number>>} durationAbs Segment
 * duration (absolute, in s)
 * @property {Number|Array<Number>|Stream<Number>|Array<Stream<Number>>} durationRel Segment
 * duration (relative to segment duration)
 * @property {Number|Array<Number>|Stream<Number>|Array<Stream<Number>>} index Segment index
 * @property {Number|Array<Number>|Stream<Number>|Array<Stream<Number>>} positionVar Segment
 * position random variation
 * @property {Number|Array<Number>|Stream<Number>|Array<Stream<Number>>} attackAbs Segment attack
 * (absolute)
 * @property {Number|Array<Number>|Stream<Number>|Array<Stream<Number>>} attackRel Segment attack
 * (relative to duration)
 * @property {Number|Array<Number>|Stream<Number>|Array<Stream<Number>>} releaseAbs Segment
 * release (absolute)
 * @property {Number|Array<Number>|Stream<Number>|Array<Stream<Number>>} releaseRel Segment
 * release (relative to duration)
 * @property {Number|Array<Number>|Stream<Number>|Array<Stream<Number>>} resampling Segment
 * resampling
 * @property {Number|Array<Number>|Stream<Number>|Array<Stream<Number>>} resamplingVar Segment
 * resampling  random variation
 * @property {Number|Array<Number>|Stream<Number>|Array<Stream<Number>>} gain Segment gain
 * @property {Number|Array<Number>|Stream<Number>|Array<Stream<Number>>} throttle Throttle time
 * for stream parameters
 */
export class PolyCatartEngine extends PolyAudioEngine {
  /**
   * @param  {Object} [options] Concatenative synthesis parameters
   * @param  {Number} [options.voices=1] Number of voices (polyphony)
   * @param  {String|Array<String>} [options.file=''] Default audio file
   * @param  {String} [options.filePrefix='/media/'] Address where audio files are stored
   * @param  {String} [options.fileExt='flac'] Audio files extension
   * @param  {Array<string>} [options.descriptors=['loudness']] List of descriptors to consider
   * @param  {Array<Number>} [options.target=[0]] Target descriptors for driving the synthesis
   * @param  {Number|Array<Number>} [options.k=1] Number of KNN Neighbors (randomized in
   * segment playback)
   * @param  {Number|Array<Number>} [options.periodAbs=0] Segment period (absolute, in s)
   * @param  {Number|Array<Number>} [options.periodRel=1] Segment period (relative to
   * segment duration)
   * @param  {Number|Array<Number>} [options.periodVar=0] Segment period random variation
   * @param  {Number|Array<Number>} [options.durationAbs=1] Segment duration (absolute, in s)
   * @param  {Number|Array<Number>} [options.durationRel=1] Segment duration (relative to
   * segment duration)
   * @param  {Number|Array<Number>} [options.index=0] Segment index
   * @param  {Number|Array<Number>} [options.positionVar=0] Segment position random variation
   * @param  {Number|Array<Number>} [options.attackAbs=0.001] Segment attack (absolute)
   * @param  {Number|Array<Number>} [options.attackRel=0] Segment attack (relative to duration)
   * @param  {Number|Array<Number>} [options.releaseAbs=0.001] Segment release (absolute)
   * @param  {Number|Array<Number>} [options.releaseRel=0] Segment release (relative to duration)
   * @param  {Number|Array<Number>} [options.resampling=0] Segment resampling
   * @param  {Number|Array<Number>} [options.resamplingVar=0] Segment resampling  random variation
   * @param  {Number|Array<Number>} [options.gain=0] Segment gain
   * @param  {Number|Array<Number>} [options.throttle=20] Throttle time for stream parameters
   */
  constructor(options) {
    const descriptors = Array(options.voices).fill(options.descriptors);
    super(options.voices, CatartEngine, { ...options, descriptors });
    this.defineParameter('file', options.file);
    this.defineParameter('descriptors', descriptors);
    this.defineParameter('target', options.target);
    this.defineParameter('k', options.k);
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
 * Create a Polyphonic Catart-style descriptor-driven corpus-based concatenative synthesis
 *
 * @todo Code example + Description of markers file structure
 *
 * @param {Object} [options={}] Concatenative synthesis parameters
 * @param {Number} [options.voices=1] Number of voices (polyphony)
 * @param {String|Array<String>} [options.file=''] Default audio file. Each audio file must be
 * associated with a JSON file containing the associated markers.
 * @param {String} [options.filePrefix='/media/'] Address where audio files are stored
 * @param {String} [options.fileExt='flac'] Audio files extension
 * @param {Array<string>} [options.descriptors=['loudness']] List of descriptors to consider
 * @param {Array<Number>} [options.target=[0]] Target descriptors for driving the synthesis
 * @param {Number|Array<Number>} [options.k=1] Number of KNN Neighbors (randomized in segment
 * playback)
 * @param {Number|Array<Number>} [options.periodAbs=0] Segment period (absolute, in s)
 * @param {Number|Array<Number>} [options.periodRel=1] Segment period (relative to segment
 * duration)
 * @param {Number|Array<Number>} [options.periodVar=0] Segment period random variation
 * @param {Number|Array<Number>} [options.durationAbs=1] Segment duration (absolute, in s)
 * @param {Number|Array<Number>} [options.durationRel=1] Segment duration (relative to
 * segment duration)
 * @param {Number|Array<Number>} [options.index=0] Segment index
 * @param {Number|Array<Number>} [options.positionVar=0] Segment position random variation
 * @param {Number|Array<Number>} [options.attackAbs=0.001] Segment attack (absolute)
 * @param {Number|Array<Number>} [options.attackRel=0] Segment attack (relative to duration)
 * @param {Number|Array<Number>} [options.releaseAbs=0.001] Segment release (absolute)
 * @param {Number|Array<Number>} [options.releaseRel=0] Segment release (relative to duration)
 * @param {Number|Array<Number>} [options.resampling=0] Segment resampling
 * @param {Number|Array<Number>} [options.resamplingVar=0] Segment resampling  random variation
 * @param {Number|Array<Number>} [options.gain=0] Segment gain
 * @param  {Boolean} [options.repeat=true] Allow segment repeat
 * @param {Number|Array<Number>} [options.throttle=20] Throttle time for stream parameters
 * @return {PolyCatartEngine} Concatenative synthesis engine
 */
export default function catart(options = {}) {
  const opts = parseParameters(definitions, options);
  if (opts.voices > 1) {
    return new PolyCatartEngine(opts);
  }
  return new CatartEngine(opts);
}
