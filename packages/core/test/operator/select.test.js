import { withAttr } from '@coda/prelude';
import select from '../../src/operator/select';
import { makeRandomEvents, collectEventsFor } from '../../../prelude/test/helper/testEnv';

test('Throws if the input stream has invalid attributes', async () => {
  let a = withAttr({})(makeRandomEvents(100, 5));
  delete a.attr;
  expect(() => select([], a)).toThrow();
  a = withAttr({ format: 'wrong' })(a);
  expect(() => select([], a)).toThrow();
  a = withAttr({ format: 'scalar' })(a);
  expect(() => select([], a)).toThrow();
  a = withAttr({ format: 'scalar', size: 1 })(a);
  select([], a);
  a = withAttr({ format: 'vector', size: 5 })(a);
  select([], a);
  a = withAttr({ format: 'vector', size: 5 })(a);
  expect(() => select([5], a)).toThrow();
  a = withAttr({ format: 'scalar', size: 1 })(a);
  expect(() => select([1, 2], a)).toThrow();
  a = withAttr({ format: 'scalar', size: 1 })(a);
  select([0, 0], a);
});

test('Selects values from a vector Stream', async () => {
  const a = withAttr({
    format: 'vector',
    size: 5,
  })(makeRandomEvents(10, 5));
  const indices = [0, 2, 4];
  const stream = select(indices, a);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(indices.length);
  const aVal = await collectEventsFor(1, a);
  const expected = aVal.map(({ value }) => indices.map(i => value[i]));
  const result = await collectEventsFor(1, stream);
  expect(expected).toEqual(result.map(x => x.value));
});

test('Selects values from a scalar Stream (duplicate)', async () => {
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeRandomEvents(10, 1));
  const indices = [0, 0, 0];
  const stream = select(indices, a);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(indices.length);
  const aVal = await collectEventsFor(1, a);
  const expected = aVal.map(({ value }) => indices.map(() => value));
  const result = await collectEventsFor(1, stream);
  expect(expected).toEqual(result.map(x => x.value));
});
