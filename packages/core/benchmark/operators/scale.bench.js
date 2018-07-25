import { iterations, size } from './options';
import scale from '../../src/operator/mapping/scale';
import withAttr from '../../src/lib/common/mixins';
import { makeRandomEvents, collectEventsFor } from '../../test/helper/testEnv';

const a = withAttr({
  type: 'emg',
  format: 'vector',
  size,
  samplerate: 200,
})(makeRandomEvents(iterations, size));
const stream = scale({ outmin: -100, outmax: 2000 }, a);

function benchmark(deferred) {
  collectEventsFor(1, stream).then(() => {
    deferred.resolve();
  });
}

export default suite => suite.add(
  `Scale # ${iterations} x ${size} `,
  benchmark,
  { defer: true },
);
