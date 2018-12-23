import { withAttr } from '@coda/prelude';
import mvavrg from '../../src/operator/mvavrg';
import { makeEventsFromArray, collectEventsFor } from '../../../prelude/test/helper/testEnv';

test('Throws if the input stream has invalid attributes', () => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  expect(() => mvavrg({}, a)).toThrow();
  a = withAttr({ format: 'wrong' })(a);
  expect(() => mvavrg({}, a)).toThrow();
  a = withAttr({ format: 'scalar' })(a);
  expect(() => mvavrg({}, a)).toThrow();
  a = withAttr({ format: 'scalar', size: 1 })(a);
  mvavrg({}, a);
  a = withAttr({ format: 'vector', size: 10 })(a);
  mvavrg({}, a);
});

test('Computes a moving average on a scalar stream', async () => {
  const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(0, input));
  const stream = mvavrg({ size: 5 }, a);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    expect(typeof value).toBe('number');
  });
  const expected = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8];
  const res = result.map(x => x.value);
  expect(res.length).toBe(expected.length);
  res.forEach((value, i) => {
    expect(value).toBeCloseTo(expected[i]);
  });
});

test('Computes a moving average on a vector stream', async () => {
  const input = [
    [1, 10],
    [2, 9],
    [3, 8],
    [4, 7],
    [5, 6],
    [6, 5],
    [7, 4],
    [8, 3],
    [9, 2],
    [10, 1],
  ];
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  const stream = mvavrg({ size: 5 }, a);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(2);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    expect(value instanceof Array).toBeTruthy();
    value.forEach(v => expect(typeof v).toBe('number'));
  });
  const expected = [
    [1, 10],
    [1.5, 9.5],
    [2, 9],
    [2.5, 8.5],
    [3, 8],
    [4, 7],
    [5, 6],
    [6, 5],
    [7, 4],
    [8, 3],
  ];
  result.forEach(({ value }, i) => {
    value.forEach((val, j) => {
      expect(val).toBeCloseTo(expected[i][j]);
    });
  });
});
