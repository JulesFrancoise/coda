import * as xmm from 'xmm';
import { parseParameters } from '@coda/prelude';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  model: {
    required: true,
    type: 'any',
    default: {},
  },
  output: {
    type: 'enum',
    default: 'smoothedNormalizedLikelihoods',
    list: [
      'all',
      'smoothedLogLikelihoods',
      'smoothedNormalizedLikelihoods',
      'likeliest',
      'progress',
      'outputValues',
    ],
  },
};

/**
 * @private
 */
class ModelListenerSink {
  constructor(recognizer) {
    this.recognizer = recognizer;
  }

  event(t, x) {
    this.recognizer.updateModel(x);
  }

  end(t) {
    return this.recognizer.end(t);
  }

  error(t, e) {
    return this.recognizer.error(t, e);
  }
}

/**
 * Recognizer sink
 * @private
 */
class RecognizerSink {
  /**
   * @param {Stream} model       Stream of model parameters
   * @param {Function} fetchOutput Function used to fetch the output parameters
   * from the results object of the prediction
   * @param {Object} sink        Sink
   * @param {Object} scheduler   Scheduler
   */
  constructor(model, fetchOutput, sink, scheduler) {
    this.sink = sink;
    this.scheduler = scheduler;
    if (model.attr.type === 'GMM') {
      this.predictorFactory = xmm.MulticlassGMMPredictor;
    } else if (model.attr.type === 'HMM') {
      this.predictorFactory = xmm.MulticlassHMMPredictor;
    } else if (model.attr.type === 'HHMM') {
      this.predictorFactory = xmm.HierarchicalHMMPredictor;
    } else {
      throw new Error('`recognize` module: unknown model type');
    }
    this.predictor = null;
    this.fetchOutput = fetchOutput;
    model.run(new ModelListenerSink(this), scheduler);
  }

  updateModel(params) {
    this.predictor = this.predictorFactory(params);
    this.predictor.reset();
  }

  event(t, x) {
    if (!this.predictor) return;
    this.predictor.predict(x);
    this.sink.event(t, this.fetchOutput(this.predictor.results));
  }

  end(t) {
    return this.sink.end(t);
  }

  error(t, e) {
    return this.sink.error(t, e);
  }
}

/**
 * Compute real-time recognition from a data stream.
 *
 * The operator takes a set of options including a stream of model parameters
 * obtained with the {@link train} source.
 *
 * @todo More details here...
 *
 * @param  {Object} [options={}] Recognizer options
 * @param  {Stream} [options.model=null] Stream of model parameters obtained
 * through {@link train}.
 * @param  {string} [options.output='smoothedLogLikelihoods'] Type of output
 * data.
 * @param  {Stream} source input data stream
 * @return {Stream}
 */
export default function recognize(options = {
  model: null,
  output: 'smoothedLogLikelihoods',
}, source) {
  if (!options.model || !options.model.run) {
    throw new Error('The `recognize` module requires a stream of model parameters');
  }
  const { model } = options;
  if (!model.attr.type) {
    throw new Error('The `recognize` module requires a model stream with a type (`GMM`, `HMM` or `HHMM`)');
  }
  const opt = { ...options, model };
  const params = parseParameters(definitions, opt);
  const fetchOutput = params.output !== 'all' ?
    res => res[params.output].slice() :
    res => Object.assign({}, res);
  return {
    attr: {
      format: 'vector',
      size: 2,
      varsize: true,
    },
    run(sink, scheduler) {
      const trainerSink = new RecognizerSink(
        model,
        fetchOutput,
        sink,
        scheduler,
      );

      return source.run(trainerSink, scheduler);
    },
  };
}
