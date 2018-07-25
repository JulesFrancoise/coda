import { iterations, size } from './options';
import mvavrg from '../../src/operator/filter/mvavrg';
import withAttr from '../../src/lib/common/mixins';
import { makeRandomEvents, collectEventsFor } from '../../test/helper/testEnv';

const a = withAttr({
  type: 'emg',
  format: 'vector',
  size,
  samplerate: 200,
})(makeRandomEvents(iterations, size));
const stream = mvavrg({ size: 50 }, a);

function benchmark(deferred) {
  collectEventsFor(1, stream).then(() => {
    deferred.resolve();
  });
}

export default suite => suite.add(
  `Mvavrg # ${iterations} x ${size} `,
  benchmark,
  { defer: true },
);
