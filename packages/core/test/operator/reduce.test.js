import { withAttr } from '@coda/prelude';
import reduce, {
  sum,
  prod,
  min,
  max,
  minmax,
} from '../../src/operator/reduce';
import { makeEventsFromArray, collectEventsFor } from '../../../prelude/test/helper/testEnv';

test('Throws if the input stream has invalid attributes', async () => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  expect(() => reduce((s, x) => s + x, 0, a)).toThrow();
  a = withAttr({ format: 'wrong' })(a);
  expect(() => reduce((s, x) => s + x, 0, a)).toThrow();
  a = withAttr({ format: 'scalar' })(a);
  expect(() => reduce((s, x) => s + x, 0, a)).toThrow();
  a = withAttr({ format: 'vector', size: 100 })(a);
  reduce((s, x) => s + x, 0, a);
  [sum, prod, min, max, minmax].forEach((f) => {
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

test('Reduce the values of a vector stream', async () => {
  const input = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  const stream = reduce((s, x) => s.concat([x]), [], a);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(input.length, stream);
  expect(result.map(x => x.value)).toEqual(input);
});


test('[sum] sums the values of a vector stream', async () => {
  const input = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  const stream = sum(a);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(input.length, stream);
  expect(result.map(x => x.value)).toEqual(input.map(([x, y]) => x + y));
});

test('[prod] multiplies the values of a vector stream', async () => {
  const input = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  const stream = prod(a);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(input.length, stream);
  expect(result.map(x => x.value)).toEqual(input.map(([x, y]) => x * y));
});

test('[min] compute the minimum of a vector stream', async () => {
  const input = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  const stream = min(a);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(input.length, stream);
  expect(result.map(x => x.value)).toEqual(input.map(([x, y]) => Math.min(x, y)));
});

test('[max] compute the maximum of a vector stream', async () => {
  const input = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  const stream = max(a);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(input.length, stream);
  expect(result.map(x => x.value)).toEqual(input.map(([x, y]) => Math.max(x, y)));
});

test('[minmax] compute the min/max of a vector stream', async () => {
  const input = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  const stream = minmax(a);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(2);
  const result = await collectEventsFor(input.length, stream);
  expect(result.map(x => x.value)).toEqual(input.map(([x, y]) => [Math.min(x, y), Math.max(x, y)]));
});
