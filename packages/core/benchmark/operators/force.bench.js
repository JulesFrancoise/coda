import { iterations, size } from './options';
import force from '../../src/operator/filter/force';
import withAttr from '../../src/lib/common/mixins';
import { makeRandomEvents, collectEventsFor } from '../../test/helper/testEnv';

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
