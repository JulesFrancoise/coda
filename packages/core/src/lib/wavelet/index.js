import { CircularBuffer } from '@coda/prelude';
import Complex from 'complex-js';
import MorletWavelet, {
  frequency2scale,
  scale2frequency,
} from './morlet';
import LowpassFilter from './lowpass';

/**
 * Real-time implementation of the Continuous Wavelet Transform, using the
 * Morlet wavelet.
 * @private
 */
export default class ContinuousWaveletTransform {
  /**
   * Constructor
   * @param {Number}  samplerate     Signal sampling rate
   * @param {Number}  frequencyMin   Minimum Frequency
   * @param {Number}  frequencyMax   Maximum Frequency
   * @param {Number}  bandsPerOctave Number of bands per octave
   * @param {String}  optimisation   Optimisation Level. Options include:
   * - `none`: no optimisation (very slow)
   * - `standard1`: Standard optimisation (level 1)
   * - `standard2`: Standard optimisation (level 2)
   * - `aggressive1`: Aggressive optimisation (level 1)
   * - `aggressive2`: Aggressive optimisation (level 2)
   * @param {Number}  [omega0=5]     Carrier Frequency
   * @param {Boolean} [rescale=true] [description]
   */
  constructor(
    samplerate,
    frequencyMin,
    frequencyMax,
    bandsPerOctave,
    optimisation,
    omega0 = 5,
    rescale = true,
  ) {
    /**
     * Signal sampling rate
     * @type {Number}
     */
    this.samplerate = samplerate;
    /**
     * Minimum frequency of the transform
     * @type {Number}
     */
    this.frequencyMin = frequencyMin;
    /**
     * Maximum frequency of the transform
     * @type {Number}
     */
    this.frequencyMax = frequencyMax;
    /**
     * Number of bands per octave
     * @type {Number}
     */
    this.bandsPerOctave = bandsPerOctave;
    /**
     * Optimisation level:
     * - `none`: no optimisation (very slow)
     * - `standard1`: Standard optimisation (level 1)
     * - `standard2`: Standard optimisation (level 2)
     * - `aggressive1`: Aggressive optimisation (level 1)
     * - `aggressive2`: Aggressive optimisation (level 2)
     * @type {Number}
     */
    this.optimisation = optimisation;
    /**
     * Carrier frequency of the wavelet (default: 5)
     * @type {Number}
     */
    this.omega0 = omega0;
    /**
     * Rescale the scalogram
     * @type {Boolean}
     */
    this.rescale = rescale;

    // ===
    // init()
    // ===
    // Compute Scales of the Filterbank
    const scale0 = 2 / this.samplerate;
    const minScale = frequency2scale(this.frequencyMax, this.omega0);
    const maxScale = frequency2scale(this.frequencyMin, this.omega0);
    const minV = Math.log2(minScale / scale0) * this.bandsPerOctave;
    const maxV = Math.log2(maxScale / scale0) * this.bandsPerOctave;
    const minIndex = 1 + (Math.sign(minV) * Math.trunc(Math.abs(minV)));
    const maxIndex = 1 + (Math.sign(maxV) * Math.trunc(Math.abs(maxV)));
    this.size = maxIndex - minIndex;
    this.scales = Array.from(
      Array(this.size),
      (_, i) => scale0 * (2 ** ((i + minIndex) / this.bandsPerOctave)),
    );
    this.frequencies = this.scales.map(x => scale2frequency(x, this.omega0));
    this.downsamplingFactors = Array(this.size).fill(1);
    if (this.optimisation !== 'none') {
      for (let i = 0; i < this.size; i += 1) {
        const samplerateRatio = (['standard1', 'aggressive1'].includes(this.optimisation))
          ? (this.samplerate / 8) / this.frequencies[i]
          : (this.samplerate / 4) / this.frequencies[i];
        this.downsamplingFactors[i] = Math.max(Math.trunc(samplerateRatio), 1);
      }
    }

    this.wavelets = Array.from(Array(this.size), (_, i) => {
      const sr = (this.optimisation === 'none')
        ? this.samplerate
        : this.samplerate / this.downsamplingFactors[i];
      return new MorletWavelet(sr, this.scales[i], this.omega0);
    });

    this.data = new Map();
    this.filters = {};
    if (this.optimisation === 'none') {
      this.data[1] = null;
    } else {
      for (let i = 0; i < this.size; i += 1) {
        this.data[this.downsamplingFactors[i]] = null;
        if (
          this.downsamplingFactors[i] > 1
          && !Object.keys(this.filters).includes(this.downsamplingFactors[i])
        ) {
          const filt = new LowpassFilter(0.8 / this.downsamplingFactors[i]);
          this.filters[this.downsamplingFactors[i]] = filt;
        }
      }
    }
    this.frameIndex = 0;
    this.resultComplex = Array.from(Array(this.size), () => Complex(0, 0));
    this.resultPower = new Array(this.size).fill(0);
  }

