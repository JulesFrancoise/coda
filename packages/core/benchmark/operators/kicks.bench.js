import { withAttr } from '@coda/prelude';
import { iterations, size } from './options';
import kicks from '../../src/operator/kicks';
import { makeRandomEvents, collectEventsFor } from '../../../prelude/test/helper/testEnv';

const a = withAttr({
  type: 'emg',
  format: 'vector',
  size,
  samplerate: 200,
})(makeRandomEvents(iterations, size));
const stream = kicks({}, a);

async function benchmark(deferred) {
  await collectEventsFor(1, stream);
  deferred.resolve();
}

export default suite => suite.add(
  `Kicks # ${iterations} x ${size} `,
  benchmark,
  { defer: true },
);
