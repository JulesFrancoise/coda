import { parseParameters, withAttr } from '@coda/prelude';
import { withItems, periodic, now } from '@most/core';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  start: {
    type: 'float',
    default: 0,
  },
  end: {
    type: 'float',
    default: 1,
  },
  duration: {
    type: 'float',
    default: 1000,
  },
  period: {
    type: 'float',
    default: 10,
  },
};

/**
 * Generate a data ramp of fixed duration. The line is a single Stream
 * that terminates at the end of the ramp.
 *
 * @param  {Object} [options={}] Line options
 * @param  {Number} [options.start=0] Start value
 * @param  {Number} [options.end=1] End value
 * @param  {Number} [options.duration=1000] Duration in ms
 * @param  {Number} [options.period=10] Sampling period in ms
 * @return {Stream} Finite stream
 */
export default function line(options = {}) {
  const params = parseParameters(definitions, options);
  const numPoints = 1 + Math.floor(params.duration / params.period);
  if (params.duration < params.period) {
    return withAttr({
      format: 'scalar',
      size: 1,
      samplerate: 1000 / params.period,
    })(now(params.end));
  }
  const step = (params.end - params.start) / (numPoints - 1);
  const values = Array.from(Array(numPoints), (_, i) => params.start + (i * step));
  return withAttr({
    format: 'scalar',
    size: 1,
    samplerate: 1000 / params.period,
  })(withItems(values, periodic(params.period)));
}
