import { withAttr } from '@coda/prelude';
import { iterations, size } from './options';
import scale from '../../src/operator/scale';
import { makeRandomEvents, collectEventsFor } from '../../../prelude/test/helper/testEnv';

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
