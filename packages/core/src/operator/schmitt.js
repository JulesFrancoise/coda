import { parseParameters, validateStream, withAttr } from '@coda/prelude';
import { map, skipRepeats, skipRepeatsWith } from '@most/core';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  up: {
    type: 'float',
    default: 0.9,
  },
  down: {
    type: 'float',
    default: 0.1,
  },
  continuous: {
    type: 'boolean',
    default: false,
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
};

/**
 * Scalar Schmitt trigger factory function
 * @param  {number} down Ascending threshold
 * @param  {number} up   Descending threshold
 * @return {function}    Schmitt trigger function
 *
 * @private
 */
function triggerScalar(down, up) {
  let state = 0;
  return (x) => {
    if (state === 0 && x >= up) {
      state = 1;
      return 1;
    }
    if (state === 1 && x <= down) {
      state = 0;
      return 0;
    }
    return state;
  };
}

/**
 * A Schmitt Trigger binarizes a data stream using two thresholds (up and down)
 * with hysteresis. It triggers 1 if the value exceeds the `up` threshold, and
 * 0 if the values becomes lower to the `down` threshold.
 *
 * @see https://en.wikipedia.org/wiki/Schmitt_trigger
 *
 * @param  {object}  [options={}]               Schmitt trigger options
 * @param  {number}  [options.up=0.9]           Ascending threshold
 * @param  {number}  [options.down=0.1]         Descending threshold
 * @param  {boolean} [options.continuous=false] Continuous output mode
 * @param  {Stream}  [source]                   Input Stream (scalar or vector)
 * @return {Stream}                             Binary Stream (scalar or
 * vector). By default, the output stream contains events only on triggers. If
 * `options.continuous = true`, then the output stream contains as many events
 * as the input stream.
 *
 * @example
 * a = periodic(10)
 *   .rand()
 *   .biquad({ f0: 5 })
 *   .plot({ legend: 'Raw Signal'})
 *   .schmitt({ up: 0.6, down: 0.4, continuous: true })
 *   .plot({ legend: 'Schmitt Trigger', fill: 'bottom' });
 */
export default function schmitt(options, source) {
  const attr = validateStream('schmitt', specification, source.attr);
  const params = parseParameters(definitions, options);
  if (!params.continuous) {
    delete attr.samplerate;
  }
  if (attr.format === 'scalar') {
    const f = triggerScalar(params.down, params.up);
    return params.continuous
      ? withAttr(attr)(map(f, source))
      : withAttr(attr)(skipRepeats(map(f, source)));
  }
  const triggerFuncs = Array.from(
    Array(attr.size),
    () => triggerScalar(params.down, params.up),
  );
  const f = frame => frame.map((x, i) => triggerFuncs[i](x));
  return params.continuous
    ? withAttr(attr)(map(f, source))
    : withAttr(attr)(skipRepeatsWith(
      (a, b) => a.reduce((t, x, i) => t && x === b[i], true),
      map(f, source),
    ));
}
