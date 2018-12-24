import { parseParameters, validateStream, withAttr } from '@coda/prelude';
import { map } from '@most/core';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  type: {
    type: 'enum',
    default: 'lowpass',
    list: [
      'lowpass',
      'highpass',
      'bandpass_constant_skirt',
      'bandpass',
      'bandpass_constant_peak',
      'notch',
      'allpass',
      'peaking',
      'lowshelf',
      'highshelf',
    ],
  },
  f0: {
    type: 'float',
    default: 1,
  },
  gain: {
    type: 'float',
    default: 1,
    min: 0,
  },
  q: {
    type: 'float',
    default: 1,
    min: 0.001,
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
 * Calculate the FIR Biquad filter coefficients
 * @ignore
 */
function calculateCoefs(samplerate, type, gain, f0, q) {
  const bandwidth = null;

  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  let a0 = 0;
  let a1 = 0;
  let a2 = 0;

  const A = 10 ** (gain / 40);
  const w0 = (2 * Math.PI * f0) / samplerate;
  const cosW0 = Math.cos(w0);
  const sinW0 = Math.sin(w0);
  let alpha; // depend of the filter type
  let rootAAlpha; // intermediate value for lowshelf and highshelf

  switch (type) {
    // H(s) = 1 / (s^2 + s/Q + 1)
    case 'lowpass':
      alpha = sinW0 / (2 * q);
      b0 = (1 - cosW0) / 2;
      b1 = 1 - cosW0;
      b2 = b0;
      a0 = 1 + alpha;
      a1 = -2 * cosW0;
      a2 = 1 - alpha;
      break;
    // H(s) = s^2 / (s^2 + s/Q + 1)
    case 'highpass':
      alpha = sinW0 / (2 * q);
      b0 = (1 + cosW0) / 2;
      b1 = -(1 + cosW0);
      b2 = b0;
      a0 = 1 + alpha;
      a1 = -2 * cosW0;
      a2 = 1 - alpha;
      break;
    // H(s) = s / (s^2 + s/Q + 1)  (constant skirt gain, peak gain = Q)
    case 'bandpass_constant_skirt':
      if (bandwidth) {
        // sin(w0)*sinh( ln(2)/2 * BW * w0/sin(w0) )           (case: BW)
      } else {
        alpha = sinW0 / (2 * q);
      }

      b0 = sinW0 / 2;
      b1 = 0;
      b2 = -b0;
      a0 = 1 + alpha;
      a1 = -2 * cosW0;
      a2 = 1 - alpha;
      break;
    // H(s) = (s/Q) / (s^2 + s/Q + 1)      (constant 0 dB peak gain)
    case 'bandpass': // looks like what is gnerally considered as a bandpass
    case 'bandpass_constant_peak':
      if (bandwidth) {
        // sin(w0)*sinh( ln(2)/2 * BW * w0/sin(w0) )           (case: BW)
      } else {
        alpha = sinW0 / (2 * q);
      }

      b0 = alpha;
      b1 = 0;
      b2 = -alpha;
      a0 = 1 + alpha;
      a1 = -2 * cosW0;
      a2 = 1 - alpha;
      break;
    // H(s) = (s^2 + 1) / (s^2 + s/Q + 1)
    case 'notch':
      alpha = sinW0 / (2 * q);
      b0 = 1;
      b1 = -2 * cosW0;
      b2 = 1;
      a0 = 1 + alpha;
      a1 = b1;
      a2 = 1 - alpha;
      break;
    // H(s) = (s^2 - s/Q + 1) / (s^2 + s/Q + 1)
    case 'allpass':
      alpha = sinW0 / (2 * q);
      b0 = 1 - alpha;
      b1 = -2 * cosW0;
      b2 = 1 + alpha;
      a0 = b2;
      a1 = b1;
      a2 = b0;
      break;
    // H(s) = (s^2 + s*(A/Q) + 1) / (s^2 + s/(A*Q) + 1)
    case 'peaking':
      if (bandwidth) {
        // sin(w0)*sinh( ln(2)/2 * BW * w0/sin(w0) )           (case: BW)
      } else {
        alpha = sinW0 / (2 * q);
      }

      b0 = 1 + (alpha * A);
      b1 = -2 * cosW0;
      b2 = 1 - (alpha * A);
      a0 = 1 + (alpha / A);
      a1 = b1;
      a2 = 1 - (alpha / A);
      break;
    // H(s) = A * (s^2 + (sqrt(A)/Q)*s + A)/(A*s^2 + (sqrt(A)/Q)*s + 1)
    case 'lowshelf':
      alpha = sinW0 / (2 * q);
      rootAAlpha = 2 * Math.sqrt(A) * alpha;

      b0 = A * ((A + 1 + rootAAlpha) - ((A - 1) * cosW0));
      b1 = 2 * A * ((A - 1) - ((A + 1) * cosW0));
      b2 = A * ((A + 1) - ((A - 1) * cosW0) - rootAAlpha);
      a0 = (A + 1) + ((A - 1) * cosW0) + rootAAlpha;
      a1 = -2 * ((A - 1) + ((A + 1) * cosW0));
      a2 = (A + 1) + (((A - 1) * cosW0) - rootAAlpha);
      break;
    // H(s) = A * (A*s^2 + (sqrt(A)/Q)*s + 1)/(s^2 + (sqrt(A)/Q)*s + A)
    case 'highshelf':
      alpha = sinW0 / (2 * q);
      rootAAlpha = 2 * Math.sqrt(A) * alpha;

      b0 = A * ((A + 1 + rootAAlpha) + ((A - 1) * cosW0));
      b1 = -2 * A * ((A - 1) + ((A + 1) * cosW0));
      b2 = A * ((A + 1) + (((A - 1) * cosW0) - rootAAlpha));
      a0 = (A + 1 + rootAAlpha) - ((A - 1) * cosW0);
      a1 = 2 * ((A - 1) - ((A + 1) * cosW0));
      a2 = (A + 1) - ((A - 1) * cosW0) - rootAAlpha;
      break;
    default:
      break;
  }

  return {
    b0: b0 / a0,
    b1: b1 / a0,
    b2: b2 / a0,
    a1: a1 / a0,
    a2: a2 / a0,
  };
}

/**
 * Biquad Filter, based on Ircam's Waves-LFO Module.
 *
 * @see https://github.com/wavesjs/waves-lfo
 *
 * @param  {Object} options Filter options
 * @param  {String} [options.type='lowpass'] Type of filter. Available options:
 * - 'lowpass', 'highpass', 'bandpass_constant_skirt', 'bandpass',
 * - 'bandpass_constant_peak', 'notch', 'allpass', 'peaking', 'lowshelf',
 * 'highshelf'.
 * @param  {Number} [options.f0=1] Filter cutoff frequency (Hz)
 * @param  {Number} [options.gain=1] Filter gain
 * @param  {Number} [options.q=1] Filter resonance
 * @param  {Stream} source Input stream (scalar or vectorial)
 * @return {Stream} Stream of filtered values
 *
 * @example
 * const noise = periodic(20).rand().plot({ legend: 'Random Signal' });
 * const filtered = noise.biquad({ f0: 0.8 }).plot({ legend: 'Filtered Signal' });
 */
export default function biquad(options, source) {
  const attr = validateStream('biquad', specification, source.attr);
  const params = parseParameters(definitions, options);
  const {
    type,
    gain,
    f0,
    q,
  } = params;
  const coefs = calculateCoefs(attr.samplerate, type, gain, f0, q);
  let state;
  let filterFunction;
  if (attr.format === 'scalar') {
    state = {
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 0,
    };
    filterFunction = (x) => {
      const y = ((coefs.b0 * x)
              + (coefs.b1 * state.x1)
              + (coefs.b2 * state.x2))
              - (coefs.a1 * state.y1)
              - (coefs.a2 * state.y2);
      state.x2 = state.x1;
      state.x1 = x;
      state.y2 = state.y1;
      state.y1 = y;
      return y;
    };
  } else {
    state = Array.from(Array(attr.size), () => ({
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 0,
    }));
    filterFunction = frame => frame.map((x, i) => {
      const y = ((coefs.b0 * x)
              + (coefs.b1 * state[i].x1)
              + (coefs.b2 * state[i].x2))
              - (coefs.a1 * state[i].y1)
              - (coefs.a2 * state[i].y2);
      state[i].x2 = state[i].x1;
      state[i].x1 = x;
      state[i].y2 = state[i].y1;
      state[i].y1 = y;
      return y;
    });
  }
  return withAttr(attr)(map(filterFunction, source));
}
