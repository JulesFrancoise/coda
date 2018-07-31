import test from 'ava';
import { withAttr } from '@coda/prelude';
import schmitt from '../../../src/operator/basic/schmitt';
import { makeEventsFromArray, collectEventsFor } from '../../../../prelude/test/helper/testEnv';

test('Throws if the input stream has invalid attributes', async (t) => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  t.throws(() => {
    schmitt({}, a);
  });
  a = withAttr({ format: 'wrong' })(a);
  t.throws(() => {
    schmitt({}, a);
  });
  a = withAttr({ format: 'scalar' })(a);
  t.throws(() => {
    schmitt({}, a);
  });
  a = withAttr({ format: 'scalar', size: 1 })(a);
  t.notThrows(() => {
    schmitt({}, a);
  });
  a = withAttr({ format: 'vector', size: 100 })(a);
  t.notThrows(() => {
    schmitt({}, a);
  });
});

test('Triggers on up and down thresholds with a scalar stream', async (t) => {
  const ramp = Array.from(Array(11), (_, i) => i / 10);
  const input = ramp.concat([...ramp].reverse(), ramp, [...ramp].reverse());
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(1, input));
  let stream;
  t.notThrows(() => {
    stream = schmitt({}, a);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(input.length + 1, stream);
  const expected = [
    { time: 0, value: 0 },
    { time: 9, value: 1 },
    { time: 20, value: 0 },
    { time: 31, value: 1 },
    { time: 42, value: 0 },
  ];
  t.deepEqual(result, expected);
});

test('Triggers on up and down thresholds with a scalar stream (continuous mode)', async (t) => {
  const ramp = Array.from(Array(11), (_, i) => i / 10);
  const input = ramp.concat([...ramp].reverse(), ramp, [...ramp].reverse());
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(1, input));
  let stream;
  t.notThrows(() => {
    stream = schmitt({ continuous: true }, a);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(input.length + 1, stream);
  const er1 = Array.from(Array(11), (_, i) => (i >= 9 ? 1 : 0));
  const er2 = Array.from(Array(11), (_, i) => (i >= 9 ? 0 : 1));
  const expected = [].concat(er1, er2, er1, er2);
  t.deepEqual(result.map(x => x.value), expected);
});

test('Triggers on up and down thresholds with a vector stream', async (t) => {
  const ramp = Array.from(Array(11), (_, i) => [i / 10, i / 10]);
  const input = ramp.concat([...ramp].reverse(), ramp, [...ramp].reverse());
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(1, input));
  let stream;
  t.notThrows(() => {
    stream = schmitt({}, a);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, 2);
  const result = await collectEventsFor(input.length + 1, stream);
  const expected = [
    { time: 0, value: [0, 0] },
    { time: 9, value: [1, 1] },
    { time: 20, value: [0, 0] },
    { time: 31, value: [1, 1] },
    { time: 42, value: [0, 0] },
  ];
  t.deepEqual(result, expected);
});

test('Triggers on up and down thresholds with a vector stream (continuous mode)', async (t) => {
  const ramp = Array.from(Array(11), (_, i) => [i / 10, i / 10]);
  const input = ramp.concat([...ramp].reverse(), ramp, [...ramp].reverse());
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(1, input));
  let stream;
  t.notThrows(() => {
    stream = schmitt({ continuous: true }, a);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, 2);
  const result = await collectEventsFor(input.length + 1, stream);
  const er1 = Array.from(Array(11), (_, i) => (i >= 9 ? [1, 1] : [0, 0]));
  const er2 = Array.from(Array(11), (_, i) => (i >= 9 ? [0, 0] : [1, 1]));
  const expected = [].concat(er1, er2, er1, er2);
  t.deepEqual(result.map(x => x.value), expected);
});
