import { Stream } from '@coda/prelude';
import setupCore from './setup_core';
import setupMost from './setup_most';

Stream.use(setupMost);
Stream.use(setupCore);

export { Stream };

export * from './most';
export * from './core';

export { runEffects } from '@most/core';
export { newScheduler, newDefaultScheduler } from '@most/scheduler';
