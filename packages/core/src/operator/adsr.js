import { parseParameters, validateStream, withAttr } from '@coda/prelude';
import {
  map,
  switchLatest,
  mergeArray,
  now,
  at,
  filter,
} from '@most/core';
import lineto from './lineto';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  attack: {
    type: 'float',
    default: 500,
  },
  decay: {
    type: 'float',
    default: 200,
  },
  sustain: {
    type: 'float',
    default: 0.8,
  },
  release: {
    type: 'float',
    default: 1000,
  },
  period: {
    type: 'float',
    default: 10,
  },
};

/**
 * Stream I/O Attributes Specification
 * @ignore
 */
const specification = sr => ({
  format: {
    required: true,
    check: 'scalar',
  },
  size: {
    required: true,
    check: { min: 1, max: 1 },
  },
  samplerate: {
    required: false,
    transform() {
      return sr;
    },
  },
});

/**
 * Generate ADSR data stream envelopes (not audio envelopes) from a binary stream.
 *
 * @param  {Object} [options={}] Envelope options
 * @param  {Object} [options.attack=500] Attack time
 * @param  {Object} [options.decay=200] Decay time
 * @param  {Object} [options.sustain=8] Sustain level
 * @param  {Object} [options.release=1000] Release time
 * @param  {Object} [options.period=10] Sampling period
 * @param  {Stream} source Source binary Stream
 * @return {Stream} Envelope values
 */
export default function adsr(options = {}, source) {
  const {
    attack,
    decay,
    sustain,
    release,
    period,
  } = parseParameters(definitions, options);
  const sr = 1000 / period;
  const attr = validateStream('adsr', specification(sr), source.attr);
  let sustainedValue = 0;
  function f(x) {
    if (x) {
      sustainedValue = sustain * x;
      return filter(y => !!y, mergeArray([
        now([x, attack]),
        at(attack, [sustainedValue, decay]),
      ]));
    }
    return now([0, release]);
  }
  return withAttr(attr)(lineto(
    {},
    withAttr({ format: 'vector', size: 2 })(filter(
      x => x !== null,
      switchLatest(map(f, source)),
    )),
  ));
}
