import test from 'ava';
import ftom from '../../../src/operator/mapping/ftom';
import withAttr from '../../../src/lib/common/mixins';
import { makeEventsFromArray, collectEventsFor } from '../../helper/testEnv';
import { approxArrayEqual, allTrue } from '../../helper/assertions';

test('Throws if the input stream has invalid attributes', async (t) => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  t.throws(() => {
    ftom(a);
  });
  a = withAttr({ format: 'wrong' })(a);
  t.throws(() => {
    ftom(a);
  });
  a = withAttr({ format: 'scalar' })(a);
  t.throws(() => {
    ftom(a);
  });
  a = withAttr({ format: 'scalar', size: 1 })(a);
  t.notThrows(() => {
    ftom(a);
  });
  a = withAttr({ format: 'vector', size: 10 })(a);
  t.notThrows(() => {
    ftom(a);
  });
});

test('Convert a scalar stream of frequencies to MIDI notes', async (t) => {
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
  let stream;
  t.notThrows(() => {
    stream = ftom(a);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    t.is(typeof value, 'number');
  });
  const expected = [36, 37, 38, 39, 48, 49];
  t.true(allTrue(approxArrayEqual(result.map(x => x.value), expected, 1e-3)));
});

test('Convert a vector stream of MIDI notes to frequencies', async (t) => {
  const input = [
    [65.4063913251, 69.2956577442],
    [73.4161919794, 77.7817459305],
    [130.8127826503, 138.5913154884],
  ];
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = ftom(a);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, 2);
  const result = await collectEventsFor(input.length, stream);
  const expected = [
    [36, 37],
    [38, 39],
    [48, 49],
  ];
  result.forEach(({ value }, i) => {
    t.true(value instanceof Array);
    t.true(allTrue(approxArrayEqual(value, expected[i], 1e-3)));
  });
});
