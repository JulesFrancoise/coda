import test from 'ava';
import { withAttr } from '@coda/prelude';
import reduce, { sum, prod, min, max, minmax } from '../../../src/operator/basic/reduce';
import { makeEventsFromArray, collectEventsFor } from '../../../../prelude/test/helper/testEnv';

test('Throws if the input stream has invalid attributes', async (t) => {
  let a = makeEventsFromArray(0, []);
  delete a.attr;
  t.throws(() => {
    reduce((s, x) => s + x, 0, a);
  });
  a = withAttr({ format: 'wrong' })(a);
  t.throws(() => {
    reduce((s, x) => s + x, 0, a);
  });
  a = withAttr({ format: 'scalar' })(a);
  t.throws(() => {
    reduce((s, x) => s + x, 0, a);
  });
  a = withAttr({ format: 'vector', size: 100 })(a);
  t.notThrows(() => {
    reduce((s, x) => s + x, 0, a);
  });
  [sum, prod, min, max, minmax].forEach((f) => {
    delete a.attr;
    t.throws(() => {
      f(a);
    });
    a = withAttr({ format: 'wrong' })(a);
    t.throws(() => {
      f(a);
    });
    a = withAttr({ format: 'scalar' })(a);
    t.throws(() => {
      f(a);
    });
    a = withAttr({ format: 'vector', size: 100 })(a);
    t.notThrows(() => {
      f(a);
    });
  });
});

test('Reduce the values of a vector stream', async (t) => {
  const input = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = reduce((s, x) => s.concat([x]), [], a);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(input.length, stream);
  t.deepEqual(result.map(x => x.value), input);
});


test('[sum] sums the values of a vector stream', async (t) => {
  const input = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = sum(a);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(input.length, stream);
  t.deepEqual(result.map(x => x.value), input.map(([x, y]) => x + y));
});

test('[prod] multiplies the values of a vector stream', async (t) => {
  const input = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = prod(a);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(input.length, stream);
  t.deepEqual(result.map(x => x.value), input.map(([x, y]) => x * y));
});

test('[min] compute the minimum of a vector stream', async (t) => {
  const input = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = min(a);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(input.length, stream);
  t.deepEqual(result.map(x => x.value), input.map(([x, y]) => Math.min(x, y)));
});

test('[max] compute the maximum of a vector stream', async (t) => {
  const input = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = max(a);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(input.length, stream);
  t.deepEqual(result.map(x => x.value), input.map(([x, y]) => Math.max(x, y)));
});

test('[minmax] compute the min/max of a vector stream', async (t) => {
  const input = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = minmax(a);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(input.length, stream);
  t.deepEqual(
    result.map(x => x.value),
    input.map(([x, y]) => [Math.min(x, y), Math.max(x, y)]),
  );
});
