import configAudio from './packages/audio/rollup.config';
import configCore from './packages/core/rollup.config';
import configMax from './packages/max/rollup.config';
import configMidi from './packages/midi/rollup.config';
import configMl from './packages/ml/rollup.config';
import configPrelude from './packages/prelude/rollup.config';
import configSandbox from './packages/sandbox/rollup.config';
import configSensors from './packages/sensors/rollup.config';
import configUi from './packages/ui/rollup.config';

function fixConfiguration(config, path) {
  const c = config;
  c.input = `${path}/${config.input}`;
  if (Array.isArray(config.output)) {
    config.output.forEach((o, i) => {
      c.output[i].file = `${path}/${o.file}`;
    });
  } else {
    c.output.file = `${path}/${config.output.file}`;
  }
}

fixConfiguration(configAudio, 'packages/audio');
fixConfiguration(configCore, 'packages/core');
fixConfiguration(configMax, 'packages/max');
fixConfiguration(configMidi, 'packages/midi');
fixConfiguration(configMl[0], 'packages/ml');
fixConfiguration(configMl[1], 'packages/ml');
fixConfiguration(configPrelude, 'packages/prelude');
fixConfiguration(configSandbox, 'packages/sandbox');
fixConfiguration(configSensors, 'packages/sensors');
fixConfiguration(configUi, 'packages/ui');

export default [
  configAudio,
  configCore,
  configMax,
  configMidi,
  configMl[0],
  configMl[1],
  configPrelude,
  configSandbox,
  configSensors,
  configUi,
];
