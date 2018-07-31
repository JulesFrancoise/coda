import test from 'ava';
import { withAttr } from '@coda/prelude';
import accum from '../../../src/operator/mapping/accum';
import { makeEventsFromArray, collectEventsFor } from '../../../../prelude/test/helper/testEnv';
import { approxArrayEqual, allTrue } from '../../../../prelude/test/helper/assertions';

test('Throws if the input stream has invalid attributes', (t) => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  t.throws(() => {
    accum(a);
  });
  a = withAttr({ format: 'wrong' })(a);
  t.throws(() => {
    accum(a);
  });
  a = withAttr({ format: 'scalar' })(a);
  t.throws(() => {
    accum(a);
  });
  a = withAttr({ format: 'scalar', size: 1 })(a);
  t.notThrows(() => {
    accum(a);
  });
  a = withAttr({ format: 'vector', size: 10 })(a);
  t.notThrows(() => {
    accum(a);
  });
});

test('Accumulate the values of a scalar stream', async (t) => {
  const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = accum(a);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    t.is(typeof value, 'number');
  });
  const expected = [0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55];
  t.deepEqual(result.map(x => x.value), expected);
});

test('Computes a moving average on a vector stream', async (t) => {
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
  let stream;
  t.notThrows(() => {
    stream = accum(a);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, 2);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    t.true(value instanceof Array);
    value.forEach(v => t.is(typeof v, 'number'));
  });
  const expected = [
    [0, 0],
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
  for (let i = 0; i < expected.length; i += 1) {
    t.true(allTrue(approxArrayEqual(result[i].value, expected[i], 1e-5)));
  }
});