  /**
   * Compute the transform for a new data frame
   * @param  {Number} value data value
   * @return {Array}        Wavelet power spectrum
   */
  update(value) {
    // Update Buffers
    if (this.optimisation === 'none') {
      if (this.data[1] !== null) {
        this.data[1].push(value);
      } else {
        this.data[1] = new CircularBuffer(this.wavelets[this.size - 1].windowSize);
        this.data[1].fill(value);
      }
    } else {
      let previousDecimation = -1;
      for (let i = this.size - 1; i >= 0; i -= 1) {
        const decimation = this.downsamplingFactors[i];
        if (decimation !== previousDecimation) {
          let filteredValue = (decimation > 1)
            ? this.filters[decimation].filter(value)
            : value;
          if (this.data[decimation] !== null) {
            this.data[decimation].push(filteredValue);
          } else {
            const bufferSize = this.wavelets[i].windowSize * decimation;
            if (decimation > 1) {
              for (let j = 0; j < (2 * bufferSize) - 1; j += 1) {
                filteredValue = this.filters[decimation].filter(value);
              }
            }
            this.data[decimation] = new CircularBuffer(bufferSize);
            this.data[decimation].fill(filteredValue);
          }

          previousDecimation = decimation;
        }
      }
    }

    // Update filter
    for (let i = 0; i < this.size; i += 1) {
      const decimation = this.downsamplingFactors[i];
      if (['aggressive1', 'aggressive2'].includes(this.optimisation)) {
        if (this.frameIndex % decimation !== 0) {
          continue; // eslint-disable-line no-continue
        }
      }
      this.resultComplex[i] = Complex(0, 0);

      const bufLen = this.data[decimation].length;
      const initialIndex = bufLen - (decimation * this.wavelets[i].windowSize);
      // Padding: before
      this.resultComplex[i] = Complex(this.data[decimation].get(initialIndex), 0)
        .multiply(this.wavelets[i].prepadValue);
      // Data
      let wvtIndex = 0;
      for (
        let dataIndex = initialIndex;
        dataIndex < bufLen;
        dataIndex += decimation
      ) {
        this.resultComplex[i] = this.resultComplex[i]
          .add(Complex(this.data[decimation].get(dataIndex), 0)
            .multiply(this.wavelets[i].values[wvtIndex].conjugate()));
        wvtIndex += 1;
      }
      // Padding: after
      this.resultComplex[i] = this.resultComplex[i]
        .add(Complex(this.data[decimation].get(bufLen - 1), 0)
          .multiply(this.wavelets[i].postpadValue));
      // Rescale
      if (this.rescale) {
        this.resultComplex[i] = this.resultComplex[i]
          .divide(Complex(Math.sqrt(this.wavelets[i].scale), 0));
      }
      this.resultComplex[i] = this.resultComplex[i]
        .multiply(Complex(Math.sqrt(decimation), 0));
      this.resultPower[i] = this.resultComplex[i].abs ** 2;
    }
    this.frameIndex += 1;
    return [...this.resultPower];
  }
}
