import { validateStream } from '@coda/prelude';
import { disposeBoth } from '@most/disposable';

/**
 * Stream I/O Attributes Specification
 * @ignore
 */
const specification = {
  format: {
    required: true,
    check: ['scalar', 'vector'],
  },
  size: {
    required: true,
    check: { min: 1 },
  },
};

/**
 * @private
 */
class MinmaxListenerSink {
  constructor(scaler) {
    this.scaler = scaler;
  }

  event(t, x) {
    this.scaler.updateMinmax(x);
  }

  end(t) {
    return this.scaler.end(t);
  }

  error(t, e) {
    return this.scaler.error(t, e);
  }
}


/**
 * @private
 */
class ScalerSink {
  /**
   * @param {Stream} minimaxstream      Stream of extremum
   * @param {Object} sink               Sink
   * @param {String} typestream         Format stream (scalar or vector)
   * @param {Object} scheduler          Scheduler
   */
  constructor(minmaxstream, sink, attr) {
    this.sink = sink;
    this.attr = attr;
    this.minmaxStream = new MinmaxListenerSink(this);
    if (attr.format === 'vector') { // A revoir
      this.min = Array.from(Array(attr.size), () => 0);
      this.max = Array.from(Array(attr.size), () => 1);
    } else {
      this.min = 0;
      this.max = 1;
    }
  }

  updateMinmax(params) {
    if (this.attr.format === 'vector') {
      this.min = params.map(x => x.min);
      this.max = params.map(x => x.max);
    } else {
      this.min = params.min;
      this.max = params.max;
    }
  }

  event(t, x) {
    let y;
    if (this.attr.format === 'vector') {
      y = x.map((val, i) => ((val - this.min[i]) / (this.max[i] - this.min[i])));
    } else {
      y = (x - this.min) / (this.max - this.min);
    }
    this.sink.event(t, y);
  }

  end(t) {
    return this.sink.end(t);
  }

  error(t, e) {
    return this.sink.error(t, e);
  }
}

/**
 * Compute real-time scaling from a data stream.
 *
 * @param  {Stream} minmaxstream    stream of extremum values (from scaleTrain)
 * @param  {Stream} source          input data stream
 * @return {Stream}
 */
export default function scalePredict(minmaxstream, source) {
  const attr = validateStream('scalePredict', specification, source.attr);
  if (attr.size !== minmaxstream.attr.size) {
    throw new Error('The dimension of the min/max stream does not match the input stream\'s attributes');
  }
  return {
    attr,
    run(sink, scheduler) {
      const scalerSink = new ScalerSink(minmaxstream, sink, attr, scheduler);
      const minmaxDisposable = minmaxstream.run(scalerSink.minmaxStream, scheduler);
      const dataDisposable = source.run(scalerSink, scheduler);

      return disposeBoth(minmaxDisposable, dataDisposable);
    },
  };
}
