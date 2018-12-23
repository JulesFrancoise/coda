import PCA from 'ml-pca';
import { validateStream } from '@coda/prelude';
import { disposeBoth } from '@most/disposable';

/**
 * Stream I/O Attributes Specification
 * @ignore
 */
const specification = {
  format: {
    required: true,
    check: ['vector'],
  },
  size: {
    required: true,
    check: { min: 2 },
  },
};

/**
 * @private
 */
class PCAListenerSink {
  constructor(projector) {
    this.projector = projector;
  }

  event(t, x) {
    this.projector.updatePCA(x);
  }

  end(t) {
    return this.projector.end(t);
  }

  error(t, e) {
    return this.projector.error(t, e);
  }
}


class PCASink {
  /**
   * @param {Stream} datastream        Stream
   * @param {Object} sink              Sink
   * @param {Object} scheduler         Scheduler
   */
  constructor(datastream, sink) {
    this.sink = sink;
    this.pcaParamStream = new PCAListenerSink(this);
    this.pca = null;
  }

  updatePCA(json) {
    this.pca = PCA.load(json);
  }

  event(t, x) {
    if (!this.pca) return;
    const y = this.pca.predict([x]);
    this.sink.event(t, y[0]);
  }

  end(t) {
    return this.sink.end(t);
  }

  error(t, e) {
    return this.sink.error(t, e);
  }
}

/**
 * Compute real-time PCA projection from a data stream.
 *
 * @param  {Stream} pcaParamStream PCA Parameter stream (from pcaTrain)
 * @param  {Stream} source input data stream
 * @return {Stream}
 */
export default function pcaPredict(pcaParamStream, source) {
  const attr = validateStream('pcaPredict', specification, source.attr);
  if (attr.size !== pcaParamStream.attr.size) {
    throw new Error('The dimension of the PCA Trainer Stream does not match the input stream\'s attributes');
  }
  return {
    attr,
    run(sink, scheduler) {
      const pcaPredictionSink = new PCASink(pcaParamStream, sink, scheduler);
      const pcaParamsDisposable = pcaParamStream.run(pcaPredictionSink.pcaParamStream, scheduler);
      const dataDisposable = source.run(pcaPredictionSink, scheduler);

      return disposeBoth(pcaParamsDisposable, dataDisposable);
    },
  };
}
