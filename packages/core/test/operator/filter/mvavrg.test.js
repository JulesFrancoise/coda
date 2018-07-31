import test from 'ava';
import { withAttr } from '@coda/prelude';
import mvavrg from '../../../src/operator/filter/mvavrg';
import { makeEventsFromArray, collectEventsFor } from '../../../../prelude/test/helper/testEnv';
import { approxArrayEqual, allTrue } from '../../../../prelude/test/helper/assertions';

test('Throws if the input stream has invalid attributes', (t) => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  t.throws(() => {
    mvavrg({}, a);
  });
  a = withAttr({ format: 'wrong' })(a);
  t.throws(() => {
    mvavrg({}, a);
  });
  a = withAttr({ format: 'scalar' })(a);
  t.throws(() => {
    mvavrg({}, a);
  });
  a = withAttr({ format: 'scalar', size: 1 })(a);
  t.notThrows(() => {
    mvavrg({}, a);
  });
  a = withAttr({ format: 'vector', size: 10 })(a);
  t.notThrows(() => {
    mvavrg({}, a);
  });
});

test('Computes a moving average on a scalar stream', async (t) => {
  const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = mvavrg({ size: 5 }, a);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    t.is(typeof value, 'number');
  });
  const expected = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8];
  t.true(allTrue(approxArrayEqual(result.map(x => x.value), expected, 1e-5)));
});

test('Computes a moving average on a vector stream', async (t) => {
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
  let stream;
  t.notThrows(() => {
    stream = mvavrg({ size: 5 }, a);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, 2);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    t.true(value instanceof Array);
    value.forEach(v => t.is(typeof v, 'number'));
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
    t.true(allTrue(approxArrayEqual(value, expected[i], 1e-5)));
  });
});
