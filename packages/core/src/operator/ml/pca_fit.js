import PCA from 'ml-pca';
import { validateStream, getContainer } from '@coda/prelude';

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
 * PCA vector Sink. PCA of a scalar stream does not mean anything
 * @private
 */
class PCASink {
  constructor(containerId, sink) {
    /**
     * event sink
     * @type {Object}
     */
    this.sink = sink;
    this.pca = null;
    this.container = getContainer(containerId);
  }

  event(t, x) {
    if (x.type !== 'record' || x.value) return;
    // let dataset = [];
    // Object.keys(this.container.buffers).forEach((bufferIndex) => {
    //   const buffer = this.container.buffers[bufferIndex];
    //   dataset = dataset.concat(buffer.data);
    // });
    const dataset = Object.values(this.container.buffers)
      .reduce((arr, y) => arr.concat(y.data), []);
    this.pca = new PCA(dataset);
    this.sink.event(t, this.pca.toJSON());
  }
  /**
   * End the stream
   * @param  {Number} t Timestamp
   * @return {*}
   */
  end(t) {
    return this.sink.end(t);
  }
  /**
   * Propagate an error
   * @param  {Number} t Timestamp
   * @param  {Error}  e Error
   * @return {*}
   */
  error(t, e) {
    return this.sink.error(t, e);
  }
}


/**
 * Fit the model with X
 *
 * @param  {Stream|String} source     Recorder source, or data container name.
 * @return {Stream}
 */
export default function pcafit(source) {
  const attr = validateStream('PCA', specification, source.attr);
  return {
    attr,
    run(sink, scheduler) {
      return source.run(
        new PCASink(source.attr.containerId, sink),
        scheduler,
      );
    },
  };
}
