import test from 'ava';
import { withAttr } from '@coda/prelude';
import scale from '../../../src/operator/mapping/scale';
import { makeEventsFromArray, collectEventsFor } from '../../../../prelude/test/helper/testEnv';

test('Throws if the input stream has invalid attributes', async (t) => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  t.throws(() => {
    scale({}, a);
  });
  a = withAttr({ format: 'wrong' })(a);
  t.throws(() => {
    scale({}, a);
  });
  a = withAttr({ format: 'scalar' })(a);
  t.throws(() => {
    scale({}, a);
  });
  a = withAttr({ format: 'scalar', size: 1 })(a);
  t.notThrows(() => {
    scale({}, a);
  });
  a = withAttr({ format: 'vector', size: 100 })(a);
  t.notThrows(() => {
    scale({}, a);
  });
});

test('With default options, leave a scalar stream unchanged', async (t) => {
  const input = [0.4, 3, -1, 0.7];
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = scale({}, a);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    t.is(typeof value, 'number');
  });
  t.deepEqual(result.map(x => x.value), input);
});

test('With default options, leave a vector stream unchanged', async (t) => {
  const input = [
    [0.4, 3, -1, 0.7],
    [0.6, 3, 9.76, 0.9],
    [12, 5, 1234, 0.7],
  ];
  const a = withAttr({
    format: 'vector',
    size: 4,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = scale({}, a);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, 4);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    t.true(value instanceof Array);
    value.forEach(v => t.is(typeof v, 'number'));
  });
  t.deepEqual(result.map(x => x.value), input);
});

test('Scales a scalar stream', async (t) => {
  const input = [0.4, 3, -1, 0.7];
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(0, input));
  let stream;
  const options = {
    inmin: 0.3,
    inmax: 10.9,
    outmin: -12.4,
    outmax: 128,
  };
  t.notThrows(() => {
    stream = scale(options, a);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    t.is(typeof value, 'number');
  });
  t.deepEqual(result.map(x => x.value), input.map(x =>
    options.outmin + ((options.outmax - options.outmin) *
      ((x - options.inmin) / (options.inmax - options.inmin)))));
});

test('Scales a vector stream', async (t) => {
  const input = [
    [0.4, 3, -1, 0.7],
    [0.6, 3, 9.76, 0.9],
    [12, 5, 1234, 0.7],
  ];
  const a = withAttr({
    format: 'vector',
    size: 4,
  })(makeEventsFromArray(0, input));
  let stream;
  const options = {
    inmin: 0.3,
    inmax: 10.9,
    outmin: -12.4,
    outmax: 128,
  };
  t.notThrows(() => {
    stream = scale(options, a);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, 4);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }, i) => {
    t.true(value instanceof Array);
    t.deepEqual(value, input[i].map(x =>
      options.outmin + ((options.outmax - options.outmin) *
        ((x - options.inmin) / (options.inmax - options.inmin)))));
  });
});
