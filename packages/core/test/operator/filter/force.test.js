import test from 'ava';
import { readFileSync } from 'fs';
import force from '../../../src/operator/filter/force';
import withAttr from '../../../src/lib/common/mixins';
import { makeEventsFromArray, collectEventsFor } from '../../helper/testEnv';
import { approxArrayEqual, allTrue } from '../../helper/assertions';

test('Throws if the input stream has invalid attributes', async (t) => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  t.throws(() => {
    force({}, a);
  });
  a = withAttr({ format: 'wrong' })(a);
  t.throws(() => {
    force({}, a);
  });
  a = withAttr({ format: 'scalar' })(a);
  t.throws(() => {
    force({}, a);
  });
  a = withAttr({
    type: 'emg',
    format: 'scalar',
    size: 1,
    samplerate: 200,
  })(a);
  t.notThrows(() => {
    force({}, a);
  });
  a = withAttr({
    type: 'emg',
    format: 'vector',
    size: 10,
    samplerate: 200,
  })(a);
  t.notThrows(() => {
    force({}, a);
  });
});

test('Extracts the force from a scalar stream of EMG Data', async (t) => {
  const emg = readFileSync('./test/data/emg.txt', 'utf8')
    .split('\n')
    .filter(l => l !== '')
    .map(line => parseFloat(line.split(' ')[0]));
  const a = withAttr({
    type: 'emg',
    format: 'scalar',
    size: 1,
    samplerate: 200,
  })(makeEventsFromArray(0, emg));
  let stream;
  t.notThrows(() => {
    stream = force({ logdiff: -2, logjump: -10 }, a);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  t.is(stream.attr.samplerate, 200);
  const result = await collectEventsFor(emg.length, stream);
  result.forEach(({ value }) => {
    t.is(typeof value, 'number');
  });
  const mubuForce = readFileSync('./test/data/force.txt', 'utf8')
    .split('\n')
    .filter(l => l !== '')
    .map(line => parseFloat(line.split(' ')[0]));
  const percentCorrect = approxArrayEqual(
    result.map(x => x.value),
    mubuForce,
    0.02,
  ).reduce((y, x) => y + x, 0.0);
  // Check that 90% of the prediction is correct (to allow numerical errors)
  t.true(percentCorrect / result.length > 0.9);
});

test('Extracts the force from a vector stream of EMG Data', async (t) => {
  const emg = readFileSync('./test/data/emg.txt', 'utf8')
    .split('\n')
    .filter(l => l !== '')
    .map(line => line.split(' ').map(parseFloat));
  const a = withAttr({
    type: 'emg',
    format: 'vector',
    size: 4,
    samplerate: 200,
  })(makeEventsFromArray(0, emg));
  let stream;
  t.notThrows(() => {
    stream = force({ logdiff: -2, logjump: -10 }, a);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, 4);
  t.is(stream.attr.samplerate, 200);
  const result = await collectEventsFor(emg.length, stream);
  result.forEach(({ value }) => {
    t.true(value instanceof Array);
  });
  const mubuForce = readFileSync('./test/data/force.txt', 'utf8')
    .split('\n')
    .filter(l => l !== '')
    .map(line => line.split(' ').map(parseFloat));
  const percentCorrect = result.map(({ value }, i) =>
    allTrue(approxArrayEqual(value, mubuForce[i], 0.02)))
    .reduce((y, x) => y + x, 0.0);
  // Check that 90% of the prediction is correct (to allow numerical errors)
  t.true(percentCorrect / result.length > 0.9);
});
