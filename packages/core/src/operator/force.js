import { parseParameters, validateStream, withAttr } from '@coda/prelude';
import { map } from '@most/core';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  logdiff: {
    type: 'float',
    default: -2,
  },
  logjump: {
    type: 'float',
    default: -30,
  },
};

/**
 * Stream I/O Attributes Specification
 * @ignore
 */
const specification = {
  samplerate: {
    required: true,
  },
  type: {
    required: true,
    check: ['emg'],
    transform() {
      return 'force';
    },
  },
  format: {
    required: true,
    check: ['scalar', 'vector'],
  },
  size: {
    required: true,
    check: { min: 1 },
  },
};

/**
 * Filtering helper. See the C++ implementation.
 * @ignore
 */
function evenExtension(src, n) {
  if (n < 1) return src;
  if (n > src.length - 1) {
    throw new Error('The extension length n is too big. It must not exceed src.length - 1.');
  }

  let dst = [];
  for (let i = n; i > 0; i -= 1) {
    dst.push(src[i]);
  }
  dst = dst.concat(src);

  for (let i = src.length - 2; i > src.length - n - 2; i -= 1) {
    dst.push(src[i]);
  }
  return dst;
}

/**
 * Filtering helper. See the C++ implementation.
 * @ignore
 */
function oddExtension(src, n) {
  if (n < 1) return src;
  if (n > src.length - 1) {
    throw new Error('The extension length n is too big. It must not exceed src.length-1.');
  }

  let dst = [];
  for (let i = n; i > 0; i -= 1) {
    dst.push((2 * src[0]) - src[i]);
  }
  dst = dst.concat(src);
  for (let i = src.length - 2; i > src.length - n - 2; i -= 1) {
    dst.push((2 * src[src.length - 1]) - src[i]);
  }
  return dst;
}

/**
 * Filtering helper. See the C++ implementation.
 * @ignore
 */
function constantExtension(src, n) {
  if (n < 1) return src;
  if (n > src.length - 1) {
    throw new Error('@The extension length n is too big. It must not exceed src.length-1.');
  }

  return new Array(n).fill(src[0])
    .concat(src)
    .concat(new Array(n).fill(src[src.length - 1]));
}

/**
 * Filtering helper. See the C++ implementation.
 * @ignore
 */
function lfilter(b, a, x, zi) {
  let b_ = [...b]; // eslint-disable-line
  let a_ = [...a]; // eslint-disable-line

  // Pad a or b with zeros so they are the same length.
  const k = Math.max(a.length, b.length);

  if (a_.length < k) {
    a_ = a_.concat(new Array(k - a_.length).fill(0.0));
  } else if (b_.length < k) {
    b_ = b_.concat(new Array(k - b_.length).fill(0.0));
  }

  if (a_[0] !== 1.0) {
    // Normalize the coefficients so that a[0] == 1.
    for (let i = 0; i < k; i += 1) {
      a_[i] /= a_[0];
      b_[i] /= a_[0];
    }
  }

  const z = [...zi];
  const n = x.length;
  const y = new Array(n).fill(0);
  for (let m = 0; m < n; m += 1) {
    y[m] = (b_[0] * x[m]) + z[0];
    for (let i = 0; i < k - 2; i += 1) {
      z[i] = ((b_[i + 1] * x[m]) + z[i + 1]) - (a_[i + 1] * y[m]);
    }
    z[k - 2] = (b_[k - 1] * x[m]) - (a_[k - 1] * y[m]);
  }
  return y;
}

/**
 * Filtering helper. See the C++ implementation.
 * @ignore
 */
function lfilterZi(b, a) {
  let b_ = [...b]; // eslint-disable-line
  let a_ = [...a]; // eslint-disable-line

  if (a_[0] !== 1.0) {
    // Normalize the coefficients so a[0] == 1.
    for (let i = 0; i < a_.length; i += 1) {
      a_[i] /= a_[0];
      b_[i] /= a_[0];
    }
  }

  const n = Math.max(a_.length, b_.length);

  // Pad a or b with zeros so they are the same length.
  if (a_.length < n) {
    a_ = a_.concat(new Array(n - a_.length).fill(0.0));
  } else if (b_.length < n) {
    b_ = b_.concat(new Array(n - b_.length).fill(0.0));
  }

  const IminusA = new Array((n - 1) ** 2).fill(0);
  for (let i = 0; i < n - 1; i += 1) {
    IminusA[(i * (n - 1)) + i] = 1.0;
  }

  const companion = new Array((n - 1) ** 2).fill(0);
  for (let i = 0; i < n - 1; i += 1) {
    companion[i] = -a_[i + 1] / (1.0 * a_[0]);
  }
  for (let i = 1; i < n - 1; i += 1) {
    companion[(i * (n - 1)) + (i - 1)] = 1.0;
  }

  for (let i = 0; i < n - 1; i += 1) {
    for (let j = 0; j < n - 1; j += 1) {
      IminusA[(i * (n - 1)) + j] -= companion[(j * (n - 1)) + i];
    }
  }

  const zi = new Array(n - 1).fill(0.0);

  let tmpSum = 0.0;
  for (let i = 0; i < n - 1; i += 1) {
    zi[0] += b_[i + 1] - (a_[i + 1] * b_[0]);
    tmpSum += IminusA[i * (n - 1)];
  }
  zi[0] /= tmpSum;

  // TODO: remove B

  // Solve zi = A*zi + B
  let asum = 1.0;
  let csum = 0.0;
  for (let k = 1; k < n - 1; k += 1) {
    asum += a_[k];
    csum += b_[k] - (a_[k] * b_[0]);
    zi[k] = (asum * zi[0]) - csum;
  }
  return zi;
}

