import * as codaCore from '@coda/core';
import * as codaAudio from '@coda/audio';
import * as codaUi from '@coda/ui';
import * as codaMax from '@coda/max';
import * as codaMidi from '@coda/midi';
import * as codaMl from '@coda/ml';
import * as codaSensors from '@coda/sensors';

codaCore.Stream
  .use(codaMax)
  .use(codaMidi)
  .use(codaMl)
  .use(codaUi, 'ui');

export default {
  ...codaCore,
  ...codaAudio,
  ...codaUi,
  ...codaMax,
  ...codaMidi,
  ...codaMl,
  ...codaSensors,
};
