import { withAttr } from '@coda/prelude';
import clip from '../../src/operator/clip';
import { makeEventsFromArray, collectEventsFor } from '../../../prelude/test/helper/testEnv';

test('Throws if the input stream has no attributes', async () => {
  const a = makeEventsFromArray(0, []);
  delete a.attr;
  expect(() => clip({}, a)).toThrow();
});

test('With default options, clip to [0, 1]', async () => {
  const input = [0.4, 3, -1, 0.7];
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(0, input));
  const stream = clip({}, a);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    expect(typeof value).toBe('number');
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(1);
  });
  const expected = [0.4, 1, 0, 0.7];
  expect(result.map(x => x.value)).toEqual(expected);
});

test('Clip to [min, max]', async () => {
  const input = [0.4, 3, -2, 0.7, 5];
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(0, input));
  const stream = clip({ min: -1, max: 4 }, a);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    expect(typeof value).toBe('number');
    expect(value).toBeGreaterThanOrEqual(-1);
    expect(value).toBeLessThanOrEqual(4);
  });
  const expected = [0.4, 3, -1, 0.7, 4];
  expect(result.map(x => x.value)).toEqual(expected);
});

test('Applies to vector streams', async () => {
  const input = [
    [0.4, 0.4],
    [3, 3],
    [-2, -3],
    [0.7, 12],
    [5, 5],
  ];
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  const stream = clip({ min: -1, max: 4 }, a);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(2);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    expect(value instanceof Array).toBeTruthy();
    value.forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(-1);
      expect(v).toBeLessThanOrEqual(4);
    });
  });
  const expected = [
    [0.4, 0.4],
    [3, 3],
    [-1, -1],
    [0.7, 4],
    [4, 4],
  ];
  expect(result.map(x => x.value)).toEqual(expected);
});
