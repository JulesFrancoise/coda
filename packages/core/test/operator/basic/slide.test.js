import test from 'ava';
import { withAttr } from '@coda/prelude';
import slide from '../../../src/operator/basic/slide';
import { makeEventsFromArray, collectEventsFor } from '../../../../prelude/test/helper/testEnv';

test('Throws if the input stream has invalid attributes', (t) => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  t.throws(() => {
    slide({}, a);
  });
  a = withAttr({ format: 'wrong' })(a);
  t.throws(() => {
    slide({}, a);
  });
  a = withAttr({ format: 'scalar' })(a);
  t.throws(() => {
    slide({}, a);
  });
  a = withAttr({ format: 'scalar', size: 1 })(a);
  t.notThrows(() => {
    slide({}, a);
  });
  a = withAttr({ format: 'vector', size: 10 })(a);
  t.notThrows(() => {
    slide({}, a);
  });
});

test('Computes a sliding window on a scalar stream', async (t) => {
  const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = slide({ size: 5 }, a);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, 5);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    t.true(value instanceof Array);
  });
  const expected = [
    [1],
    [1, 2],
    [1, 2, 3],
    [1, 2, 3, 4],
    [1, 2, 3, 4, 5],
    [2, 3, 4, 5, 6],
    [3, 4, 5, 6, 7],
    [4, 5, 6, 7, 8],
    [5, 6, 7, 8, 9],
    [6, 7, 8, 9, 10],
  ];
  t.deepEqual(result.map(x => x.value), expected);
});

test('Computes a sliding window on a vector stream', async (t) => {
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
    stream = slide({ size: 5 }, a);
  });
  t.is(stream.attr.format, 'array');
  t.is(stream.attr.size, 10);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    t.true(value instanceof Array);
    value.forEach(v => t.true(v instanceof Array));
  });
  const expected = [
    [[1, 10]],
    [[1, 10], [2, 9]],
    [[1, 10], [2, 9], [3, 8]],
    [[1, 10], [2, 9], [3, 8], [4, 7]],
    [[1, 10], [2, 9], [3, 8], [4, 7], [5, 6]],
    [[2, 9], [3, 8], [4, 7], [5, 6], [6, 5]],
    [[3, 8], [4, 7], [5, 6], [6, 5], [7, 4]],
    [[4, 7], [5, 6], [6, 5], [7, 4], [8, 3]],
    [[5, 6], [6, 5], [7, 4], [8, 3], [9, 2]],
    [[6, 5], [7, 4], [8, 3], [9, 2], [10, 1]],
  ];
  t.deepEqual(result.map(x => x.value), expected);
});

test('Computes a sliding window with a hop size on a vector stream', async (t) => {
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
    stream = slide({ size: 5, hop: 3 }, a);
  });
  t.is(stream.attr.format, 'array');
  t.is(stream.attr.size, 10);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    t.true(value instanceof Array);
    value.forEach(v => t.true(v instanceof Array));
  });
  const expected = [
    [[1, 10]],
    [[1, 10], [2, 9], [3, 8], [4, 7]],
    [[3, 8], [4, 7], [5, 6], [6, 5], [7, 4]],
    [[6, 5], [7, 4], [8, 3], [9, 2], [10, 1]],
  ];
  t.deepEqual(result.map(x => x.value), expected);
});
