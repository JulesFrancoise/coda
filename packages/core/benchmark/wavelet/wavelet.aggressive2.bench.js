import { iterations, size, params } from './options';
import wavelet from '../../src/operator/spectral/wavelet';
import withAttr from '../../src/lib/common/mixins';
import { makeRandomEvents, collectEventsFor } from '../../test/helper/testEnv';

const a = withAttr({
  format: 'vector',
  size,
  samplerate: 200,
})(makeRandomEvents(iterations, size));
const stream = wavelet({ ...params, optimisation: 'aggressive2' }, a);

function benchmark(deferred) {
  collectEventsFor(1, stream).then(() => {
    deferred.resolve();
  });
}

export default suite => suite.add(
  `Aggressive2 # ${iterations} x ${size}`,
  benchmark,
  { defer: true },
);
