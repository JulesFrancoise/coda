import test from 'ava';
import { withAttr } from '@coda/prelude';
import { mean, std, meanstd } from '../../../src/operator/basic/meanstd';
import { makeEventsFromArray, collectEventsFor } from '../../../../prelude/test/helper/testEnv';

test('Throws if the input stream has invalid attributes', async (t) => {
  [mean, std, meanstd].forEach((f) => {
    let a = makeEventsFromArray(0, []);
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

test('[mean] computes the mean of a vector stream', async (t) => {
  const input = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = mean(a);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(input.length, stream);
  t.deepEqual(result.map(x => x.value), input.map(([x, y]) => (x + y) / 2));
});

test('[std] computes the std of a vector stream', async (t) => {
  const input = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = std(a);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(input.length, stream);
  const std2 = ([x, y]) => {
    const m = (x + y) / 2;
    return Math.sqrt((((x - m) ** 2) + ((y - m) ** 2)) / 2);
  };
  t.deepEqual(result.map(x => x.value), input.map(std2));
});

test('[meanstd] computes the [mean, std] of a vector stream', async (t) => {
  const input = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const a = withAttr({
    format: 'vector',
    size: 2,
  })(makeEventsFromArray(0, input));
  let stream;
  t.notThrows(() => {
    stream = meanstd(a);
  });
  t.is(stream.attr.format, 'scalar');
  t.is(stream.attr.size, 1);
  const result = await collectEventsFor(input.length, stream);
  const meanstd2 = ([x, y]) => {
    const m = (x + y) / 2;
    const s = Math.sqrt((((x - m) ** 2) + ((y - m) ** 2)) / 2);
    return [m, s];
  };
  t.deepEqual(result.map(x => x.value), input.map(meanstd2));
});
