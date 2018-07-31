import test from 'ava';
import rand from '../../../src/operator/mapping/rand';
import { makeEventsFromArray, collectEventsFor } from '../../../../prelude/test/helper/testEnv';

test('Throws if the input stream has no attributes', async (t) => {
  const a = makeEventsFromArray(0, []);
  delete a.attr;
  t.throws(() => {
    rand({}, a);
  });
});

test('With default options, returns a scalar stream', async (t) => {
  const input = [null, null, null];
  const a = makeEventsFromArray(0, input);
  let stream;
  t.notThrows(() => {
    stream = rand({}, a);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    t.is(typeof value, 'number');
  });
});


test('With size > 1, returns a vector stream', async (t) => {
  const input = [null, null, null];
  const a = makeEventsFromArray(0, input);
  let stream;
  t.notThrows(() => {
    stream = rand({ size: 3 }, a);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, 3);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    t.true(value instanceof Array);
    t.is(value.length, 3);
    value.forEach((v) => {
      t.is(typeof v, 'number');
    });
  });
});
