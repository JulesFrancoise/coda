import { readFileSync } from 'fs';
import { withAttr } from '@coda/prelude';
import wavelet from '../../src/operator/wavelet';
import { makeEventsFromArray, collectEventsFor } from '../../../prelude/test/helper/testEnv';

test('Throws if the input stream has invalid attributes', async () => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  expect(() => wavelet({}, a)).toThrow();
  a = withAttr({ format: 'wrong' })(a);
  expect(() => wavelet({}, a)).toThrow();
  a = withAttr({ format: 'scalar' })(a);
  expect(() => wavelet({}, a)).toThrow();
  a = withAttr({ format: 'scalar', size: 1 })(a);
  expect(() => wavelet({}, a)).toThrow();
  a = withAttr({ format: 'vector', size: 100 })(a);
  expect(() => wavelet({}, a)).toThrow();
  a = withAttr({ format: 'scalar', size: 1, samplerate: 100 })(a);
  wavelet({}, a);
  a = withAttr({ format: 'vector', size: 100, samplerate: 100 })(a);
  wavelet({}, a);
});

test('Computes the Online CWT on a scalar stream', async () => {
  const input = readFileSync('./packages/core/test/data/wavelet.data.txt', 'utf8')
    .split('\n')
    .filter(l => l !== '')
    .map(line => parseFloat(line.split(' ')[0]))
    .slice(0, 300);
  const a = withAttr({
    format: 'scalar',
    size: 1,
    samplerate: 200,
  })(makeEventsFromArray(0, input));
  const stream = wavelet({ frequencyMax: 50, optimisation: 'none' }, a);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(23);
  const result = await collectEventsFor(1, stream);
  result.forEach(({ value }) => {
    expect(value instanceof Array).toBeTruthy();
  });
  const mubuScalo = readFileSync('./packages/core/test/data/wavelet.scalo.txt', 'utf8')
    .split('\n')
    .filter(l => l !== '')
    .map(line => line.split(' ').map(parseFloat))
    .slice(0, 300);
  const error = result
    .map(({ value }, i) => value
      .map((x, j) => Math.abs(x - mubuScalo[i][j]))
      .reduce((sum, v) => sum + v, 0) / 23)
    .reduce((sum, v) => sum + v, 0) / result.length;
  // console.log('Error (1D)', error);
  expect(error).toBeLessThan(0.05);
  // const jsScalo = result.map(({ value }) => value.join(' '))
  //   .join('\n');
  // writeFileSync('./test/data/wavelet.js.txt', jsScalo, 'utf8');
});

test('Computes the Online CWT on a vector stream', async () => {
  const input = readFileSync('./packages/core/test/data/wavelet.data6.txt', 'utf8')
    .split('\n')
    .filter(l => l !== '')
    .map(line => line.split(' ').map(parseFloat))
    .slice(0, 300);
  const a = withAttr({
    format: 'vector',
    size: 6,
    samplerate: 200,
  })(makeEventsFromArray(0, input));
  const stream = wavelet({ frequencyMax: 50, optimisation: 'none' }, a);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(23);
  const result = await collectEventsFor(1, stream);
  result.forEach(({ value }) => {
    expect(value instanceof Array).toBeTruthy();
  });
  const mubuScalo = readFileSync('./packages/core/test/data/wavelet.scalo6.txt', 'utf8')
    .split('\n')
    .filter(l => l !== '')
    .map(line => line.split(' ').map(parseFloat))
    .slice(0, 300);
  const error = result
    .map(({ value }, i) => value
      .map((x, j) => Math.abs(x - mubuScalo[i][j]))
      .reduce((sum, v) => sum + v, 0) / 23)
    .reduce((sum, v) => sum + v, 0) / result.length;
  // console.log('Error (6D)', error);
  expect(error).toBeLessThan(0.005);
  // const jsScalo = result.map(({ value }) => value.join(' '))
  //   .join('\n');
  // writeFileSync('./test/data/wavelet.js.txt', jsScalo, 'utf8');
});

test('Computes the Online CWT on a scalar stream (standard optimisation)', async () => {
  const input = readFileSync('./packages/core/test/data/wavelet.data.txt', 'utf8')
    .split('\n')
    .filter(l => l !== '')
    .map(line => parseFloat(line.split(' ')[0]))
    .slice(0, 300);
  const a = withAttr({
    format: 'scalar',
    size: 1,
    samplerate: 200,
  })(makeEventsFromArray(0, input));
  const stream = wavelet({ frequencyMax: 50, optimisation: 'standard2' }, a);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(23);
  const result = await collectEventsFor(1, stream);
  result.forEach(({ value }) => {
    expect(value instanceof Array).toBeTruthy();
  });
  const mubuScalo = readFileSync('./packages/core/test/data/wavelet.scalo.standard2.txt', 'utf8')
    .split('\n')
    .filter(l => l !== '')
    .map(line => line.split(' ').map(parseFloat))
    .slice(0, 300);
  const error = result
    .map(({ value }, i) => value
      .map((x, j) => Math.abs(x - mubuScalo[i][j]))
      .reduce((sum, v) => sum + v, 0) / 23)
    .reduce((sum, v) => sum + v, 0) / result.length;
  // console.log('Error (1D) [optimisation = standard2]', error);
  expect(error).toBeLessThan(0.15);
  // const jsScalo = result.map(({ value }) => value.join(' '))
  //   .join('\n');
  // writeFileSync('./test/data/wavelet.js.txt', jsScalo, 'utf8');
});
