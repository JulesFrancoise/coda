import { withAttr } from '@coda/prelude';
import { iterations, size } from './options';
import mvavrg from '../../src/operator/mvavrg';
import { makeRandomEvents, collectEventsFor } from '../../../prelude/test/helper/testEnv';

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
