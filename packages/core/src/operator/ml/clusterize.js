import * as xmm from 'xmm';
import parseParameters from '../../lib/common/parameters';

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
  gaussians: {
    required: false,
    type: 'integer',
    default: 3,
  },
  states: {
    required: false,
    type: 'integer',
    default: 3,
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
class ClusterizerSink {
  /**
   * @param {Stream} model       Stream of model parameters
   * @param {Function} fetchOutput Function used to fetch the output parameters
   * from the results object of the prediction
   * @param {Object} sink        Sink
   * @param {Object} scheduler   Scheduler
   */
  constructor(model, output, sink, scheduler) {
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
    this.output = output;
    model.run(new ModelListenerSink(this), scheduler);
  }

  updateModel(params) {
    this.predictor = this.predictorFactory(params);
    this.predictor.reset();
  }

  event(t, x) {
    if (!this.predictor) return;
    this.predictor.predict(x);
    const res = this.predictor.models[this.predictor.results.likeliest];
    this.sink.event(t, res[this.output].slice());
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
  const output = (model.attr.type === 'GMM') ? 'beta' : 'alpha';
  const outputSize = (model.attr.type === 'GMM') ? params.gaussians : params.states;
  return {
    attr: {
      format: 'vector',
      size: outputSize,
      varsize: true,
    },
    run(sink, scheduler) {
      const trainerSink = new ClusterizerSink(
        model,
        output,
        sink,
        scheduler,
      );

      return source.run(trainerSink, scheduler);
    },
  };
}
