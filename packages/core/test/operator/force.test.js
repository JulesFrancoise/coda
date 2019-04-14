import { withAttr } from '@coda/prelude';
import { readFileSync } from 'fs';
import force from '../../src/operator/force';
import { makeEventsFromArray, collectEventsFor } from '../../../prelude/test/helper/testEnv';
import { approxArrayEqual, allTrue } from '../../../prelude/test/helper/assertions';

test('Throws if the input stream has invalid attributes', async () => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  expect(() => force({}, a)).toThrow();
  a = withAttr({ format: 'wrong' })(a);
  expect(() => force({}, a)).toThrow();
  a = withAttr({ format: 'scalar' })(a);
  expect(() => force({}, a)).toThrow();
  a = withAttr({
    type: 'emg',
    format: 'scalar',
    size: 1,
    samplerate: 200,
  })(a);
  force({}, a);
  a = withAttr({
    type: 'emg',
    format: 'vector',
    size: 10,
    samplerate: 200,
  })(a);
  force({}, a);
});

test('Extracts the force from a scalar stream of EMG Data', async () => {
  const emg = readFileSync('./packages/core/test/data/emg.txt', 'utf8')
    .split('\n')
    .filter(l => l !== '')
    .map(line => parseFloat(line.split(' ')[0]));
  const a = withAttr({
    type: 'emg',
    format: 'scalar',
    size: 1,
    samplerate: 200,
  })(makeEventsFromArray(0, emg));
  const stream = force({ logdiff: -2, logjump: -10 }, a);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  expect(stream.attr.samplerate).toBe(200);
  const result = await collectEventsFor(emg.length, stream);
  result.forEach(({ value }) => {
    expect(typeof value).toBe('number');
  });
  const mubuForce = readFileSync('./packages/core/test/data/force.txt', 'utf8')
    .split('\n')
    .filter(l => l !== '')
    .map(line => parseFloat(line.split(' ')[0]));
  const percentCorrect = approxArrayEqual(
    result.map(x => x.value),
    mubuForce,
    0.02,
  ).reduce((y, x) => y + x, 0.0);
  // Check that 90% of the prediction is correct (to allow numerical errors)
  expect(percentCorrect / result.length > 0.9).toBeTruthy();
});

test('Extracts the force from a vector stream of EMG Data', async () => {
  const emg = readFileSync('./packages/core/test/data/emg.txt', 'utf8')
    .split('\n')
    .filter(l => l !== '')
    .map(line => line.split(' ').map(parseFloat));
  const a = withAttr({
    type: 'emg',
    format: 'vector',
    size: 4,
    samplerate: 200,
  })(makeEventsFromArray(0, emg));
  const stream = force({ logdiff: -2, logjump: -10 }, a);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(4);
  expect(stream.attr.samplerate).toBe(200);
  const result = await collectEventsFor(emg.length, stream);
  result.forEach(({ value }) => {
    expect(value instanceof Array).toBeTruthy();
  });
  const mubuForce = readFileSync('./packages/core/test/data/force.txt', 'utf8')
    .split('\n')
    .filter(l => l !== '')
    .map(line => line.split(' ').map(parseFloat));
  const percentCorrect = result.map(({ value }, i) => allTrue(
    approxArrayEqual(value, mubuForce[i], 0.02),
  )).reduce((y, x) => y + x, 0.0);
  // Check that 90% of the prediction is correct (to allow numerical errors)
  expect(percentCorrect / result.length > 0.9).toBeTruthy();
});
