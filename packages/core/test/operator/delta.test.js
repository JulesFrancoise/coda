import { withAttr } from '@coda/prelude';
import delta from '../../src/operator/delta';
import { makeEventsFromArray, collectEventsFor } from '../../../prelude/test/helper/testEnv';

test('Throws if the input stream has invalid attributes', async () => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  expect(() => delta({}, a)).toThrow();
  a = withAttr({ format: 'wrong' })(a);
  expect(() => delta({}, a)).toThrow();
  a = withAttr({ format: 'scalar' })(a);
  expect(() => delta({}, a)).toThrow();
  a = withAttr({ format: 'scalar', size: 1 })(a);
  delta({}, a);
  a = withAttr({ format: 'vector', size: 100 })(a);
  delta({}, a);
});

test('Returns 0 for a constant scalar stream', async () => {
  const input = Array(100).fill(12);
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(0, input));
  const stream = delta({}, a);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    expect(typeof value).toBe('number');
  });
  expect(result.slice(2).map(x => x.value)).toEqual(Array(98).fill(0));
});

test('Returns 1 for a stepping scalar stream', async () => {
  const input = Array.from(Array(100), (_, i) => i);
  const filterSize = 13;
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(0, input));
  const stream = delta({ size: filterSize }, a);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    expect(typeof value).toBe('number');
  });
  expect(result.slice(filterSize).map(x => x.value))
    .toEqual(Array(100 - filterSize).fill(1));
});

test('Differentiates a vector stream', async () => {
  const input = Array.from(Array(100), (_, i) => [2 * i, 12, -i]);
  const filterSize = 7;
  const a = withAttr({
    format: 'vector',
    size: 3,
  })(makeEventsFromArray(0, input));
  const stream = delta({ size: filterSize }, a);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(3);
  const result = await collectEventsFor(input.length, stream);
  expect(result.slice(filterSize).map(x => x.value))
    .toEqual(Array(100 - filterSize).fill([2, 0, -1]));
});


test('Accounts for the sampling rate (vector stream)', async () => {
  const input = Array.from(Array(100), (_, i) => [2 * i, 12, -i]);
  const filterSize = 7;
  const a = withAttr({
    format: 'vector',
    size: 3,
    samplerate: 100,
  })(makeEventsFromArray(0, input));
  const stream = delta({ size: filterSize }, a);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(3);
  const result = await collectEventsFor(input.length, stream);
  expect(result.slice(filterSize).map(x => x.value))
    .toEqual(Array(100 - filterSize).fill([200, 0, -100]));
});
