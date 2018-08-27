import { getContainer } from '@coda/prelude';
import { now } from '@most/core';
import { currentTime } from '@most/scheduler';
import * as xmm from 'xmm';

/**
 * Trainer regression Sink
 * @private
 */
class TrainerSink {
  constructor(containerId, modelType, configuration, sink, scheduler) {
    this.sink = sink;
    this.scheduler = scheduler;
    this.container = getContainer(containerId);
    this.modelType = modelType;
    this.configuration = configuration;
    this.trainingSet = xmm.TrainingSet({
      inputDimension: this.container.attributes.size,
      outputDimension: 2,
    });
    this.worker = new Worker('xmm.worker.js');
    this.worker.onmessage = (e) => {
      if (e.data.type === 'error') {
        throw new Error(e.data.message);
      }
      if (e.data.type === 'model') {
        this.sink.event(currentTime(this.scheduler), e.data.params);
      }
    };
  }

  event(t, x) {
    // TODO: improve event tracking
    if (x.type === 'record' && x.value) return;
    this.trainingSet.clear();
    Object.keys(this.container.buffers).forEach((bufferIndex) => {
      const buffer = this.container.buffers[bufferIndex];
      const p = this.trainingSet.push(bufferIndex, buffer.label);
      for (let i = 0; i < buffer.datain.length; i += 1) {
        p.pushInput(buffer.datain[i]);
        p.pushOutput(buffer.dataout[i]);
      }
    });
    console.log('this.trainingSet', this.trainingSet);
    this.worker.postMessage({
      type: this.modelType,
      trainingSet: this.trainingSet,
      configuration: this.configuration,
    });
  }

  end(t) {
    return this.sink.end(t);
  }

  error(t, e) {
    return this.sink.error(t, e);
  }
}

/**
 * Create a stream of model parameters from a recorder stream using a node interface
 *
 * @param  {Object} [options={}] Training Options
 * @param  {String} [options.type='GMM'] Model Type
 * @param  {Stream|String} source     Recorder source, or data container name.
 * When using a recorder, the training function will be called on any relevant
 * event affecting the training data. When using a container name (`string`),
 * `train` returns a stream with a single event containing the model's
 * parameters.
 * @return {Stream} Stream of model parameters (usable with `predict`)
 */
export default function train(options = { type: 'GMM' }, source) {
  let containerId;
  let actualSource;
  if (typeof source === 'string') {
    containerId = source;
    actualSource = now({ type: 'train' });
  } else if (source.run !== undefined) {
    if (!source.attr || !source.attr.containerId) {
      throw new Error('The source stream must include a `containerId` attribute.');
    }
    actualSource = source;
    containerId = source.attr.containerId; // eslint-disable-line
  } else {
    throw new Error('Unkown source type for `train`');
  }
  // Train the GMM with the given configuration
  const regularization = Object.assign({
    absolute: 1e-1,
    relative: 1e-10,
  }, options.regularization);
  const configuration = Object.assign({
    type: 'GMM',
    gaussians: 3,
    covarianceMode: 'full',
  }, options, { regularization });
  const { type } = configuration;
  let modelType;
  if (type === 'GMM') {
    modelType = 'gmm';
  } else if (type === 'HMM' || type === 'HHMM') {
    modelType = 'hmm';
  } else {
    throw new Error('`train`: unknown model type');
  }
  return {
    attr: {
      type,
      format: 'ml',
    },
    run(sink, scheduler) {
      const trainerSink = new TrainerSink(
        containerId,
        modelType,
        configuration,
        sink,
        scheduler,
      );
      return actualSource.run(trainerSink, scheduler);
    },
  };
}
