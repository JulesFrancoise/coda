import { iterations, size } from './options';
import biquad from '../../src/operator/filter/biquad';
import withAttr from '../../src/lib/common/mixins';
import { makeRandomEvents, collectEventsFor } from '../../test/helper/testEnv';

const a = withAttr({
  type: 'emg',
  format: 'vector',
  size,
  samplerate: 200,
})(makeRandomEvents(iterations, size));
const stream = biquad({ type: 'lowpass', f0: 0.2 }, a);

async function benchmark(deferred) {
  await collectEventsFor(1, stream);
  deferred.resolve();
}

export default suite => suite.add(
  `Biquad # ${iterations} x ${size} `,
  benchmark,
  { defer: true },
);
