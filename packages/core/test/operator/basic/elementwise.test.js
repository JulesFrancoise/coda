import test from 'ava';
import elementwise, { add, sub, mul, div } from '../../../src/operator/basic/elementwise';
import withAttr from '../../../src/lib/common/mixins';
import { makeEventsFromArray, collectEventsFor } from '../../helper/testEnv';

test('Throws if the input stream has invalid attributes', async (t) => {
  let a = makeEventsFromArray(0, []);
  let b = makeEventsFromArray(0, []);
  delete a.attr;
  t.throws(() => {
    elementwise(null, a, b);
  });
  a = withAttr({ format: 'wrong' })(a);
  t.throws(() => {
    elementwise(null, a);
  });
  a = withAttr({ format: 'scalar' })(a);
  t.throws(() => {
    elementwise(null, a);
  });
  a = withAttr({ format: 'scalar', size: 1 })(a);
  b = withAttr({ format: 'scalar', size: 1 })(b);
  t.notThrows(() => {
    elementwise(null, a, b);
  });
  a = withAttr({ format: 'vector', size: 100 })(a);
  b = withAttr({ format: 'vector', size: 100 })(b);
  t.notThrows(() => {
    elementwise(null, a, b);
  });
  a = withAttr({ format: 'vector', size: 100 })(a);
  b = withAttr({ format: 'scalar', size: 100 })(b);
  t.throws(() => {
    elementwise(null, a, b);
  });
  a = withAttr({ format: 'vector', size: 100 })(a);
  b = withAttr({ format: 'vector', size: 10 })(b);
  t.throws(() => {
    elementwise(null, a, b);
  });
  [add, sub, mul, div].forEach((f) => {
    delete a.attr;
    t.throws(() => {
      f(a, b);
    });
    a = withAttr({ format: 'wrong' })(a);
    t.throws(() => {
      f(a);
    });
    a = withAttr({ format: 'scalar' })(a);
    t.throws(() => {
      f(a);
    });
    a = withAttr({ format: 'scalar', size: 1 })(a);
    b = withAttr({ format: 'scalar', size: 1 })(b);
    t.notThrows(() => {
      f(a, b);
    });
    a = withAttr({ format: 'vector', size: 100 })(a);
    b = withAttr({ format: 'vector', size: 100 })(b);
    t.notThrows(() => {
      f(a, b);
    });
    a = withAttr({ format: 'vector', size: 100 })(a);
    b = withAttr({ format: 'scalar', size: 100 })(b);
    t.throws(() => {
      f(a, b);
    });
    a = withAttr({ format: 'vector', size: 100 })(a);
    b = withAttr({ format: 'vector', size: 10 })(b);
    t.throws(() => {
      f(a, b);
    });
  });
});

