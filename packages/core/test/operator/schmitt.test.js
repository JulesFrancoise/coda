import { withAttr } from '@coda/prelude';
import schmitt from '../../src/operator/schmitt';
import { makeEventsFromArray, collectEventsFor } from '../../../prelude/test/helper/testEnv';

test('Throws if the input stream has invalid attributes', async () => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  expect(() => schmitt({}, a)).toThrow();
  a = withAttr({ format: 'wrong' })(a);
  expect(() => schmitt({}, a)).toThrow();
  a = withAttr({ format: 'scalar' })(a);
  expect(() => schmitt({}, a)).toThrow();
  a = withAttr({ format: 'scalar', size: 1 })(a);
  schmitt({}, a);
  a = withAttr({ format: 'vector', size: 100 })(a);
  schmitt({}, a);
});

test('Triggers on up and down thresholds with a scalar stream', async () => {
  const ramp = Array.from(Array(11), (_, i) => i / 10);
  const input = ramp.concat([...ramp].reverse(), ramp, [...ramp].reverse());
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(1, input));
  const stream = schmitt({}, a);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(input.length + 1, stream);
  const expected = [
    { time: 0, value: 0 },
    { time: 9, value: 1 },
    { time: 20, value: 0 },
    { time: 31, value: 1 },
    { time: 42, value: 0 },
  ];
  expect(result).toEqual(expected);
});

test('Triggers on up and down thresholds with a scalar stream (continuous mode)', async () => {
  const ramp = Array.from(Array(11), (_, i) => i / 10);
  const input = ramp.concat([...ramp].reverse(), ramp, [...ramp].reverse());
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(1, input));
  const stream = schmitt({ continuous: true }, a);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(input.length + 1, stream);
  const er1 = Array.from(Array(11), (_, i) => (i >= 9 ? 1 : 0));
  const er2 = Array.from(Array(11), (_, i) => (i >= 9 ? 0 : 1));
  const expected = [].concat(er1, er2, er1, er2);
  expect(result.map(x => x.value)).toEqual(expected);
});

test('Triggers on up and down thresholds with a vector stream', async () => {
  const ramp = Array.from(Array(11), (_, i) => [i / 10, i / 10]);
  const input = ramp.concat([...ramp].reverse(), ramp, [...ramp].reverse());
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(1, input));
  const stream = schmitt({}, a);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(2);
  const result = await collectEventsFor(input.length + 1, stream);
  const expected = [
    { time: 0, value: [0, 0] },
    { time: 9, value: [1, 1] },
    { time: 20, value: [0, 0] },
    { time: 31, value: [1, 1] },
    { time: 42, value: [0, 0] },
  ];
  expect(result).toEqual(expected);
});

test('Triggers on up and down thresholds with a vector stream (continuous mode)', async () => {
  const ramp = Array.from(Array(11), (_, i) => [i / 10, i / 10]);
  const input = ramp.concat([...ramp].reverse(), ramp, [...ramp].reverse());
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(1, input));
  const stream = schmitt({ continuous: true }, a);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(2);
  const result = await collectEventsFor(input.length + 1, stream);
  const er1 = Array.from(Array(11), (_, i) => (i >= 9 ? [1, 1] : [0, 0]));
  const er2 = Array.from(Array(11), (_, i) => (i >= 9 ? [0, 0] : [1, 1]));
  const expected = [].concat(er1, er2, er1, er2);
  expect(result.map(x => x.value)).toEqual(expected);
});
