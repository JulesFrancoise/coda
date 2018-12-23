import { withAttr } from '@coda/prelude';
import slide from '../../src/operator/slide';
import { makeEventsFromArray, collectEventsFor } from '../../../prelude/test/helper/testEnv';

test('Throws if the input stream has invalid attributes', () => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  expect(() => slide({}, a)).toThrow();
  a = withAttr({ format: 'wrong' })(a);
  expect(() => slide({}, a)).toThrow();
  a = withAttr({ format: 'scalar' })(a);
  expect(() => slide({}, a)).toThrow();
  a = withAttr({ format: 'scalar', size: 1 })(a);
  slide({}, a);
  a = withAttr({ format: 'vector', size: 10 })(a);
  slide({}, a);
});

test('Computes a sliding window on a scalar stream', async () => {
  const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(0, input));
  const stream = slide({ size: 5 }, a);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(5);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    expect(value instanceof Array).toBeTruthy();
  });
  const expected = [
    [1],
    [1, 2],
    [1, 2, 3],
    [1, 2, 3, 4],
    [1, 2, 3, 4, 5],
    [2, 3, 4, 5, 6],
    [3, 4, 5, 6, 7],
    [4, 5, 6, 7, 8],
    [5, 6, 7, 8, 9],
    [6, 7, 8, 9, 10],
  ];
  expect(result.map(x => x.value)).toEqual(expected);
});

test('Computes a sliding window on a vector stream', async () => {
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
  const stream = slide({ size: 5 }, a);
  expect(stream.attr.format).toBe('array');
  expect(stream.attr.size).toBe(10);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    expect(value instanceof Array).toBeTruthy();
    value.forEach(v => expect(v instanceof Array).toBeTruthy());
  });
  const expected = [
    [[1, 10]],
    [[1, 10], [2, 9]],
    [[1, 10], [2, 9], [3, 8]],
    [[1, 10], [2, 9], [3, 8], [4, 7]],
    [[1, 10], [2, 9], [3, 8], [4, 7], [5, 6]],
    [[2, 9], [3, 8], [4, 7], [5, 6], [6, 5]],
    [[3, 8], [4, 7], [5, 6], [6, 5], [7, 4]],
    [[4, 7], [5, 6], [6, 5], [7, 4], [8, 3]],
    [[5, 6], [6, 5], [7, 4], [8, 3], [9, 2]],
    [[6, 5], [7, 4], [8, 3], [9, 2], [10, 1]],
  ];
  expect(result.map(x => x.value)).toEqual(expected);
});

test('Computes a sliding window with a hop size on a vector stream', async () => {
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
  const stream = slide({ size: 5, hop: 3 }, a);
  expect(stream.attr.format).toBe('array');
  expect(stream.attr.size).toBe(10);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    expect(value instanceof Array).toBeTruthy();
    value.forEach(v => expect(v instanceof Array).toBeTruthy());
  });
  const expected = [
    [[1, 10]],
    [[1, 10], [2, 9], [3, 8], [4, 7]],
    [[3, 8], [4, 7], [5, 6], [6, 5], [7, 4]],
    [[6, 5], [7, 4], [8, 3], [9, 2], [10, 1]],
  ];
  expect(result.map(x => x.value)).toEqual(expected);
});
