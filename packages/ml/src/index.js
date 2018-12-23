import { Stream } from '@coda/prelude';
import scaleTrain_ from './operator/scale_train';
import scalePredict_ from './operator/scale_predict';
import pcaTrain_ from './operator/pca_train';
import pcapredict_ from './operator/pca_predict';
import {
  gmmTrain as gmmTrain_,
  hmmTrain as hmmTrain_,
  hhmmTrain as hhmmTrain_,
} from './operator/xmm_train';
import {
  gmmPredict as gmmPredict_,
  hmmPredict as hmmPredict_,
  hhmmPredict as hhmmPredict_,
} from './operator/xmm_predict';

export function scaleTrain(source) {
  return new Stream(scaleTrain_(source));
}

export function scalePredict(minmaxstream, source) {
  return new Stream(scalePredict_(minmaxstream, source));
}

export function pcaTrain(source) {
  return new Stream(pcaTrain_(source));
}

export function pcapredict(datastream, source) {
  return new Stream(pcapredict_(datastream, source));
}

export function gmmTrain(options, source) {
  return new Stream(gmmTrain_(options, source));
}

export function gmmPredict(options, source) {
  return new Stream(gmmPredict_(options, source));
}

export function hmmTrain(options, source) {
  return new Stream(hmmTrain_(options, source));
}

export function hmmPredict(options, source) {
  return new Stream(hmmPredict_(options, source));
}

export function hhmmTrain(options, source) {
  return new Stream(hhmmTrain_(options, source));
}

export function hhmmPredict(options, source) {
  return new Stream(hhmmPredict_(options, source));
}

export { default as _setup } from './setup';
