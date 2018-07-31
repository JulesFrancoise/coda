import test from 'ava';
import { withAttr } from '@coda/prelude';
import delta from '../../../src/operator/mapping/delta';
import { makeEventsFromArray, collectEventsFor } from '../../../../prelude/test/helper/testEnv';

test('Throws if the input stream has invalid attributes', async (t) => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  t.throws(() => {
    delta({}, a);
  });
  a = withAttr({ format: 'wrong' })(a);
  t.throws(() => {
    delta({}, a);
  });
  a = withAttr({ format: 'scalar' })(a);
  t.throws(() => {
    delta({}, a);
  });
  a = withAttr({ format: 'scalar', size: 1 })(a);
  t.notThrows(() => {
    delta({}, a);
  });
  a = withAttr({ format: 'vector', size: 100 })(a);
  t.notThrows(() => {
    delta({}, a);
  });
});

test('Returns 0 for a constant scalar stream', async (t) => {
  const input = Array(100).fill(12);
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = delta({}, a);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    t.is(typeof value, 'number');
  });
  t.deepEqual(result.slice(2).map(x => x.value), Array(98).fill(0));
});

test('Returns 1 for a stepping scalar stream', async (t) => {
  const input = Array.from(Array(100), (_, i) => i);
  const filterSize = 13;
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = delta({ size: filterSize }, a);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    t.is(typeof value, 'number');
  });
  t.deepEqual(
    result.slice(filterSize).map(x => x.value),
    Array(100 - filterSize).fill(1),
  );
});

test('Differentiates a vector stream', async (t) => {
  const input = Array.from(Array(100), (_, i) => [2 * i, 12, -i]);
  const filterSize = 7;
  const a = withAttr({
    format: 'vector',
    size: 3,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = delta({ size: filterSize }, a);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, 3);
  const result = await collectEventsFor(input.length, stream);
  t.deepEqual(
    result.slice(filterSize).map(x => x.value),
    Array(100 - filterSize).fill([2, 0, -1]),
  );
});


test('Accounts for the sampling rate (vector stream)', async (t) => {
  const input = Array.from(Array(100), (_, i) => [2 * i, 12, -i]);
  const filterSize = 7;
  const a = withAttr({
    format: 'vector',
    size: 3,
    samplerate: 100,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = delta({ size: filterSize }, a);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, 3);
  const result = await collectEventsFor(input.length, stream);
  t.deepEqual(
    result.slice(filterSize).map(x => x.value),
    Array(100 - filterSize).fill([200, 0, -100]),
  );
});
