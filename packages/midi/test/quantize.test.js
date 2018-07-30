import test from 'ava';
import { withAttr } from '@coda/core';
import { Scale, Note, PcSet } from 'tonal';
import quantize from '../src/operator/quantize';
import { makeEventsFromArray, collectEventsFor } from '../../core/test/helper/testEnv';

test('Throws if the input stream has invalid attributes', async (t) => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  t.throws(() => {
    quantize({}, a);
  });
  a = withAttr({ format: 'wrong' })(a);
  t.throws(() => {
    quantize({}, a);
  });
  a = withAttr({ format: 'scalar' })(a);
  t.throws(() => {
    quantize({}, a);
  });
  a = withAttr({ format: 'scalar', size: 1 })(a);
  t.notThrows(() => {
    quantize({}, a);
  });
  a = withAttr({ format: 'vector', size: 100 })(a);
  t.notThrows(() => {
    quantize({}, a);
  });
});

test('Throws if the input stream has invalid parameters', async (t) => {
  let a = makeEventsFromArray(0, []);
  a = withAttr({ format: 'vector', size: 10 })(a);
  t.throws(() => {
    quantize({ scale: 'notAScale' }, a);
  });
});

test('Quantizes a scalar stream', async (t) => {
  const input = Array.from(Array(128), (_, i) => i + 0.2);
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(0, input));
  let stream;
  const options = {
    scale: 'D aeolian',
    mode: 'floor',
  };
  t.notThrows(() => {
    stream = quantize(options, a);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(1, stream);
  result.forEach(({ value }) => {
    t.true(PcSet.includes(Scale.notes(options.scale), Note.fromMidi(value)));
  });
});


test('Quantizes a vector stream', async (t) => {
  const input = Array.from(Array(128), (_, i) => [i + 0.2, 127 - i]);
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  let stream;
  const options = {
    scale: 'D bebop',
    mode: 'round',
  };
  t.notThrows(() => {
    stream = quantize(options, a);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, 2);
  const result = await collectEventsFor(1, stream);
  result.forEach(({ value }) => {
    value.forEach((v) => {
      t.true(PcSet.includes(Scale.notes(options.scale), Note.fromMidi(v)));
    });
  });
});

test('Quantizes a vector stream to a given range', async (t) => {
  const input = Array.from(Array(128), (_, i) => [i + 0.2, 127 - i]);
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  let stream;
  const options = {
    scale: 'C major',
    mode: 'ceil',
    octavemin: 4,
    octavemax: 5,
  };
  t.notThrows(() => {
    stream = quantize(options, a);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, 2);
  const result = await collectEventsFor(1, stream);
  result.forEach(({ value }) => {
    value.forEach((v) => {
      t.true(Note.oct(Note.fromMidi(v)) >= 4);
      t.true(Note.oct(Note.fromMidi(v)) <= 5);
    });
  });
});
