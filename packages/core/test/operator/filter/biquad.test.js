import test from 'ava';
import biquad from '../../../src/operator/filter/biquad';
import rand from '../../../src/operator/mapping/rand';
import withAttr from '../../../src/lib/common/mixins';
import { makeEventsFromArray, collectEventsFor } from '../../helper/testEnv';

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

test('Throws if the input stream has invalid attributes', async (t) => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  t.throws(() => {
    biquad({}, a);
  });
  a = withAttr({ format: 'wrong' })(a);
  t.throws(() => {
    biquad({}, a);
  });
  a = withAttr({ format: 'scalar' })(a);
  t.throws(() => {
    biquad({}, a);
  });
  a = withAttr({ format: 'scalar', size: 1, samplerate: 100 })(a);
  t.notThrows(() => {
    biquad({}, a);
  });
  a = withAttr({ format: 'vector', size: 10, samplerate: 100 })(a);
  t.notThrows(() => {
    biquad({}, a);
  });
});

test('Filters a scalar stream', async (t) => {
  const input = new Array(100).fill(null);
  const a = withAttr({
    format: 'scalar',
    size: 1,
    samplerate: 100,
  })(makeEventsFromArray(0, input));
  filterTypes.forEach((filterType) => {
    let stream;
    t.notThrows(() => {
      stream = biquad({ type: filterType, f0: 0.5 }, rand({}, a));
    });
    t.is(stream.attr.format, 'scalar');
    t.is(stream.attr.size, 1);
    collectEventsFor(input.length, stream).then((result) => {
      result.forEach(({ value }) => {
        t.is(typeof value, 'number');
      });
    });
  });
});

test('Filters a Vector stream', async (t) => {
  const input = new Array(100).fill(null);
  const a = withAttr({
    format: 'vector',
    size: 2,
    samplerate: 100,
  })(makeEventsFromArray(0, input));
  filterTypes.forEach((filterType) => {
    let stream;
    t.notThrows(() => {
      stream = biquad({ type: filterType, f0: 0.5 }, rand({ size: 2 }, a));
    });
    t.is(stream.attr.format, 'vector');
    t.is(stream.attr.size, 2);
    collectEventsFor(input.length, stream).then((result) => {
      result.forEach(({ value }) => {
        t.true(value instanceof Array);
        value.forEach(v => t.is(typeof v, 'number'));
      });
    });
  });
});
