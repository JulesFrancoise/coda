import { withAttr } from '@coda/prelude';
import atodb from '../src/operator/atodb';
import { makeEventsFromArray, collectEventsFor } from '../../prelude/test/helper/testEnv';

test('Throws if the input stream has invalid attributes', async () => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  expect(() => atodb(a));
  a = withAttr({ format: 'wrong' })(a);
  expect(() => atodb(a));
  a = withAttr({ format: 'scalar' })(a);
  expect(() => atodb(a));
  a = withAttr({ format: 'scalar', size: 1 })(a);
  atodb(a);
  a = withAttr({ format: 'vector', size: 10 })(a);
  atodb(a);
});

test('Convert a scalar stream of amplitudes to decibels', async () => {
  const input = [1, 0.5, 0.25, 0.125];
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(0, input));
  const stream = atodb(a);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    expect(typeof value).toBe('number');
  });
  const expected = [
    0,
    -6.0206,
    -12.0412,
    -18.0618,
  ];
  result.forEach(({ value }, i) => {
    expect(value).toBeCloseTo(expected[i]);
  });
});

test('Convert a vector stream of amplitudes to decibels', async () => {
  const input = [
    [1, 1],
    [0.5, 0.5],
    [0.25, 0.25],
    [0.125, 0.125],
  ];
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  const stream = atodb(a);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(2);
  const result = await collectEventsFor(input.length, stream);
  const expected = [
    [0, 0],
    [-6.0206, -6.0206],
    [-12.0412, -12.0412],
    [-18.0618, -18.0618],
  ];
  result.forEach(({ value }, i) => {
    value.forEach((val, j) => {
      expect(val).toBeCloseTo(expected[i][j]);
    });
  });
});
