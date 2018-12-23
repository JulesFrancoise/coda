import { Stream } from '@coda/prelude';
import atodb_ from './operator/atodb';
import dbtoa_ from './operator/dbtoa';
import ftom_ from './operator/ftom';
import mtof_ from './operator/mtof';
import quantize_ from './operator/quantize';

export function atodb(stream) {
  return new Stream(atodb_(stream));
}

export function dbtoa(stream) {
  return new Stream(dbtoa_(stream));
}

export function ftom(stream) {
  return new Stream(ftom_(stream));
}

export function mtof(stream) {
  return new Stream(mtof_(stream));
}

export function quantize(options, stream) {
  return new Stream(quantize_(options, stream));
}

export { default as _setup } from './setup';
