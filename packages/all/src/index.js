import * as codaCore from '@coda/core';
import * as codaAudio from '@coda/audio';
import * as codaUi from '@coda/ui';
import * as codaMax from '@coda/max';
import * as codaMidi from '@coda/midi';
import * as codaMl from '@coda/ml';
import * as codaMyo from '@coda/myo';
import * as codaLeapmotion from '@coda/leapmotion';

codaMax.setup(codaCore.Stream);
codaMidi.setup(codaCore.Stream);
codaMl.setup(codaCore.Stream);
codaUi.setup(codaCore.Stream, 'ui');

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
