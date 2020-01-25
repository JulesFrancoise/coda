import { Stream } from '@coda/prelude';
import heatmap_ from './ui/heatmap';
import looper_ from './ui/looper';
import plot_ from './ui/plot';
import recorder_ from './ui/recorder';
import nodes_ from './ui/nodes';
import posenet_ from './ui/posenet';

export function heatmap(options, stream) {
  return new Stream(heatmap_(options, stream));
}

export function plot(options, stream) {
  return new Stream(plot_(options, stream));
}

export function recorder(options, stream) {
  return new Stream(recorder_(options, stream));
}

export function looper(options, stream) {
  return new Stream(looper_(options, stream));
}

export function nodes(options, stream) {
  return new Stream(nodes_(options, stream));
}

export function posenet(options) {
  const p = posenet_(options);
  Object.keys(p).forEach((part) => {
    p[part] = new Stream(p[part]);
  });
  p.autorun = false;
  return p;
}

export { setUiContainer } from './lib/ui';
export { default as _setup } from './setup';
