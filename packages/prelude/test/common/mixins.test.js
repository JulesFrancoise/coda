import withAttr from '../../src/lib/with_attr';

test('Attach attributes to a stream', () => {
  const stream = Object.create({});
  const attr = { a: 2, b: 'c' };
  const s = withAttr(attr)(stream);
  expect(s.attr).toEqual(attr);
});
