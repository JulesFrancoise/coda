import PCA from 'ml-pca';
import { validateStream } from '@coda/prelude';

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
  constructor(datastream, sink, scheduler) {
    this.sink = sink;
    datastream.run(new PCAListenerSink(this), scheduler);
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
 * Compute real-time pca projection from a data stream.
 *
 * @param  {Stream} datastream
 * @param  {Stream} source          input data stream
 * @return {Stream}
 */
export default function pcapredict(datastream, source) {
  const attr = validateStream('pca predict', specification, source.attr);
  if (attr.size !== datastream.attr.size) {
    throw new Error('The dimension of the datastream does not match the input stream\'s attributes');
  }
  return {
    attr,
    run(sink, scheduler) {
      return source.run(new PCASink(datastream, sink, scheduler), scheduler);
    },
  };
}
