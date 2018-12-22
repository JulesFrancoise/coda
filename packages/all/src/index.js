import * as codaCore from '@coda/core';
import * as codaAudio from '@coda/audio';
import * as codaUi from '@coda/ui';
import * as codaMax from '@coda/max';
import * as codaMidi from '@coda/midi';
import * as codaMl from '@coda/ml';
import * as codaMyo from '@coda/myo';
import * as codaLeapmotion from '@coda/leapmotion';

codaCore.Stream
  .use(codaMax.default)
  .use(codaMidi.default)
  .use(codaMl.default)
  .use(codaUi.default, 'ui');

export default {
  ...codaCore,
  ...codaAudio,
  ...codaUi,
  ...codaMax,
  ...codaMidi,
  ...codaMl,
  ...codaMyo,
  ...codaLeapmotion,
};
