import Vue from 'vue';
import { parseParameters, validateStream } from '@coda/prelude';
import { disposeBoth } from '@most/disposable';
import plotComponent from './Plot.vue';
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
  stacked: {
    type: 'boolean',
    default: false,
  },
  fill: {
    type: 'enum',
    default: 'none',
    list: ['none', 'middle', 'bottom', 'top'],
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

class PlotSink {
  constructor(vueApp, params, attr, sink) {
    this.sink = sink;
    this.prev = 0;
    this.buffer = [];
    this.refresh = params.refresh;
    this.update = true;
    this.app = vueApp;
    this.legend = params.legend;
    this.app.$data.legend = params.legend;
    this.app.$data.length = Math.floor(params.duration * attr.samplerate);
    this.app.$data.channels = attr.size;
    this.app.$data.stacked = params.stacked;
    this.app.$data.fill = params.fill;
    this.attr = attr;
    if (attr.format === 'vector') {
      this.app.$data.buffer = Array(500).fill(Array(attr.size).fill(0));
    }
  }

  event(t, x) {
    if (typeof x !== 'number' && x.length !== this.attr.size) {
      this.attr.size = x.length;
      this.app.$data.channels = this.attr.size;
    }
    if (this.update) {
      this.buffer.push(this.attr.format === 'scalar' ? [x] : x);
      if (t - this.prev >= this.refresh) {
        this.app.push(this.buffer);
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
 * Simple Plotter UI component.
 *
 * @param  {object} options Plot options
 * @param  {number} [options.duration=5] Duration of the window
 * @param  {number} [options.refresh=50] Refresh rate (ms)
 * @param  {string} [options.legend=''] Plot legend
 * @param  {boolean} [options.stacked=false] Specifies if curves should be
 * stacked (by default, curves are superposed)
 * @param  {string} [options.fill='none'] Plain fill options:
 * - 'none': no plain filling (defaut)
 * - 'bottom': fill from bottom
 * - 'middle': fill from middle
 * - 'top': fill to top
 * @param  {Stream} source  Input Stream (scalar or vector)
 * @return {Stream}         Unchanged Input Stream
 *
 * @example
 * p = periodic(20).rand({ size: 3 })
 *   .plot({ legend: 'Simple plot', stacked: true });
 * runEffects(p, newDefaultScheduler());
 */
export default function plot(options, source) {
  const params = parseParameters(definitions, options);
  const attr = validateStream('plot', specification, source.attr);
  const container = document.getElementById(uiSettings.container);
  const component = document.createElement('div');
  const componentId = `ui${container.children.length}`;
  component.setAttribute('id', componentId);
  component.setAttribute('class', 'plot');
  component.appendChild(document.createElement('plot'));
  container.appendChild(component);
  const app = new Vue(plotComponent);
  return {
    attr,
    run(sink, scheduler) {
      const plotSink = new PlotSink(app, params, attr, sink);
      app.$mount(component);
      app.$on('close', () => {
        plotSink.stop();
      });
      const disposeSource = source.run(plotSink, scheduler);
      const disposeThis = {
        dispose() {
          app.$destroy();
          app.$el.remove();
        },
      };
      return disposeBoth(disposeSource, disposeThis);
    },
  };
}
