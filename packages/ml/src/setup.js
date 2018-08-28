/* esdoc-ignore */
import scaleTrain from './operator/scale_train';
import scalePredict from './operator/scale_predict';
import pcaTrain from './operator/pca_train';
import pcaPredict from './operator/pca_predict';
import { gmmTrain, hmmTrain, hhmmTrain } from './operator/xmm_train';
import { gmmPredict, hmmPredict, hhmmPredict } from './operator/xmm_predict';

export default function setupCore(Stream) {
  const s = Stream;

  /**
   * @return {Stream}
   */
  s.prototype.scaleTrain = function scaleTrain_() {
    return new Stream(scaleTrain(this));
  };

  /**
   * @param  {Stream} minmaxstream    stream of extremum
   * @return {Stream}
   */
  s.prototype.scalePredict = function scalePredict_(minmaxstream) {
    return new Stream(scalePredict(minmaxstream, this));
  };

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.pcaTrain = function pcaTrain_() {
    return new Stream(pcaTrain(this));
  };

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.pcaPredict = function pcaPredict_(datastream) {
    return new Stream(pcaPredict(datastream, this));
  };

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.gmmTrain = function gmmTrain_(options) {
    return new Stream(gmmTrain(options, this));
  };

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.gmmPredict = function gmmPredict_(options) {
    return new Stream(gmmPredict(options, this));
  };

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.hmmTrain = function hmmTrain_(options) {
    return new Stream(hmmTrain(options, this));
  };

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.hmmPredict = function hmmPredict_(options) {
    return new Stream(hmmPredict(options, this));
  };

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.hhmmTrain = function hhmmTrain_(options) {
    return new Stream(hhmmTrain(options, this));
  };

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.hhmmPredict = function hhmmPredict_(options) {
    return new Stream(hhmmPredict(options, this));
  };
}
