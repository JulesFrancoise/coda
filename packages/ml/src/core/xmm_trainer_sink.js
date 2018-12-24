import { getContainer } from '@coda/prelude';
import { currentTime } from '@most/scheduler';
import * as xmm from 'xmm';

/**
 * Base sink for Training XMM models
 * @private
 */
export default class XmmTrainerSink {
  /**
   * @param {string} containerId   Data container ID
   * @param {string} modelType     Type of XMM model ('gmm', 'hmm')
   * @param {object} configuration Training configuration
   * @param {Object} sink          sink
   * @param {Object} scheduler     scheduler
   */
  constructor(containerId, configuration, sink, scheduler) {
    this.sink = sink;
    this.scheduler = scheduler;
    this.container = getContainer(containerId);
    this.modelType = configuration.type;
    this.ignoreLabels = configuration.ignoreLabels;
    this.configuration = configuration;
    this.bimodal = this.container.attributes.bimodal;
    this.trainingSet = xmm.TrainingSet({
      inputDimension: this.container.attributes.size,
      outputDimension: this.bimodal ? this.container.attributes.sizeOut : 0,
    });
    this.worker = new Worker('/xmm.worker.js');
    let workerConnected = false;
    this.worker.onmessage = (e) => {
      if (e.data.type === 'error') {
        throw new Error(e.data.message);
      }
      if (e.data.type === 'model') {
        this.sink.event(currentTime(this.scheduler), e.data.params);
      }
      if (e.data.type === 'connection') {
        workerConnected = true;
      }
    };
    setTimeout(() => {
      if (!workerConnected) {
        throw new Error('Cannot connect to XMM training Web Worker. Make sure to place the file `xmm.worker.js` at the root of your application.');
      }
    }, 5000);
    this.worker.postMessage({
      type: 'connect',
    });
  }

  event(t, x) {
    // TODO: improve event tracking
    if (x.type === 'record' && x.value) return;
    this.trainingSet.clear();
    Object.keys(this.container.buffers).forEach((bufferIndex) => {
      const buffer = this.container.buffers[bufferIndex];
      const p = this.trainingSet.push(bufferIndex, this.ignoreLabels ? 'def' : buffer.label);
      if (this.bimodal) {
        buffer.datain.forEach((frame, i) => {
          p.push(frame.concat(buffer.dataout[i]));
        });
      } else {
        buffer.data.forEach((frame) => {
          p.push(frame);
        });
      }
    });
    if (this.trainingSet.empty()) return;
    this.worker.postMessage({
      type: 'train',
      modelType: this.modelType,
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
