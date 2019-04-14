import Complex from 'complex-js';

/**
 * Filter Utility
 * @ignore
 */
function convolve(a, b) {
  const [x, y] = (b.length > a.length) ? [b, a] : [a, b];

  const result = Array.from(
    Array((x.length + y.length) - 1),
    () => Complex(0, 0),
  );
  for (let i = 0; i < result.length; i += 1) {
    const kmin = (i >= y.length - 1) ? i - (y.length - 1) : 0;
    const kmax = (i < x.length - 1) ? i : x.length - 1;

    for (let k = kmin; k <= kmax; k += 1) {
      result[i] = result[i].add(x[k].multiply(y[i - k]));
    }
  }
  return result;
}

/**
 * Filter Utility
 * @ignore
 */
function poly(sequenceOfZeros) {
  let result = [Complex(1, 0)];
  const y = [Complex(1, 0), Complex(1, 0)];
  for (let i = 0; i < sequenceOfZeros.length; i += 1) {
    y[1] = sequenceOfZeros[i].multiply(Complex(-1, 0));
    result = convolve(result, y);
  }
  return result;
}

/**
 * Filter Utility
 * @ignore
 */
function cheby1(order, rippleLevel, cutoff) {
  if (cutoff <= 0 || cutoff > 1) {
    throw new Error('Cutoff must be between 0 and 1');
  }

  // == cheby1ap(order, rippleLevel);
  const eps = Math.sqrt((10 ** (0.1 * rippleLevel)) - 1); // Ripple factor
  const mu = Math.asinh(1 / eps) / order;

  // Arrange poles in an ellipse on the left half of the S-plane
  const p = Array.from(Array(order), () => Complex(0, 0));
  let kc = Complex(1, 0);
  for (let i = 0; i < order; i += 1) {
    const theta = (Math.PI * (((2 * i) + 1) - order)) / (2 * order);
    const pi = Complex(mu, theta).sinh();
    p[i] = pi.multiply(Complex(-1, 0));
    kc = kc.multiply(pi);
  }

  let k = kc.real;
  if (order % 2 === 0) {
    k /= Math.sqrt(1 + (eps * eps));
  }

  const warpedCutoff = 4 * Math.tan((Math.PI * cutoff) / 2);

  // == transform to lowpass
  for (let i = 0; i < p.length; i += 1) {
    p[i] = p[i].multiply(Complex(warpedCutoff, 0));
  }
  k *= (warpedCutoff ** p.length);

  // == Find discrete equivalent if necessary (_zpkbilinear)
  const fs2 = Complex(4.0, 0);
  let factorDenum = Complex(1, 0);
  for (let i = 0; i < p.length; i += 1) {
    factorDenum = factorDenum.multiply(fs2.subtract(p[i]));
  }
  factorDenum = Complex(1, 0).divide(factorDenum);
  const z = Array.from(Array(p.length), () => new Complex(-1, 0));
  for (let i = 0; i < p.length; i += 1) {
    p[i] = fs2.add(p[i]).divide(fs2.subtract(p[i]));
  }

  k *= factorDenum.real;

  // == Transform to proper out type (pole-zero, state-space, numer-denom)
  // == zpk2tf(z, p, k);
  const bTmp = poly(z);
  const aTmp = poly(p);
  const b = Array(bTmp.length).fill(0);
  const a = Array(aTmp.length).fill(0);
  for (let i = 0; i < b.length; i += 1) {
    b[i] = k * bTmp[i].real;
  }
  for (let i = 0; i < a.length; i += 1) {
    a[i] = aTmp[i].real;
  }
  return { a, b };
}

/**
 * Chebyshev Type 1 low-pass Filter
 * @private
 */
export default class LowpassFilter {
  /**
   * Constructor
   * @param  {Number} [cutoff=1]         Cutoff frequency (normalized)
   * @param  {Number} [order=4]          Filter Order
   * @param  {Number} [rippleLevel=0.05] Ripple level (in dB)
   */
  constructor(cutoff = 1, order = 4, rippleLevel = 0.05) {
    /**
     * Cutoff frequency (normalized)
     * @type {Number}
     */
    this.cutoff = cutoff;
    /**
     * Filter Order
     * @type {Number}
     */
    this.order = order;
    /**
     * Ripple level (in dB)
     * @type {Number}
     */
    this.rippleLevel = rippleLevel;
    this.init();
  }

  /**
   * Initialize the filter
   */
  init() {
    const x = cheby1(this.order, this.rippleLevel, this.cutoff);
    /**
     * FIR filter 'a' coefficients
     * @type {Array}
     */
    this.a = x.a;
    /**
     * FIR filter 'b' coefficients
     * @type {Array}
     */
    this.b = x.b;
    /**
     * FIR filter 'z' coefficients
     * @type {Array}
     */
    this.z = Array(this.order).fill(0);
  }

  /**
   * Filter a new value
   * @param  {number} value Raw value
   * @return {number}       Filtered value
   */
  filter(value) {
    const filteredValue = (this.b[0] * value) + this.z[0];
    for (let i = 0; i < this.order - 1; i += 1) {
      this.z[i] = ((this.b[i + 1] * value) + this.z[i + 1])
        - (this.a[i + 1] * filteredValue);
    }
    this.z[this.order - 1] = (this.b[this.order] * value)
      - (this.a[this.order] * filteredValue);
    return filteredValue;
  }
}
