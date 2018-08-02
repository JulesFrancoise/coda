import { withAttr } from '@coda/prelude';
import ftom from '../src/operator/ftom';
import { makeEventsFromArray, collectEventsFor } from '../../prelude/test/helper/testEnv';

test('Throws if the input stream has invalid attributes', async () => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  expect(() => ftom(a)).toThrow();
  a = withAttr({ format: 'wrong' })(a);
  expect(() => ftom(a)).toThrow();
  a = withAttr({ format: 'scalar' })(a);
  expect(() => ftom(a)).toThrow();
  a = withAttr({ format: 'scalar', size: 1 })(a);
  ftom(a);
  a = withAttr({ format: 'vector', size: 10 })(a);
  ftom(a);
});

test('Convert a scalar stream of frequencies to MIDI notes', async () => {
  const input = [
    65.4063913251,
    69.2956577442,
    73.4161919794,
    77.7817459305,
    130.8127826503,
    138.5913154884,
  ];
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(0, input));
  const stream = ftom(a);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    expect(typeof value).toBe('number');
  });
  const expected = [36, 37, 38, 39, 48, 49];
  expect(result.length).toBe(expected.length);
  result.map(x => x.value).forEach((res, i) => {
    expect(res).toBeCloseTo(expected[i]);
  });
});

test('Convert a vector stream of MIDI notes to frequencies', async () => {
  const input = [
    [65.4063913251, 69.2956577442],
    [73.4161919794, 77.7817459305],
    [130.8127826503, 138.5913154884],
  ];
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  const stream = ftom(a);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(2);
  const result = await collectEventsFor(input.length, stream);
  const expected = [
    [36, 37],
    [38, 39],
    [48, 49],
  ];
  expect(result.length).toBe(expected.length);
  result.forEach(({ value }, i) => {
    expect(value instanceof Array).toBeTruthy();
    value.forEach((val, j) => {
      expect(val).toBeCloseTo(expected[i][j]);
    });
  });
});
