import { withAttr } from '@coda/prelude';
import autoscale from '../../src/operator/autoscale';
import { makeEventsFromArray, collectEventsFor } from '../../../prelude/test/helper/testEnv';

test('Throws if the input stream has invalid attributes', async () => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  expect(() => autoscale(a)).toThrow();
  a = withAttr({ format: 'wrong' })(a);
  expect(() => autoscale(a)).toThrow();
  a = withAttr({ format: 'scalar' })(a);
  expect(() => autoscale(a)).toThrow();
  a = withAttr({ format: 'scalar', size: 1 })(a);
  autoscale(a);
  a = withAttr({ format: 'vector', size: 100 })(a);
  autoscale(a);
});

test('Scales a scalar stream to the range [0; 1]', async () => {
  const input = Array.from(Array(200), () => (Math.random() * 1200) - 300);
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(0, input));
  const stream = autoscale(a);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    expect(typeof value).toBe('number');
  });
  const minmax = result.map(x => x.value).reduce(
    (x, y) => ({ min: Math.min(x.min, y), max: Math.max(x.max, y) }),
    { min: +Infinity, max: -Infinity },
  );
  expect(minmax.min).toBe(0);
  expect(minmax.max).toBe(1);
});

test('Scales a vector stream to the range [0; 1]', async () => {
  const input = Array.from(
    Array(200),
    () => [(Math.random() * 1200) - 300, (Math.random() * 4) + 2],
  );
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  const stream = autoscale(a);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(2);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    expect(value instanceof Array).toBeTruthy();
  });
  const minmax = result.map(x => x.value).reduce(
    (x, y) => y.map((v, i) => ({ min: Math.min(x[i].min, v), max: Math.max(x[i].max, v) })),
    [{ min: +Infinity, max: -Infinity }, { min: +Infinity, max: -Infinity }],
  );
  expect(minmax[0].min).toBe(0);
  expect(minmax[0].max).toBe(1);
  expect(minmax[1].min).toBe(0);
  expect(minmax[1].max).toBe(1);
});
