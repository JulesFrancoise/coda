import test from 'ava';
import { withAttr } from '@coda/prelude';
import clip from '../../../src/operator/mapping/clip';
import { makeEventsFromArray, collectEventsFor } from '../../../../prelude/test/helper/testEnv';

test('Throws if the input stream has no attributes', async (t) => {
  const a = makeEventsFromArray(0, []);
  delete a.attr;
  t.throws(() => {
    clip({}, a);
  });
});

test('With default options, clip to [0, 1]', async (t) => {
  const input = [0.4, 3, -1, 0.7];
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = clip({}, a);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    t.is(typeof value, 'number');
    t.true(value >= 0);
    t.true(value <= 1);
  });
  const expected = [0.4, 1, 0, 0.7];
  t.deepEqual(result.map(x => x.value), expected);
});

test('Clip to [min, max]', async (t) => {
  const input = [0.4, 3, -2, 0.7, 5];
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = clip({ min: -1, max: 4 }, a);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    t.is(typeof value, 'number');
    t.true(value >= -1);
    t.true(value <= 4);
  });
  const expected = [0.4, 3, -1, 0.7, 4];
  t.deepEqual(result.map(x => x.value), expected);
});

test('Applies to vector streams', async (t) => {
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
  let stream;
  t.notThrows(() => {
    stream = clip({ min: -1, max: 4 }, a);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, 2);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    t.true(value instanceof Array);
    value.forEach((v) => {
      t.true(v >= -1);
      t.true(v <= 4);
    });
  });
  const expected = [
    [0.4, 0.4],
    [3, 3],
    [-1, -1],
    [0.7, 4],
    [4, 4],
  ];
  t.deepEqual(result.map(x => x.value), expected);
});
