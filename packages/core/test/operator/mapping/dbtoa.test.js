import test from 'ava';
import { withAttr } from '@coda/prelude';
import dbtoa from '../../../src/operator/mapping/dbtoa';
import { makeEventsFromArray, collectEventsFor } from '../../../../prelude/test/helper/testEnv';
import { approxArrayEqual, allTrue } from '../../../../prelude/test/helper/assertions';

test('Throws if the input stream has invalid attributes', async (t) => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  t.throws(() => {
    dbtoa(a);
  });
  a = withAttr({ format: 'wrong' })(a);
  t.throws(() => {
    dbtoa(a);
  });
  a = withAttr({ format: 'scalar' })(a);
  t.throws(() => {
    dbtoa(a);
  });
  a = withAttr({ format: 'scalar', size: 1 })(a);
  t.notThrows(() => {
    dbtoa(a);
  });
  a = withAttr({ format: 'vector', size: 10 })(a);
  t.notThrows(() => {
    dbtoa(a);
  });
});

test('Convert a scalar stream of amplitudes to decibels', async (t) => {
  const input = [
    0,
    -6.0206,
    -12.0412,
    -18.0618,
  ];
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = dbtoa(a);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    t.is(typeof value, 'number');
  });
  const expected = [1, 0.5, 0.25, 0.125];
  t.true(allTrue(approxArrayEqual(result.map(x => x.value), expected, 1e-3)));
});

test('Convert a vector stream of amplitudes to decibels', async (t) => {
  const input = [
    [0, 0],
    [-6.0206, -6.0206],
    [-12.0412, -12.0412],
    [-18.0618, -18.0618],
  ];
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = dbtoa(a);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, 2);
  const result = await collectEventsFor(input.length, stream);
  const expected = [
    [1, 1],
    [0.5, 0.5],
    [0.25, 0.25],
    [0.125, 0.125],
  ];
  result.forEach(({ value }, i) => {
    t.true(allTrue(approxArrayEqual(value, expected[i], 1e-3)));
  });
});
