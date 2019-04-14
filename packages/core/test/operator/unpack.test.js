import { withAttr } from '@coda/prelude';
import unpack from '../../src/operator/unpack';
import { makeEventsFromArray, collectEventsFor } from '../../../prelude/test/helper/testEnv';

test('Throws if the input stream has invalid attributes', () => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  expect(() => unpack(a)).toThrow();
  a = withAttr({ format: 'wrong' })(a);
  expect(() => unpack(a)).toThrow();
  a = withAttr({ format: 'scalar' })(a);
  expect(() => unpack(a)).toThrow();
  a = withAttr({ format: 'scalar', size: 1 })(a);
  expect(() => unpack(a)).toThrow();
  a = withAttr({ format: 'vector', size: 3 })(a);
  unpack(a);
});

test('Unpack a vector stream to an array of scalar streams', async () => {
  const input = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]];
  const a = withAttr({
    format: 'vector',
    size: 3,
  })(makeEventsFromArray(0, input));
  const streams = unpack(a);
  const result = await Promise.all(streams.map(s => collectEventsFor(input.length, s)));
  const expected = [[1, 4, 7, 10], [2, 5, 8, 11], [3, 6, 9, 12]];
  streams.forEach((s, i) => {
    expect(s.attr.format).toBe('scalar');
    expect(s.attr.size).toBe(1);
    expect(result[i].map(x => x.value)).toEqual(expected[i]);
  });
});
