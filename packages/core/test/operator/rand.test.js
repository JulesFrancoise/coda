import rand from '../../src/operator/rand';
import { makeEventsFromArray, collectEventsFor } from '../../../prelude/test/helper/testEnv';

test('Throws if the input stream has no attributes', async () => {
  const a = makeEventsFromArray(0, []);
  delete a.attr;
  expect(() => rand({}, a)).toThrow();
});

test('With default options, returns a scalar stream', async () => {
  const input = [null, null, null];
  const a = makeEventsFromArray(0, input);
  const stream = rand({}, a);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    expect(typeof value).toBe('number');
  });
});


test('With size > 1, returns a vector stream', async () => {
  const input = [null, null, null];
  const a = makeEventsFromArray(0, input);
  const stream = rand({ size: 3 }, a);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(3);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    expect(value instanceof Array).toBeTruthy();
    expect(value.length).toBe(3);
    value.forEach((v) => {
      expect(typeof v).toBe('number');
    });
  });
});
