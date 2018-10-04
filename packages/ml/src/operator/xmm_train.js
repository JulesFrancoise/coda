import { parseParameters } from '@coda/prelude';
import XmmTrainerSink from '../core/xmm_trainer_sink';

/**
 * GMM Parameter definitions
 * @ignore
 */
const gmmDefinitions = {
  gaussians: {
    type: 'integer',
    default: 3,
    min: 1,
  },
  regularizationAbs: {
    type: 'float',
    default: 0.1,
    min: 0,
  },
  regularizationRel: {
    type: 'float',
    default: 1e-10,
    min: 0,
  },
  covarianceMode: {
    type: 'enum',
    default: 'full',
    list: ['full', 'diagonal'],
  },
  ignoreLabels: {
    type: 'boolean',
    default: false,
  },
};

/**
 * HMM Parameter definitions
 * @ignore
 */
const hmmDefinitions = {
  ...gmmDefinitions,
  states: {
    type: 'integer',
    default: 5,
    min: 1,
  },
  gaussians: {
    type: 'integer',
    default: 1,
    min: 1,
  },
};

/**
 * Factory function for XMM training operators
 * @private
 * @param  {String} type        Model Type
 * @param  {Object} definitions Training parameters definitions
 * @return {Function}           Training operator
 */
const xmmTrainFactory = (type, definitions) =>
  function xmmTrain(options = {}, source) {
    if (!source.attr || !source.attr.containerId) {
      throw new Error('The source stream must include a `containerId` attribute.');
    }
    const params = parseParameters(definitions, options);
    const configuration = {
      type,
      ...params,
      regularization: {
        absolute: params.regularizationAbs,
        relative: params.regularizationRel,
      },
    };
    return {
      attr: {
        type,
        format: 'xmm',
      },
      run(sink, scheduler) {
        const trainerSink = new XmmTrainerSink(
          source.attr.containerId,
          configuration,
          sink,
          scheduler,
        );
        return source.run(trainerSink, scheduler);
      },
    };
  };

/**
 * Train a Gaussian Mixture Model for recognition from a stream of recording events
 * @param  {Object} [options={}] Training parameters
 * @param  {Number} [options.gaussians=3] Number of gaussian components
 * @param  {Number} [options.regularizationAbs=0.1] Absolute regularization
 * @param  {Number} [options.regularizationRel=1e-10] Relative regularization
 * @param  {String} [options.covarianceMode='full'] Type of covariance matrix
 * @param  {Stream} source       Source stream (recording events)
 * @return {Stream}              Stream of model parameters
 */
export const gmmTrain = xmmTrainFactory('gmm', gmmDefinitions);

/**
 * Train a Hidden Markov Model for recognition from a stream of recording events
 * @param  {Object} [options={}] Training parameters
 * @param  {Number} [options.states=5] Number of hidden states
 * @param  {Number} [options.gaussians=1] Number of gaussian components per state
 * @param  {Number} [options.regularizationAbs=0.1] Absolute regularization
 * @param  {Number} [options.regularizationRel=1e-10] Relative regularization
 * @param  {String} [options.covarianceMode='full'] Type of covariance matrix
 * @param  {Stream} source       Source stream (recording events)
 * @return {Stream}              Stream of model parameters
 */
export const hmmTrain = xmmTrainFactory('hmm', hmmDefinitions);

/**
 * Train a Hierarchical Hidden Markov Model for recognition from a stream of recording events
 * @param  {Object} [options={}] Training parameters
 * @param  {Number} [options.states=5] Number of hidden states
 * @param  {Number} [options.gaussians=1] Number of gaussian components per state
 * @param  {Number} [options.regularizationAbs=0.1] Absolute regularization
 * @param  {Number} [options.regularizationRel=1e-10] Relative regularization
 * @param  {String} [options.covarianceMode='full'] Type of covariance matrix
 * @param  {Stream} source       Source stream (recording events)
 * @return {Stream}              Stream of model parameters
 */
export const hhmmTrain = xmmTrainFactory('hhmm', hmmDefinitions);
