import { withAttr } from '@coda/prelude';
import scale from '../../src/operator/scale';
import { makeEventsFromArray, collectEventsFor } from '../../../prelude/test/helper/testEnv';

test('Throws if the input stream has invalid attributes', async () => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  expect(() => scale({}, a)).toThrow();
  a = withAttr({ format: 'wrong' })(a);
  expect(() => scale({}, a)).toThrow();
  a = withAttr({ format: 'scalar' })(a);
  expect(() => scale({}, a)).toThrow();
  a = withAttr({ format: 'scalar', size: 1 })(a);
  scale({}, a);
  a = withAttr({ format: 'vector', size: 100 })(a);
  scale({}, a);
});

test('With default options, leave a scalar stream unchanged', async () => {
  const input = [0.4, 3, -1, 0.7];
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(0, input));
  const stream = scale({}, a);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    expect(typeof value).toBe('number');
  });
  expect(result.map(x => x.value)).toEqual(input);
});

test('With default options, leave a vector stream unchanged', async () => {
  const input = [
    [0.4, 3, -1, 0.7],
    [0.6, 3, 9.76, 0.9],
    [12, 5, 1234, 0.7],
  ];
  const a = withAttr({
    format: 'vector',
    size: 4,
  })(makeEventsFromArray(0, input));
  const stream = scale({}, a);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(4);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    expect(value instanceof Array).toBeTruthy();
    value.forEach(v => expect(typeof v).toBe('number'));
  });
  expect(result.map(x => x.value)).toEqual(input);
});

test('Scales a scalar stream', async () => {
  const input = [0.4, 3, -1, 0.7];
  const a = withAttr({
    format: 'scalar',
    size: 1,
  })(makeEventsFromArray(0, input));
  const options = {
    inmin: 0.3,
    inmax: 10.9,
    outmin: -12.4,
    outmax: 128,
  };
  const stream = scale(options, a);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }) => {
    expect(typeof value).toBe('number');
  });
  expect(result.map(x => x.value))
    .toEqual(input.map(x => options.outmin + ((options.outmax - options.outmin)
      * ((x - options.inmin) / (options.inmax - options.inmin)))));
});

test('Scales a vector stream', async () => {
  const input = [
    [0.4, 3, -1, 0.7],
    [0.6, 3, 9.76, 0.9],
    [12, 5, 1234, 0.7],
  ];
  const a = withAttr({
    format: 'vector',
    size: 4,
  })(makeEventsFromArray(0, input));
  const options = {
    inmin: 0.3,
    inmax: 10.9,
    outmin: -12.4,
    outmax: 128,
  };
  const stream = scale(options, a);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(4);
  const result = await collectEventsFor(input.length, stream);
  result.forEach(({ value }, i) => {
    expect(value instanceof Array).toBeTruthy();
    expect(value)
      .toEqual(input[i].map(x => options.outmin + ((options.outmax - options.outmin)
        * ((x - options.inmin) / (options.inmax - options.inmin)))));
  });
});
