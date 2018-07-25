/* esdoc-ignore */
import { Stream } from '@coda/core';
import heatmap_ from './ui/heatmap';
import looper_ from './ui/looper';
import plot_ from './ui/plot';
import recorder_ from './ui/recorder';

export { default as setup } from './setup';

export const heatmap = (options, stream) =>
  new Stream(heatmap_(options, stream));

export const plot = (options, stream) =>
  new Stream(plot_(options, stream));

export const recorder = (options, stream) =>
  new Stream(recorder_(options, stream));

export const looper = (options, stream) =>
  new Stream(looper_(options, stream));
