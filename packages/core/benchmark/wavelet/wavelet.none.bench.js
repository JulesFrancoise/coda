import { withAttr } from '@coda/prelude';
import { iterations, size, params } from './options';
import wavelet from '../../src/operator/wavelet';
import { makeRandomEvents, collectEventsFor } from '../../../prelude/test/helper/testEnv';

const a = withAttr({
  format: 'vector',
  size,
  samplerate: 200,
})(makeRandomEvents(iterations, size));
const stream = wavelet({ ...params, optimisation: 'none' }, a);

function benchmark(deferred) {
  collectEventsFor(1, stream).then(() => {
    deferred.resolve();
  });
}

export default suite => suite.add(
  `None # ${iterations} x ${size}`,
  benchmark,
  { defer: true },
);
