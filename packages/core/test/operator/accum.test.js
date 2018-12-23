import { withAttr } from '@coda/prelude';
import accum from '../../src/operator/accum';
import { makeEventsFromArray, collectEventsFor } from '../../../prelude/test/helper/testEnv';

test('Throws if the input stream has invalid attributes', () => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  expect(() => accum(a)).toThrow();
  a = withAttr({ format: 'wrong' })(a);
  expect(() => accum(a)).toThrow();
  a = withAttr({ format: 'scalar' })(a);
  expect(() => accum(a)).toThrow();
  a = withAttr({ format: 'scalar', size: 1 })(a);
  accum(a);
  a = withAttr({ format: 'vector', size: 10 })(a);
  accum(a);
});

test('Accumulate the values of a scalar stream', async () => {
  const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(0, input));
  const stream = accum(a);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    expect(typeof value).toBe('number');
  });
  const expected = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55];
  expect(result.map(x => x.value)).toEqual(expected);
});

test('Accumulate the values of a vector stream', async () => {
  const input = [
    [1, 1],
    [2, 0.9],
    [3, 0.8],
    [4, 0.7],
    [5, 0.6],
    [6, 0.5],
    [7, 0.4],
    [8, 0.3],
    [9, 0.2],
    [10, 0.1],
  ];
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  const stream = accum(a);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(2);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    expect(value instanceof Array).toBeTruthy();
    value.forEach(v => expect(typeof v).toBe('number'));
  });
  const expected = [
    [1, 1],
    [3, 1.9],
    [6, 2.7],
    [10, 3.4],
    [15, 4.0],
    [21, 4.5],
    [28, 4.9],
    [36, 5.2],
    [45, 5.4],
    [55, 5.5],
  ];
  result.forEach(({ value }, i) => {
    value.forEach((val, j) => {
      expect(val).toBeCloseTo(expected[i][j]);
    });
  });
});
