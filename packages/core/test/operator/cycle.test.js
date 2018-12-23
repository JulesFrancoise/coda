import { withAttr } from '@coda/prelude';
import cycle from '../../src/operator/cycle';
import { makeEventsFromArray, collectEventsFor } from '../../../prelude/test/helper/testEnv';

test('Throws if the buffer is invalid', () => {
  let a = makeEventsFromArray(0, []);
  a = withAttr({ format: 'wrong' })(a);
  expect(() => cycle(1, a)).toThrow();
  expect(() => cycle(false, a)).toThrow();
  expect(() => cycle({ a: 1 }, a)).toThrow();
  expect(() => cycle([], a)).toThrow();
  expect(() => cycle('', a)).toThrow();
  cycle('abcd', a);
  cycle(['a', 'b', 'c', 'd'], a);
  cycle([1, 2, 3, 4], a);
  cycle([[1, 2], [3, 4]], a);
  cycle([{ a: 1 }, { a: 2 }, { a: 3 }], a);
});

test('Cycles through an Array of numbers', async () => {
  const a = withAttr({})(makeEventsFromArray(0, new Array(20).fill(null)));
  const buf = [1, 3, 5, 2];
  const stream = cycle(buf, a);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(1, stream);
  result.forEach(({ value }, i) => {
    expect(typeof value).toBe('number');
    expect(value).toBe(buf[i % 4]);
  });
});

test('Cycles through an Array of strings', async () => {
  const a = withAttr({})(makeEventsFromArray(0, new Array(20).fill(null)));
  const buf = ['a', 'd', 'b', 'x', 'y'];
  const stream = cycle(buf, a);
  expect(stream.attr.format).toBe('string');
  const result = await collectEventsFor(1, stream);
  result.forEach(({ value }, i) => {
    expect(typeof value).toBe('string');
    expect(value).toBe(buf[i % 5]);
  });
});

test('Cycles through an Array of objects', async () => {
  const a = withAttr({})(makeEventsFromArray(0, new Array(20).fill(null)));
  const buf = [{ a: 1 }, { a: 2 }, { a: 3 }];
  const stream = cycle(buf, a);
  expect(stream.attr.format).toBe('anything');
  const result = await collectEventsFor(1, stream);
  result.forEach(({ value }, i) => {
    expect(typeof value).toBe('object');
    expect(value).toBe(buf[i % 3]);
  });
});

test('Cycles through an Array of Arrays of Numbers', async () => {
  const a = withAttr({})(makeEventsFromArray(0, new Array(20).fill(null)));
  const buf = [[1, 2], [3, 4], [5, 6]];
  const stream = cycle(buf, a);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(2);
  const result = await collectEventsFor(1, stream);
  result.forEach(({ value }, i) => {
    expect(typeof value).toBe('object');
    expect(value).toBe(buf[i % 3]);
  });
});

test('Cycles through an Array of Booleans', async () => {
  const a = withAttr({})(makeEventsFromArray(0, new Array(20).fill(null)));
  const buf = [true, true, false, true];
  const stream = cycle(buf, a);
  expect(stream.attr.format).toBe('boolean');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(1, stream);
  result.forEach(({ value }, i) => {
    expect(typeof value).toBe('boolean');
    expect(value).toBe(buf[i % 4]);
  });
});

test('Cycles through a String', async () => {
  const a = withAttr({})(makeEventsFromArray(0, new Array(20).fill(null)));
  const buf = 'abcxyz';
  const stream = cycle(buf, a);
  expect(stream.attr.format).toBe('string');
  const result = await collectEventsFor(1, stream);
  result.forEach(({ value }, i) => {
    expect(typeof value).toBe('string');
    expect(value).toBe(buf[i % 6]);
  });
});
