import { Stream } from '@coda/prelude';
import setupCore from './setup_core';
import setupMost from './setup_most';

Stream.use({ _setup: setupMost });
Stream.use({ _setup: setupCore });

export { Stream };

export * from './most';
export * from './core';

export { runEffects } from '@most/core';
export { newScheduler, newDefaultScheduler } from '@most/scheduler';
