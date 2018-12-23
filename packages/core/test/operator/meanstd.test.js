import { withAttr } from '@coda/prelude';
import { mean, std, meanstd } from '../../src/operator/meanstd';
import { makeEventsFromArray, collectEventsFor } from '../../../prelude/test/helper/testEnv';

test('Throws if the input stream has invalid attributes', async () => {
  [mean, std, meanstd].forEach((f) => {
    let a = makeEventsFromArray(0, []);
    delete a.attr;
    expect(() => f(a)).toThrow();
    a = withAttr({ format: 'wrong' })(a);
    expect(() => f(a)).toThrow();
    a = withAttr({ format: 'scalar' })(a);
    expect(() => f(a)).toThrow();
    a = withAttr({ format: 'vector', size: 100 })(a);
    f(a);
  });
});

test('[mean] computes the mean of a vector stream', async () => {
  const input = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  const stream = mean(a);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(input.length, stream);
  expect(result.map(x => x.value)).toEqual(input.map(([x, y]) => (x + y) / 2));
});

test('[std] computes the std of a vector stream', async () => {
  const input = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  const stream = std(a);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(input.length, stream);
  const std2 = ([x, y]) => {
    const m = (x + y) / 2;
    return Math.sqrt((((x - m) ** 2) + ((y - m) ** 2)) / 2);
  };
  expect(result.map(x => x.value)).toEqual(input.map(std2));
});

test('[meanstd] computes the [mean, std] of a vector stream', async () => {
  const input = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  const stream = meanstd(a);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(input.length, stream);
  const meanstd2 = ([x, y]) => {
    const m = (x + y) / 2;
    const s = Math.sqrt((((x - m) ** 2) + ((y - m) ** 2)) / 2);
    return [m, s];
  };
  expect(result.map(x => x.value)).toEqual(input.map(meanstd2));
});