test('Combines values from 2 scalar streams', async (t) => {
  const in1 = Array.from(Array(100), () => Math.random());
  const in2 = Array.from(Array(100), () => Math.random());
  const attr = {
    format: 'scalar',
    size: 1,
  };
  const a = withAttr(attr)(makeEventsFromArray(1, in1));
  const b = withAttr(attr)(makeEventsFromArray(1, in2));
  let stream;
  t.notThrows(() => {
    stream = elementwise((x, y) => (x + y) ** 2, a, b);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(in1.length + 1, stream);
  t.deepEqual(result.map(x => x.value), in1.map((x, i) => (x + in2[i]) ** 2));
});

test('Combines values from 2 vector streams', async (t) => {
  const in1 = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const in2 = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const attr = {
    format: 'vector',
    size: 2,
  };
  const a = withAttr(attr)(makeEventsFromArray(1, in1));
  const b = withAttr(attr)(makeEventsFromArray(1, in2));
  let stream;
  t.notThrows(() => {
    stream = elementwise((x, y) => (x + y) ** 2, a, b);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, 2);
  const result = await collectEventsFor(in1.length + 1, stream);
  result.forEach(({ value }, i) => {
    t.deepEqual(value, in1[i].map((x, j) => (x + in2[i][j]) ** 2));
  });
});

test('[add] Adds values from 2 scalar streams', async (t) => {
  const in1 = Array.from(Array(100), () => Math.random());
  const in2 = Array.from(Array(100), () => Math.random());
  const attr = {
    format: 'scalar',
    size: 1,
  };
  const a = withAttr(attr)(makeEventsFromArray(1, in1));
  const b = withAttr(attr)(makeEventsFromArray(1, in2));
  let stream;
  t.notThrows(() => {
    stream = add(a, b);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(in1.length + 1, stream);
  t.deepEqual(result.map(x => x.value), in1.map((x, i) => x + in2[i]));
});

test('[add] Adds values from 2 vector streams', async (t) => {
  const in1 = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const in2 = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const attr = {
    format: 'vector',
    size: 2,
  };
  const a = withAttr(attr)(makeEventsFromArray(1, in1));
  const b = withAttr(attr)(makeEventsFromArray(1, in2));
  let stream;
  t.notThrows(() => {
    stream = add(a, b);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, 2);
  const result = await collectEventsFor(in1.length + 1, stream);
  result.forEach(({ value }, i) => {
    t.deepEqual(value, in1[i].map((x, j) => x + in2[i][j]));
  });
});

test('[sub] Subtract values from 2 scalar streams', async (t) => {
  const in1 = Array.from(Array(100), () => Math.random());
  const in2 = Array.from(Array(100), () => Math.random());
  const attr = {
    format: 'scalar',
    size: 1,
  };
  const a = withAttr(attr)(makeEventsFromArray(1, in1));
  const b = withAttr(attr)(makeEventsFromArray(1, in2));
  let stream;
  t.notThrows(() => {
    stream = sub(a, b);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(in1.length + 1, stream);
  t.deepEqual(result.map(x => x.value), in1.map((x, i) => x - in2[i]));
});

test('[sub] Subtract values from 2 vector streams', async (t) => {
  const in1 = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const in2 = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const attr = {
    format: 'vector',
    size: 2,
  };
  const a = withAttr(attr)(makeEventsFromArray(1, in1));
  const b = withAttr(attr)(makeEventsFromArray(1, in2));
  let stream;
  t.notThrows(() => {
    stream = sub(a, b);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, 2);
  const result = await collectEventsFor(in1.length + 1, stream);
  result.forEach(({ value }, i) => {
    t.deepEqual(value, in1[i].map((x, j) => x - in2[i][j]));
  });
});

test('[mul] Multiply values from 2 vector streams', async (t) => {
  const in1 = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const in2 = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const attr = {
    format: 'vector',
    size: 2,
  };
  const a = withAttr(attr)(makeEventsFromArray(1, in1));
  const b = withAttr(attr)(makeEventsFromArray(1, in2));
  let stream;
  t.notThrows(() => {
    stream = mul(a, b);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, 2);
  const result = await collectEventsFor(in1.length + 1, stream);
  result.forEach(({ value }, i) => {
    t.deepEqual(value, in1[i].map((x, j) => x * in2[i][j]));
  });
});

test('[div] Divide values from 2 vector streams', async (t) => {
  const in1 = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const in2 = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const attr = {
    format: 'vector',
    size: 2,
  };
  const a = withAttr(attr)(makeEventsFromArray(1, in1));
  const b = withAttr(attr)(makeEventsFromArray(1, in2));
  let stream;
  t.notThrows(() => {
    stream = div(a, b);
  });
  t.is(stream.attr.format, 'vector');
  t.is(stream.attr.size, 2);
  const result = await collectEventsFor(in1.length + 1, stream);
  result.forEach(({ value }, i) => {
    t.deepEqual(value, in1[i].map((x, j) => x / in2[i][j]));
  });
});
