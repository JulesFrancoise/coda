import test from 'ava';
import withAttr from '../../src/lib/with_attr';

test('Attach attributes to a stream', (t) => {
  const stream = Object.create({});
  const attr = { a: 2, b: 'c' };
  let s;
  t.notThrows(() => {
    s = withAttr(attr)(stream);
  });
  t.deepEqual(s.attr, attr);
});
