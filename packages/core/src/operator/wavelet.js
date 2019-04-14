import { parseParameters, validateStream, withAttr } from '@coda/prelude';
import { map } from '@most/core';
import WaveletFilterbank from '../lib/wavelet';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  frequencyMin: {
    type: 'float',
    default: 1,
    min: 1e-10,
  },
  frequencyMax: {
    type: 'float',
    default: 20,
  },
  bandsPerOctave: {
    type: 'integer',
    default: 4,
  },
  carrier: {
    type: 'float',
    default: 5,
  },
  optimisation: {
    type: 'enum',
    default: 'standard2',
    list: ['none', 'standard1', 'standard2', 'aggressive1', 'aggressive2'],
  },
};

/**
 * Stream I/O Attributes Specification
 * @ignore
 */
const specification = {
  format: {
    required: true,
    check: ['scalar', 'vector'],
  },
  size: {
    required: true,
    check: { min: 1 },
  },
  samplerate: {
    required: true,
    check: { min: 1 },
  },
};

/**
 * Compute the scalogram for scalar values
 * @ignore
 *
 * @param  {Object} params     parameters
 * @param  {Number} samplerate Sampling rate
 * @return {Array}             Scalogram frame (power)
 */
function scalogramScalar(params, samplerate) {
  const {
    frequencyMin,
    frequencyMax,
    bandsPerOctave,
    carrier,
    optimisation,
  } = params;
  const filter = new WaveletFilterbank(
    samplerate,
    frequencyMin,
    frequencyMax,
    bandsPerOctave,
    optimisation,
    carrier,
  );
  const attr = {
    format: 'vector',
    size: filter.size,
    frequencies: filter.frequencies,
  };
  return {
    attr,
    f(x) {
      return filter.update(x);
    },
  };
}

/**
 * Compute the scalogram for vector values
 * @ignore
 *
 * @param  {Number} size       frame size
 * @param  {Object} params     parameters
 * @param  {Number} samplerate Sampling rate
 * @return {Array}             Scalogram frame (power)
 */
function scalogramVector(size, params, samplerate) {
  const {
    frequencyMin,
    frequencyMax,
    bandsPerOctave,
    optimisation,
    carrier,
  } = params;
  const filters = Array.from(
    Array(size),
    () => new WaveletFilterbank(
      samplerate,
      frequencyMin,
      frequencyMax,
      bandsPerOctave,
      optimisation,
      carrier,
    ),
  );
  const attr = {
    format: 'vector',
    size: filters[0].size,
    frequencies: filters[0].frequencies,
  };
  return {
    attr,
    f(frame) {
      return frame.map((x, i) => filters[i].update(x))
        .reduce((a, v) => a.map((x, j) => x + v[j]), Array(attr.size).fill(0))
        .map(x => x / size);
    },
  };
}

/**
 * Online Continuous Wavelet Transform (CWT). This module computes a causal
 * estimate of the CWT with a minimal delay per frequency band. It uses the
 * Morlet Wavelet Basis.
 *
 * @todo Complement description
 *
 * @param  {Object} [options={}] Wavelet Transform Options
 * @param  {Object} [options.frequencyMin=1] Minimum frequency (Hz)
 * @param  {Object} [options.frequencyMax=50] Maximum frequency (Hz)
 * @param  {Object} [options.bandsPerOctave=4] Number of bands per octave
 * @param  {Number} [options.omega0=5] Carrier Frequency
 * @param  {Object} [options.optimisation='none'] Optimisation level. Options
 * include:
 * - `none`: no optimisation
 * - `standard1`: Standard optimisation (level 1)
 * - `standard2`: Standard optimisation (level 2)
 * - `aggressive1`: Aggressive optimisation (level 1)
 * - `aggressive2`: Aggressive optimisation (level 2)
 * @param  {Stream} source Scalar or Vector Stream
 * @return {Stream} Stream of Scalogram frames
 *
 * @example
 * m = mousemove(doc).resample(periodic(10)).plot({ legend: 'mouse position' });
 * w = m.wavelet().heatmap({ legend: 'Wavelet Transform of the mouse position' });
 */
export default function wavelet(options = {}, source) {
  const baseAttr = validateStream('wavelet', specification, source.attr);
  const params = parseParameters(definitions, options);
  const { attr, f } = (baseAttr.format === 'scalar')
    ? scalogramScalar(params, baseAttr.samplerate)
    : scalogramVector(baseAttr.size, params, baseAttr.samplerate);
  return withAttr({ ...baseAttr, ...attr })(map(f, source));
}
