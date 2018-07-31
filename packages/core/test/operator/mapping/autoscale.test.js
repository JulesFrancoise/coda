import test from 'ava';
import { withAttr } from '@coda/prelude';
import autoscale from '../../../src/operator/mapping/autoscale';
import { makeEventsFromArray, collectEventsFor } from '../../../../prelude/test/helper/testEnv';

test('Throws if the input stream has invalid attributes', async (t) => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  t.throws(() => {
    autoscale(a);
  });
  a = withAttr({ format: 'wrong' })(a);
  t.throws(() => {
    autoscale(a);
  });
  a = withAttr({ format: 'scalar' })(a);
  t.throws(() => {
    autoscale(a);
  });
  a = withAttr({ format: 'scalar', size: 1 })(a);
  t.notThrows(() => {
    autoscale(a);
  });
  a = withAttr({ format: 'vector', size: 100 })(a);
  t.notThrows(() => {
    autoscale(a);
  });
});

test('Scales a scalar stream to the range [0; 1]', async (t) => {
  const input = Array.from(Array(200), () => (Math.random() * 1200) - 300);
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = autoscale(a);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    t.is(typeof value, 'number');
  });
  const minmax = result.map(x => x.value).reduce(
    (x, y) => ({ min: Math.min(x.min, y), max: Math.max(x.max, y) }),
    { min: +Infinity, max: -Infinity },
  );
  t.is(minmax.min, 0);
  t.is(minmax.max, 1);
});

test('Scales a vector stream to the range [0; 1]', async (t) => {
  const input = Array.from(
    Array(200),
    () => [(Math.random() * 1200) - 300, (Math.random() * 4) + 2],
  );
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = autoscale(a);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, 2);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    t.true(value instanceof Array);
  });
  const minmax = result.map(x => x.value).reduce(
    (x, y) => y.map((v, i) => ({ min: Math.min(x[i].min, v), max: Math.max(x[i].max, v) })),
    [{ min: +Infinity, max: -Infinity }, { min: +Infinity, max: -Infinity }],
  );
  t.is(minmax[0].min, 0);
  t.is(minmax[0].max, 1);
  t.is(minmax[1].min, 0);
  t.is(minmax[1].max, 1);
});
