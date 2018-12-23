import { withAttr } from '@coda/prelude';
import biquad from '../../src/operator/biquad';
import rand from '../../src/operator/rand';
import { makeEventsFromArray, collectEventsFor } from '../../../prelude/test/helper/testEnv';

// TODO: Add test to check the validity of the values

const filterTypes = [
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
];

test('Throws if the input stream has invalid attributes', async () => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  expect(() => biquad({}, a)).toThrow();
  a = withAttr({ format: 'wrong' })(a);
  expect(() => biquad({}, a)).toThrow();
  a = withAttr({ format: 'scalar' })(a);
  expect(() => biquad({}, a)).toThrow();
  a = withAttr({ format: 'scalar', size: 1, samplerate: 100 })(a);
  biquad({}, a);
  a = withAttr({ format: 'vector', size: 10, samplerate: 100 })(a);
  biquad({}, a);
});

test('Filters a scalar stream', async () => {
  const input = new Array(100).fill(null);
  const a = withAttr({
    format: 'scalar',
    size: 1,
    samplerate: 100,
  })(makeEventsFromArray(0, input));
  filterTypes.forEach((filterType) => {
    const stream = biquad({ type: filterType, f0: 0.5 }, rand({}, a));
    expect(stream.attr.format).toBe('scalar');
    expect(stream.attr.size).toBe(1);
    collectEventsFor(input.length, stream).then((result) => {
      result.forEach(({ value }) => {
        expect(typeof value).toBe('number');
      });
    });
  });
});

test('Filters a Vector stream', async () => {
  const input = new Array(100).fill(null);
  const a = withAttr({
    format: 'vector',
    size: 2,
    samplerate: 100,
  })(makeEventsFromArray(0, input));
  filterTypes.forEach((filterType) => {
    const stream = biquad({ type: filterType, f0: 0.5 }, rand({ size: 2 }, a));
    expect(stream.attr.format).toBe('vector');
    expect(stream.attr.size).toBe(2);
    collectEventsFor(input.length, stream).then((result) => {
      result.forEach(({ value }) => {
        expect(value instanceof Array).toBeTruthy();
        value.forEach(v => expect(typeof v).toBe('number'));
      });
    });
  });
});
