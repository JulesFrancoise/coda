import Vue from 'vue';
import { parseParameters, validateStream } from '@coda/prelude';
import { disposeBoth } from '@most/disposable';
import heatmapComponent from './Heatmap.vue';
import uiSettings from '../lib/ui';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  duration: {
    type: 'integer',
    default: 5,
  },
  refresh: {
    type: 'float',
    default: 50,
  },
  legend: {
    type: 'string',
    default: '',
  },
};

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
  samplerate: {
    required: false,
    check: { min: 1 },
    transform(s) {
      return s || 100;
    },
  },
};

class HeatmapSink {
  constructor(updateUI, params, sink) {
    this.updateUI = updateUI;
    this.sink = sink;
    this.prev = 0;
    this.buffer = [];
    this.refresh = params.refresh;
    this.update = true;
  }

  event(t, x) {
    if (this.update) {
      this.buffer.push(x);
      if (t - this.prev >= this.refresh) {
        this.updateUI(this.buffer);
        this.buffer = [];
        this.prev = t;
      }
    }
    this.sink.event(t, x);
  }

  stop() {
    this.update = false;
  }

  end(t) {
    return this.sink.end(t);
  }

  error(t, e) {
    return this.sink.error(t, e);
  }
}

/**
 * Simple Heatmap UI component. The heatmap works like a sonogram
 * visualization (sliding window).
 *
 * @param  {object} options Heatmap options
 * @param  {number} [options.duration=5] Duration of the window
 * @param  {number} [options.refresh=50] Refresh rate (ms)
 * @param  {string} [options.legend=''] Plot legend
 * @param  {Stream} source  Input stream (scalar or vector)
 * @return {Stream}         Scalogram stream
 *
 * @example
 * noise = periodic(20).rand({ size: 20 }).heatmap();
 */
export default function heatmap(options, source) {
  const params = parseParameters(definitions, options);
  const attr = validateStream('heatmap', specification, source.attr);
  const container = document.getElementById(uiSettings.container);
  const component = document.createElement('div');
  const componentId = `ui${container.children.length}`;
  component.setAttribute('id', componentId);
  component.setAttribute('class', 'plot');
  component.appendChild(document.createElement('plot'));
  container.appendChild(component);
  const app = new Vue(heatmapComponent);
  app.$data.legend = params.legend;
  app.$data.length = params.duration * attr.samplerate;
  app.$data.channels = attr.size;
  return {
    attr,
    run(sink, scheduler) {
      app.$mount(component);
      const heatmapSink = new HeatmapSink(app.push, params, sink);
      app.$on('close', () => {
        heatmapSink.stop();
      });
      const disposeSource = source.run(heatmapSink, scheduler);
      const disposeThis = {
        dispose() {
          app.$destroy();
          app.$el.remove();
          heatmapSink.end();
        },
      };
      return disposeBoth(disposeSource, disposeThis);
    },
  };
}
