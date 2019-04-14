import { withAttr } from '@coda/prelude';
import elementwise, {
  add,
  sub,
  mul,
  div,
} from '../../src/operator/elementwise';
import { makeEventsFromArray, collectEventsFor } from '../../../prelude/test/helper/testEnv';

test('Throws if the input stream has invalid attributes', async () => {
  let a = makeEventsFromArray(0, []);
  let b = makeEventsFromArray(0, []);
  delete a.attr;
  expect(() => elementwise(null, a, b)).toThrow();
  a = withAttr({ format: 'wrong' })(a);
  expect(() => elementwise(null, a)).toThrow();
  a = withAttr({ format: 'scalar' })(a);
  expect(() => elementwise(null, a)).toThrow();
  a = withAttr({ format: 'scalar', size: 1 })(a);
  b = withAttr({ format: 'scalar', size: 1 })(b);
  elementwise(null, a, b);
  a = withAttr({ format: 'vector', size: 100 })(a);
  b = withAttr({ format: 'vector', size: 100 })(b);
  elementwise(null, a, b);
  a = withAttr({ format: 'vector', size: 100 })(a);
  b = withAttr({ format: 'scalar', size: 100 })(b);
  expect(() => elementwise(null, a, b)).toThrow();
  a = withAttr({ format: 'vector', size: 100 })(a);
  b = withAttr({ format: 'vector', size: 10 })(b);
  expect(() => elementwise(null, a, b)).toThrow();
  [add, sub, mul, div].forEach((f) => {
    delete a.attr;
    expect(() => f(a, b)).toThrow();
    a = withAttr({ format: 'wrong' })(a);
    expect(() => f(a)).toThrow();
    a = withAttr({ format: 'scalar' })(a);
    expect(() => f(a)).toThrow();
    a = withAttr({ format: 'scalar', size: 1 })(a);
    b = withAttr({ format: 'scalar', size: 1 })(b);
    f(a, b);
    a = withAttr({ format: 'vector', size: 100 })(a);
    b = withAttr({ format: 'vector', size: 100 })(b);
    f(a, b);
    a = withAttr({ format: 'vector', size: 100 })(a);
    b = withAttr({ format: 'scalar', size: 100 })(b);
    expect(() => f(a, b)).toThrow();
    a = withAttr({ format: 'vector', size: 100 })(a);
    b = withAttr({ format: 'vector', size: 10 })(b);
    expect(() => f(a, b)).toThrow();
  });
});

test('Combines values from 2 scalar streams', async () => {
  const in1 = Array.from(Array(100), () => Math.random());
  const in2 = Array.from(Array(100), () => Math.random());
  const attr = {
    format: 'scalar',
    size: 1,
  };
  const a = withAttr(attr)(makeEventsFromArray(1, in1));
  const b = withAttr(attr)(makeEventsFromArray(1, in2));
  const stream = elementwise((x, y) => (x + y) ** 2, a, b);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(in1.length + 1, stream);
  expect(result.map(x => x.value)).toEqual(in1.map((x, i) => (x + in2[i]) ** 2));
});

test('Combines values from 2 vector streams', async () => {
  const in1 = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const in2 = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const attr = {
    format: 'vector',
    size: 2,
  };
  const a = withAttr(attr)(makeEventsFromArray(1, in1));
  const b = withAttr(attr)(makeEventsFromArray(1, in2));
  const stream = elementwise((x, y) => (x + y) ** 2, a, b);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(2);
  const result = await collectEventsFor(in1.length + 1, stream);
  result.forEach(({ value }, i) => {
    expect(value).toEqual(in1[i].map((x, j) => (x + in2[i][j]) ** 2));
  });
});

test('[add] Adds values from 2 scalar streams', async () => {
  const in1 = Array.from(Array(100), () => Math.random());
  const in2 = Array.from(Array(100), () => Math.random());
  const attr = {
    format: 'scalar',
    size: 1,
  };
  const a = withAttr(attr)(makeEventsFromArray(1, in1));
  const b = withAttr(attr)(makeEventsFromArray(1, in2));
  const stream = add(a, b);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(in1.length + 1, stream);
  expect(result.map(x => x.value)).toEqual(in1.map((x, i) => x + in2[i]));
});

test('[add] Adds values from 2 vector streams', async () => {
  const in1 = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const in2 = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const attr = {
    format: 'vector',
    size: 2,
  };
  const a = withAttr(attr)(makeEventsFromArray(1, in1));
  const b = withAttr(attr)(makeEventsFromArray(1, in2));
  const stream = add(a, b);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(2);
  const result = await collectEventsFor(in1.length + 1, stream);
  result.forEach(({ value }, i) => {
    expect(value).toEqual(in1[i].map((x, j) => x + in2[i][j]));
  });
});

test('[sub] Subtract values from 2 scalar streams', async () => {
  const in1 = Array.from(Array(100), () => Math.random());
  const in2 = Array.from(Array(100), () => Math.random());
  const attr = {
    format: 'scalar',
    size: 1,
  };
  const a = withAttr(attr)(makeEventsFromArray(1, in1));
  const b = withAttr(attr)(makeEventsFromArray(1, in2));
  const stream = sub(a, b);
  expect(stream.attr.format).toBe('scalar');
  expect(stream.attr.size).toBe(1);
  const result = await collectEventsFor(in1.length + 1, stream);
  expect(result.map(x => x.value)).toEqual(in1.map((x, i) => x - in2[i]));
});

test('[sub] Subtract values from 2 vector streams', async () => {
  const in1 = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const in2 = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const attr = {
    format: 'vector',
    size: 2,
  };
  const a = withAttr(attr)(makeEventsFromArray(1, in1));
  const b = withAttr(attr)(makeEventsFromArray(1, in2));
  const stream = sub(a, b);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(2);
  const result = await collectEventsFor(in1.length + 1, stream);
  result.forEach(({ value }, i) => {
    expect(value).toEqual(in1[i].map((x, j) => x - in2[i][j]));
  });
});

test('[mul] Multiply values from 2 vector streams', async () => {
  const in1 = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const in2 = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const attr = {
    format: 'vector',
    size: 2,
  };
  const a = withAttr(attr)(makeEventsFromArray(1, in1));
  const b = withAttr(attr)(makeEventsFromArray(1, in2));
  const stream = mul(a, b);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(2);
  const result = await collectEventsFor(in1.length + 1, stream);
  result.forEach(({ value }, i) => {
    expect(value).toEqual(in1[i].map((x, j) => x * in2[i][j]));
  });
});

test('[div] Divide values from 2 vector streams', async () => {
  const in1 = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const in2 = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const attr = {
    format: 'vector',
    size: 2,
  };
  const a = withAttr(attr)(makeEventsFromArray(1, in1));
  const b = withAttr(attr)(makeEventsFromArray(1, in2));
  const stream = div(a, b);
  expect(stream.attr.format).toBe('vector');
  expect(stream.attr.size).toBe(2);
  const result = await collectEventsFor(in1.length + 1, stream);
  result.forEach(({ value }, i) => {
    expect(value).toEqual(in1[i].map((x, j) => x / in2[i][j]));
  });
});
