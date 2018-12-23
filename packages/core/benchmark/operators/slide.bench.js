import { withAttr } from '@coda/prelude';
import { iterations, size } from './options';
import slide from '../../src/operator/slide';
import { makeRandomEvents, collectEventsFor } from '../../../prelude/test/helper/testEnv';

const a = withAttr({
  type: 'emg',
  format: 'vector',
  size,
  samplerate: 200,
})(makeRandomEvents(iterations, size));
const stream = slide({ size: 50 }, a);

function benchmark(deferred) {
  collectEventsFor(1, stream).then(() => {
    deferred.resolve();
  });
}

export default suite => suite.add(
  `Slide # ${iterations} x ${size} `,
  benchmark,
  { defer: true },
);
