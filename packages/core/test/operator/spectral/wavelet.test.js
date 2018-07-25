import test from 'ava';
import { readFileSync } from 'fs';
import wavelet from '../../../src/operator/spectral/wavelet';
import withAttr from '../../../src/lib/common/mixins';
import { makeEventsFromArray, collectEventsFor } from '../../helper/testEnv';

test('Throws if the input stream has invalid attributes', async (t) => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  t.throws(() => {
    wavelet({}, a);
  });
  a = withAttr({ format: 'wrong' })(a);
  t.throws(() => {
    wavelet({}, a);
  });
  a = withAttr({ format: 'scalar' })(a);
  t.throws(() => {
    wavelet({}, a);
  });
  a = withAttr({ format: 'scalar', size: 1 })(a);
  t.throws(() => {
    wavelet({}, a);
  });
  a = withAttr({ format: 'vector', size: 100 })(a);
  t.throws(() => {
    wavelet({}, a);
  });
  a = withAttr({ format: 'scalar', size: 1, samplerate: 100 })(a);
  t.notThrows(() => {
    wavelet({}, a);
  });
  a = withAttr({ format: 'vector', size: 100, samplerate: 100 })(a);
  t.notThrows(() => {
    wavelet({}, a);
  });
});

test('Computes the Online CWT on a scalar stream', async (t) => {
  const input = readFileSync('./test/data/wavelet.data.txt', 'utf8')
    .split('\n')
    .filter(l => l !== '')
    .map(line => parseFloat(line.split(' ')[0]));
  const a = withAttr({
    format: 'scalar',
    size: 1,
    samplerate: 200,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = wavelet({ optimisation: 'none' }, a);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, 23);
  const result = await collectEventsFor(1, stream);
  result.forEach(({ value }) => {
    t.true(value instanceof Array);
  });
  const mubuScalo = readFileSync('./test/data/wavelet.scalo.txt', 'utf8')
    .split('\n')
    .filter(l => l !== '')
    .map(line => line.split(' ').map(parseFloat));
  const error = result
    .map(({ value }, i) => value
      .map((x, j) => Math.abs(x - mubuScalo[i][j]))
      .reduce((sum, v) => sum + v, 0) / 23)
    .reduce((sum, v) => sum + v, 0) / result.length;
  // console.log('Error (1D)', error);
  t.true(error < 0.1);
  // const jsScalo = result.map(({ value }) => value.join(' '))
  //   .join('\n');
  // writeFileSync('./test/data/wavelet.js.txt', jsScalo, 'utf8');
});

test('Computes the Online CWT on a vector stream', async (t) => {
  const input = readFileSync('./test/data/wavelet.data6.txt', 'utf8')
    .split('\n')
    .filter(l => l !== '')
    .map(line => line.split(' ').map(parseFloat));
  const a = withAttr({
    format: 'vector',
    size: 6,
    samplerate: 200,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = wavelet({ optimisation: 'none' }, a);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, 23);
  const result = await collectEventsFor(1, stream);
  result.forEach(({ value }) => {
    t.true(value instanceof Array);
  });
  const mubuScalo = readFileSync('./test/data/wavelet.scalo6.txt', 'utf8')
    .split('\n')
    .filter(l => l !== '')
    .map(line => line.split(' ').map(parseFloat));
  const error = result
    .map(({ value }, i) => value
      .map((x, j) => Math.abs(x - mubuScalo[i][j]))
      .reduce((sum, v) => sum + v, 0) / 23)
    .reduce((sum, v) => sum + v, 0) / result.length;
  // console.log('Error (6D)', error);
  t.true(error < 0.01);
  // const jsScalo = result.map(({ value }) => value.join(' '))
  //   .join('\n');
  // writeFileSync('./test/data/wavelet.js.txt', jsScalo, 'utf8');
});

test('Computes the Online CWT on a scalar stream (standard optimisation)', async (t) => {
  const input = readFileSync('./test/data/wavelet.data.txt', 'utf8')
    .split('\n')
    .filter(l => l !== '')
    .map(line => parseFloat(line.split(' ')[0]));
  const a = withAttr({
    format: 'scalar',
    size: 1,
    samplerate: 200,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = wavelet({ optimisation: 'standard2' }, a);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, 23);
  const result = await collectEventsFor(1, stream);
  result.forEach(({ value }) => {
    t.true(value instanceof Array);
  });
  const mubuScalo = readFileSync('./test/data/wavelet.scalo.standard2.txt', 'utf8')
    .split('\n')
    .filter(l => l !== '')
    .map(line => line.split(' ').map(parseFloat));
  const error = result
    .map(({ value }, i) => value
      .map((x, j) => Math.abs(x - mubuScalo[i][j]))
      .reduce((sum, v) => sum + v, 0) / 23)
    .reduce((sum, v) => sum + v, 0) / result.length;
  // console.log('Error (1D) [optimisation = standard2]', error);
  t.true(error < 0.2);
  // const jsScalo = result.map(({ value }) => value.join(' '))
  //   .join('\n');
  // writeFileSync('./test/data/wavelet.js.txt', jsScalo, 'utf8');
});
