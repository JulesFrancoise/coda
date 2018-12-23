import { withAttr } from '@coda/prelude';
import { iterations, size } from './options';
import force from '../../src/operator/force';
import { makeRandomEvents, collectEventsFor } from '../../../prelude/test/helper/testEnv';

const a = withAttr({
  type: 'emg',
  format: 'vector',
  size,
  samplerate: 200,
})(makeRandomEvents(iterations, size));
const stream = force({ logdiff: -2, logjump: -10 }, a);

function benchmark(deferred) {
  collectEventsFor(1, stream).then(() => {
    deferred.resolve();
  });
}

export default suite => suite.add(
  `Force # ${iterations} x ${size} `,
  benchmark,
  { defer: true },
);
