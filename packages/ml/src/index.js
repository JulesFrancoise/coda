/* esdoc-ignore */
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
import setup from './setup';

/** @ignore */
export const scaleTrain = source =>
  new Stream(scaleTrain_(source));

/** @ignore */
export const scalePredict = (minmaxstream, source) =>
  new Stream(scalePredict_(minmaxstream, source));

/** @ignore */
export const pcaTrain = source =>
  new Stream(pcaTrain_(source));

/** @ignore */
export const pcapredict = (datastream, source) =>
  new Stream(pcapredict_(datastream, source));

/** @ignore */
export const gmmTrain = (options, source) =>
  new Stream(gmmTrain_(options, source));

/** @ignore */
export const gmmPredict = (options, source) =>
  new Stream(gmmPredict_(options, source));

/** @ignore */
export const hmmTrain = (options, source) =>
  new Stream(hmmTrain_(options, source));

/** @ignore */
export const hmmPredict = (options, source) =>
  new Stream(hmmPredict_(options, source));

/** @ignore */
export const hhmmTrain = (options, source) =>
  new Stream(hhmmTrain_(options, source));

/** @ignore */
export const hhmmPredict = (options, source) =>
  new Stream(hhmmPredict_(options, source));

export default setup;
