import { withAttr } from '@coda/prelude';
import { Scale, Note, PcSet } from 'tonal';
import quantize from '../src/operator/quantize';
import { makeEventsFromArray, collectEventsFor } from '../../prelude/test/helper/testEnv';

test('Throws if the input stream has invalid attributes', async () => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  expect(() => quantize({}, a)).toThrow();
  a = withAttr({ format: 'wrong' })(a);
  expect(() => quantize({}, a)).toThrow();
  a = withAttr({ format: 'scalar' })(a);
  expect(() => quantize({}, a)).toThrow();
  a = withAttr({ format: 'scalar', size: 1 })(a);
  quantize({}, a);
  a = withAttr({ format: 'vector', size: 100 })(a);
  quantize({}, a);
});

test('Throws if the input stream has invalid parameters', async () => {
  let a = makeEventsFromArray(0, []);
  a = withAttr({ format: 'vector', size: 10 })(a);
  expect(() => quantize({ scale: 'notAScale' }, a)).toThrow();
});

test('Quantizes a scalar stream', async () => {
  const input = Array.from(Array(128), (_, i) => i + 0.2);
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(0, input));
  const options = {
    scale: 'D aeolian',
    mode: 'floor',
  };
  const stream = quantize(options, a);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(1, stream);
  result.forEach(({ value }) => {
    expect(PcSet.includes(Scale.notes(options.scale), Note.fromMidi(value))).toBeTruthy();
  });
});

test('Quantizes a vector stream', async () => {
  const input = Array.from(Array(128), (_, i) => [i + 0.2, 127 - i]);
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  const options = {
    scale: 'D bebop',
    mode: 'round',
  };
  const stream = quantize(options, a);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(2);
  const result = await collectEventsFor(1, stream);
  result.forEach(({ value }) => {
    value.forEach((v) => {
      expect(PcSet.includes(Scale.notes(options.scale), Note.fromMidi(v))).toBeTruthy();
    });
  });
});

test('Quantizes a vector stream to a given range', async () => {
  const input = Array.from(Array(128), (_, i) => [i + 0.2, 127 - i]);
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  const options = {
    scale: 'C major',
    mode: 'ceil',
    octavemin: 4,
    octavemax: 5,
  };
  const stream = quantize(options, a);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(2);
  const result = await collectEventsFor(1, stream);
  result.forEach(({ value }) => {
    value.forEach((v) => {
      expect(Note.oct(Note.fromMidi(v)) >= 4).toBeTruthy();
      expect(Note.oct(Note.fromMidi(v)) <= 5).toBeTruthy();
    });
  });
});
