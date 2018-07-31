import test from 'ava';
import { withAttr } from '@coda/prelude';
import select from '../../../src/operator/basic/select';
import { makeRandomEvents, collectEventsFor } from '../../../../prelude/test/helper/testEnv';

test('Throws if the input stream has invalid attributes', async (t) => {
  let a = withAttr({})(makeRandomEvents(100, 5));
  delete a.attr;
  t.throws(() => {
    select([], a);
  });
  a = withAttr({ format: 'wrong' })(a);
  t.throws(() => {
    select([], a);
  });
  a = withAttr({ format: 'scalar' })(a);
  t.throws(() => {
    select([], a);
  });
  a = withAttr({ format: 'scalar', size: 1 })(a);
  t.notThrows(() => {
    select([], a);
  });
  a = withAttr({ format: 'vector', size: 5 })(a);
  t.notThrows(() => {
    select([], a);
  });
  a = withAttr({ format: 'vector', size: 5 })(a);
  t.throws(() => {
    select([5], a);
  });
  a = withAttr({ format: 'scalar', size: 1 })(a);
  t.throws(() => {
    select([1, 2], a);
  });
  a = withAttr({ format: 'scalar', size: 1 })(a);
  t.notThrows(() => {
    select([0, 0], a);
  });
});

test('Selects values from a vector Stream', async (t) => {
  const a = withAttr({
    format: 'vector',
    size: 5,
  })(makeRandomEvents(10, 5));
  const indices = [0, 2, 4];
  let stream;
  t.notThrows(() => {
    stream = select(indices, a);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, indices.length);
  const aVal = await collectEventsFor(1, a);
  const expected = aVal.map(({ value }) => indices.map(i => value[i]));
  const result = await collectEventsFor(1, stream);
  t.deepEqual(expected, result.map(x => x.value));
});

test('Selects values from a scalar Stream (duplicate)', async (t) => {
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeRandomEvents(10, 1));
  const indices = [0, 0, 0];
  let stream;
  t.notThrows(() => {
    stream = select(indices, a);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, indices.length);
  const aVal = await collectEventsFor(1, a);
  const expected = aVal.map(({ value }) => indices.map(() => value));
  const result = await collectEventsFor(1, stream);
  t.deepEqual(expected, result.map(x => x.value));
});
