import { withAttr } from '@coda/prelude';
import { iterations, size, params } from './options';
import wavelet from '../../src/operator/spectral/wavelet';
import { makeRandomEvents, collectEventsFor } from '../../../prelude/test/helper/testEnv';

const a = withAttr({
  format: 'vector',
  size,
  samplerate: 200,
})(makeRandomEvents(iterations, size));
const stream = wavelet({ ...params, optimisation: 'standard2' }, a);

function benchmark(deferred) {
  collectEventsFor(1, stream).then(() => {
    deferred.resolve();
  });
}

export default suite => suite.add(
  `Standard2 # ${iterations} x ${size}`,
  benchmark,
  { defer: true },
);