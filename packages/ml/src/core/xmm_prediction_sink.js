import * as xmm from 'xmm';

/**
 * Model Listener Sink
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
export default class XmmPredictionSink {
  /**
   * @param {Stream} model       Stream of model parameters
   * @param {Function} fetchOutput Function used to fetch the output parameters
   * from the results object of the prediction
   * @param {Object} sink        Sink
   */
  constructor(model, fetchOutput, likelihoodWindow, sink) {
    this.sink = sink;
    if (model.attr.type === 'gmm') {
      this.predictorFactory = xmm.MulticlassGMMPredictor;
    } else if (model.attr.type === 'hmm') {
      this.predictorFactory = xmm.MulticlassHMMPredictor;
    } else if (model.attr.type === 'hhmm') {
      this.predictorFactory = xmm.HierarchicalHMMPredictor;
    } else {
      throw new Error('`recognize` module: unknown model type');
    }
    this.predictor = null;
    this.fetchOutput = fetchOutput;
    this.likelihoodWindow = likelihoodWindow;
    this.modelStream = new ModelListenerSink(this);
  }

  updateModel(params) {
    this.predictor = this.predictorFactory(params);
    this.predictor.setLikelihoodWindow(this.likelihoodWindow);
    this.predictor.reset();
  }

  event(t, x) {
    if (!this.predictor) return;
    this.predictor.predict(x);
    this.sink.event(t, this.fetchOutput(this.predictor.results, this.predictor));
  }

  end(t) {
    return this.sink.end(t);
  }

  error(t, e) {
    return this.sink.error(t, e);
  }
}
