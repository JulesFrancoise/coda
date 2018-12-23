import { Stream } from '@coda/prelude';
import fromMax_ from './frommax';
import toMax_ from './tomax';

export function fromMax(options) {
  return new Stream(fromMax_(options));
}

export function toMax(options, stream) {
  return new Stream(toMax_(options, stream));
}

export { default as _setup } from './setup';
