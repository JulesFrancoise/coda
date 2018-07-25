import test from 'ava';
import unpack from '../../../src/operator/basic/unpack';
import withAttr from '../../../src/lib/common/mixins';
import { makeEventsFromArray, collectEventsFor } from '../../helper/testEnv';

test('Throws if the input stream has invalid attributes', (t) => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  t.throws(() => {
    unpack(a);
  });
  a = withAttr({ format: 'wrong' })(a);
  t.throws(() => {
    unpack(a);
  });
  a = withAttr({ format: 'scalar' })(a);
  t.throws(() => {
    unpack(a);
  });
  a = withAttr({ format: 'scalar', size: 1 })(a);
  t.throws(() => {
    unpack(a);
  });
  a = withAttr({ format: 'vector', size: 3 })(a);
  t.notThrows(() => {
    unpack(a);
  });
});

test('Unpack a vector stream to an array of scalar streams', async (t) => {
  const input = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]];
  const a = withAttr({
    format: 'vector',
    size: 3,
  })(makeEventsFromArray(0, input));
  let streams;
  t.notThrows(() => {
    streams = unpack(a);
  });
  const result = await Promise.all(streams.map(s =>
    collectEventsFor(input.length, s)));
  const expected = [[1, 4, 7, 10], [2, 5, 8, 11], [3, 6, 9, 12]];
  streams.forEach((s, i) => {
    t.is(s.attr.format, 'scalar');
    t.is(s.attr.size, 1);
    t.deepEqual(result[i].map(x => x.value), expected[i]);
  });
});
