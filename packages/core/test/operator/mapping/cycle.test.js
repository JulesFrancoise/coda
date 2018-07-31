import test from 'ava';
import { withAttr } from '@coda/prelude';
import cycle from '../../../src/operator/mapping/cycle';
import { makeEventsFromArray, collectEventsFor } from '../../../../prelude/test/helper/testEnv';

test('Throws if the buffer is invalid', (t) => {
  let a = makeEventsFromArray(0, []);
  a = withAttr({ format: 'wrong' })(a);
  t.throws(() => {
    cycle(1, a);
  });
  t.throws(() => {
    cycle(false, a);
  });
  t.throws(() => {
    cycle({ a: 1 }, a);
  });
  t.throws(() => {
    cycle([], a);
  });
  t.throws(() => {
    cycle('', a);
  });
  t.notThrows(() => {
    cycle('abcd', a);
  });
  t.notThrows(() => {
    cycle(['a', 'b', 'c', 'd'], a);
  });
  t.notThrows(() => {
    cycle([1, 2, 3, 4], a);
  });
  t.notThrows(() => {
    cycle([[1, 2], [3, 4]], a);
  });
  t.notThrows(() => {
    cycle([{ a: 1 }, { a: 2 }, { a: 3 }], a);
  });
});

test('Cycles through an Array of numbers', async (t) => {
  const a = withAttr({})(makeEventsFromArray(0, new Array(20).fill(null)));
  let stream;
  const buf = [1, 3, 5, 2];
  t.notThrows(() => {
    stream = cycle(buf, a);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(1, stream);
  result.forEach(({ value }, i) => {
    t.is(typeof value, 'number');
    t.is(value, buf[i % 4]);
  });
});

test('Cycles through an Array of strings', async (t) => {
  const a = withAttr({})(makeEventsFromArray(0, new Array(20).fill(null)));
  let stream;
  const buf = ['a', 'd', 'b', 'x', 'y'];
  t.notThrows(() => {
    stream = cycle(buf, a);
  });
  t.is(stream.attr.format, 'string');
  const result = await collectEventsFor(1, stream);
  result.forEach(({ value }, i) => {
    t.is(typeof value, 'string');
    t.is(value, buf[i % 5]);
  });
});

test('Cycles through an Array of objects', async (t) => {
  const a = withAttr({})(makeEventsFromArray(0, new Array(20).fill(null)));
  let stream;
  const buf = [{ a: 1 }, { a: 2 }, { a: 3 }];
  t.notThrows(() => {
    stream = cycle(buf, a);
  });
  t.is(stream.attr.format, 'anything');
  const result = await collectEventsFor(1, stream);
  result.forEach(({ value }, i) => {
    t.is(typeof value, 'object');
    t.is(value, buf[i % 3]);
  });
});

test('Cycles through an Array of Arrays of Numbers', async (t) => {
  const a = withAttr({})(makeEventsFromArray(0, new Array(20).fill(null)));
  let stream;
  const buf = [[1, 2], [3, 4], [5, 6]];
  t.notThrows(() => {
    stream = cycle(buf, a);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, 2);
  const result = await collectEventsFor(1, stream);
  result.forEach(({ value }, i) => {
    t.is(typeof value, 'object');
    t.is(value, buf[i % 3]);
  });
});

test('Cycles through an Array of Booleans', async (t) => {
  const a = withAttr({})(makeEventsFromArray(0, new Array(20).fill(null)));
  let stream;
  const buf = [true, true, false, true];
  t.notThrows(() => {
    stream = cycle(buf, a);
  });
  t.is(stream.attr.format, 'boolean');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(1, stream);
  result.forEach(({ value }, i) => {
    t.is(typeof value, 'boolean');
    t.is(value, buf[i % 4]);
  });
});

test('Cycles through a String', async (t) => {
  const a = withAttr({})(makeEventsFromArray(0, new Array(20).fill(null)));
  let stream;
  const buf = 'abcxyz';
  t.notThrows(() => {
    stream = cycle(buf, a);
  });
  t.is(stream.attr.format, 'string');
  const result = await collectEventsFor(1, stream);
  result.forEach(({ value }, i) => {
    t.is(typeof value, 'string');
    t.is(value, buf[i % 6]);
  });
});
