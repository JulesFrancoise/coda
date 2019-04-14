import Complex from 'complex-js';

/**
 * Morlet Wavelet
 * @private
 */
export default class MorletWavelet {
  /**
   * Constructor
   * @param  {number} samplerate Sampling rate of the input signal
   * @param  {number} scale      Scale for the current wavelet
   * @param  {Number} [omega0=5] Carrier frequency
   */
  constructor(samplerate, scale, omega0 = 5) {
    /**
     * Sampling rate of the input signal
     * @type {Number}
     */
    this.samplerate = samplerate;
    /**
     * Scale for the current wavelet
     * @type {Number}
     */
    this.scale = scale;
    /**
     * Window size for online estimation (relative to the wavelet's critical
     * time).
     * @type {Number}
     */
    this.windowSize = 1;
    /**
     * Wavelet Delay for online estimation (relative to the wavelet's critical
     * time).
     * @type {Number}
     */
    this.delay = 1.5;
    /**
     * Carrier frequency
     * @type {Number}
     */
    this.omega0 = omega0;
    this.setDefaultWindowsize();

    /**
     * Wavelet values (Complex)
     * @type {Array}
     */
    this.values = new Array(this.windowSize).fill(0);
    // set padding to 1 * the critical time of the wavelet
    const padding = Math.floor(this.eFoldingTime() * this.samplerate);
    /**
     * Pre-padding value (precomputed)
     * @type {Complex}
     */
    this.prepadValue = Complex(0, 0);
    for (let t = -padding; t < 0; t += 1) {
      const waveletArg = (t - (this.windowSize / 2))
        / (this.scale * this.samplerate);
      this.prepadValue = this.prepadValue.add(this.phi(waveletArg).conjugate());
    }
    /**
     * Post-padding value (precomputed)
     * @type {Complex}
     */
    this.postpadValue = Complex(0, 0);
    for (let t = this.windowSize; t < this.windowSize + padding; t += 1) {
      const waveletArg = (t - (this.windowSize / 2))
        / (this.scale * this.samplerate);
      this.postpadValue = this.postpadValue.add(this.phi(waveletArg).conjugate());
    }
    for (let t = 0; t < this.windowSize; t += 1) {
      const waveletArg = (t - (this.windowSize / 2))
        / (this.scale * this.samplerate);
      this.values[t] = this.phi(waveletArg);
    }
  }

  /**
   * Estimate the wavelet value 'Phi' for a given argument
   * @param  {Number} arg argument
   * @return {Complex}    Wavelet value for the given argument
   */
  phi(arg) {
    const x1 = (Math.exp(-0.5 * arg * arg) * (Math.PI ** -0.25))
      / Math.sqrt(this.scale * this.samplerate);
    const x2 = Complex.exp(Complex(0, this.omega0 * arg))
      .subtract(Complex.exp(Complex(-0.5 * this.omega0 * this.omega0, 0)));
    return Complex(x1, 0).multiply(x2);
  }

  /**
   * Wavelet's e-folding time
   * @return {Number} e-folding time
   */
  eFoldingTime() {
    return Math.SQRT2 * this.scale;
  }

  /**
   * Set the window size to its default value
   */
  setDefaultWindowsize() {
    let winsize = 2 * this.delay * this.eFoldingTime() * this.samplerate;
    winsize = Math.max(Math.floor(winsize), 3);
    winsize += 1 - (winsize % 2);
    this.windowSize = winsize;
  }
}

/**
 * Convert the scale to a frequency value in Hz
 * @param  {Number} scale  Scale
 * @param  {Number} omega0 Carrier frequency
 * @return {Number}        Frequency (Hz)
 *
 * @private
 */
export function scale2frequency(scale, omega0) {
  return (omega0 + Math.sqrt(2 + (omega0 * omega0)))
    / (4 * Math.PI * scale);
}

/**
 * Convert a frequency value in Hz to scale
 * @param  {Number} frequency  Frequency (Hz)
 * @param  {Number} omega0     Carrier frequency
 * @return {Number}            Scale
 *
 * @private
 */
export function frequency2scale(frequency, omega0) {
  return (omega0 + Math.sqrt(2 + (omega0 * omega0)))
    / (4 * Math.PI * frequency);
}