/**
 * Forward-Backward FIR Filter. See the C++ implementation.
 * @ignore
 */
function filtfilt(b, a, x, padType = 'Odd', padLength = -1) {
  const nTaps = Math.max(a.length, b.length);
  const padLen = (padType === 'None') ? 0 : padLength;
  const edge = (padLen < 0) ? nTaps * 3 : padLen;

  if (x.length <= edge) {
    throw new Error('The length of the input vector x must be at least padLength.');
  }

  let ext;
  if (padType !== 'None' && edge > 0) {
    // Make an extension of length 'edge' at each
    // end of the input array.
    switch (padType) {
      case 'Even':
        ext = evenExtension(x, edge);
        break;
      case 'Odd':
        ext = oddExtension(x, edge);
        break;
      default:
        ext = constantExtension(x, edge);
    }
  } else {
    ext = x;
  }

  // Get the steady state of the filter's step response.
  const zi = lfilterZi(b, a);

  // Forward filter.
  const zip = zi;
  for (let i = 0; i < zi.length; i += 1) {
    zip[i] = zi[i] * x[0];
  }

  let yReverse = lfilter(b, a, ext, zip);
  const y = yReverse.reverse();

  // Backward filter.
  // Create y0 so zi*y0 broadcasts appropriately.
  for (let i = 0; i < zip.length; i += 1) {
    zip[i] = zi[i] * x[x.length - 1];
  }
  yReverse = lfilter(b, a, y, zip);

  // Reverse y.
  return yReverse.slice(edge, -edge).reverse();
}

/**
 * Bayesian Filter factory for scalar EMG values
 * @private
 */
function bayesianFilter(
  logDiffusion,
  logJumpRate,
  samplerate,
  levels = 200,
  maximumValueContraction = 1,
) {
  const diffusion = 10 ** logDiffusion;
  const jumpRate = 10 ** logJumpRate;
  const mvc = maximumValueContraction;
  let prior = new Array(levels).fill(1.0 / levels);
  const state = new Array(levels).fill(0);
  const g = [0, 0, 0];
  for (let t = 0; t < levels; t += 1) {
    state[t] = ((t + 1) * mvc) / levels;
  }
  const diff = (diffusion ** 2) / (samplerate * ((mvc / levels) ** 2));
  g[0] = diff / 2.0;
  g[1] = 1.0 - diff - jumpRate;
  g[2] = diff / 2.0;

  return function filter(value) {
    // -- 1. Propagate
    // -----------------------------------------
    const oldPrior = [...prior];
    prior = filtfilt(g, [1], oldPrior);

    // set probability of a sudden jump
    for (let t = 0; t < levels; t += 1) {
      prior[t] += (jumpRate / mvc);
    }

    // -- 4. Calculate the posterior likelihood function
    // -----------------------------------------
    // calculate posterior density using Bayes rule
    const posterior = new Array(levels).fill(0);
    let sumPosterior = 0.0;
    for (let t = 0; t < levels; t += 1) {
      const x2 = state[t] ** 2;
      posterior[t] = prior[t] * (Math.exp(-(value ** 2) / x2) / x2);
      sumPosterior += posterior[t];
    }

    // -- 5. Output the signal estimate output(x(t)) = argmax P(x,t);
    // -----------------------------------------
    // find the maximum of the posterior density
    let pp = 0;
    let tmpMax = posterior[0];
    for (let t = 0; t < levels; t += 1) {
      if (posterior[t] > tmpMax) {
        tmpMax = posterior[t];
        pp = t;
      }
      posterior[t] /= sumPosterior;
    }

    // convert index of peak value to scaled EMG value
    const result = state[pp] / mvc;

    // -- 7. Repeat from step 2 > prior for next iteration is posterior from this iteration
    // -----------------------------------------
    prior = [...posterior];
    return result;
  };
}

/**
 * Estimate the force (muscular contraction) from EMG data, using bayesian filtering techniques.
 *
 * @see Sanger, Terence D. "Bayesian filtering of myoelectric signals." Journal of
 * neurophysiology 97.2 (2007): 1839-1845.
 *
 * @param  {Object} options Filter Options
 * @param  {number} [options.logdiff=-2] Logarithm of the diffusion rate
 * @param  {number} [options.logjump=-30] Logarithm of the jump probability
 * @param  {Stream} source  Input stream of EMG data (scalar or vector)
 * @return {Stream}         Stream of force from the EMG
 *
 * @example
 * fake = periodic(5)
 *   .rand()
 *   .scale({ outmin: -1 })
 *   .mul(periodic(10).rand().biquad({ f0: 0.5, q: 12 }))
 *   .plot();
 * f = fake.withAttr({ type: 'emg' }).force().plot();
 */
export default function force(options, source) {
  const attr = validateStream('force', specification, source.attr);
  const params = parseParameters(definitions, options);
  let filterFunction;
  if (attr.format === 'scalar') {
    filterFunction = bayesianFilter(params.logdiff, params.logjump, attr.samplerate);
  } else {
    const filters = [];
    for (let i = 0; i < attr.size; i += 1) {
      filters.push(bayesianFilter(params.logdiff, params.logjump, attr.samplerate));
    }
    filterFunction = frame => frame.map((x, i) => filters[i](x));
  }
  return withAttr(attr)(map(filterFunction, source));
}
