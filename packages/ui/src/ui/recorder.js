import Vue from 'vue';
import {
  parseParameters,
  validateStream,
  registerContainer,
  generateContainerId,
} from '@coda/core';
import { disposeBoth } from '@most/disposable';
import { currentTime } from '@most/scheduler';
import recorderComponent from './Recorder.vue';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  name: {
    type: 'string',
    default: '',
  },
  refresh: {
    type: 'float',
    default: 50,
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

class RecorderSink {
  constructor(updateUI, container, params, sink, scheduler) {
    this.updateUI = updateUI;
    this.sink = sink;
    this.scheduler = scheduler;
    this.prev = 0;
    this.refresh = params.refresh;
    this.container = container;
    this.bufferIndex = 0;
    this.recording = false;
  }

  record(recording, bufferIndex) {
    this.recording = recording;
    this.bufferIndex = bufferIndex;
    if (this.recording) {
      this.container.buffers[this.bufferIndex] = {
        label: this.bufferIndex.toString(),
        data: [],
      };
    }
    this.sink.event(currentTime(this.scheduler), {
      type: 'record',
      value: this.recording,
      bufferIndex: this.bufferIndex,
    });
  }

  remove(bufferIndex) {
    this.recording = false;
    this.bufferIndex = 0;
    this.container.buffers[bufferIndex] = null;
    delete this.container.buffers[bufferIndex];
    this.sink.event(currentTime(this.scheduler), {
      type: 'remove',
      bufferIndex,
    });
  }

  setLabel(bufferIndex, label) {
    this.container.buffers[bufferIndex].label = label;
    this.sink.event(currentTime(this.scheduler), {
      type: 'label',
      value: label,
      bufferIndex,
    });
  }

  event(t, x) {
    if (this.recording) {
      this.container.buffers[this.bufferIndex].data.push(x);
      if (t - this.prev >= this.refresh) {
        this.updateUI(this.container.buffers[this.bufferIndex].data);
        this.prev = t;
      }
    }
  }

  end(t) {
    return this.sink.end(t);
  }

  error(t, e) {
    return this.sink.error(t, e);
  }
}

function setupDom() {
  const domContainer = document.getElementById('ui');
  const domComponent = document.createElement('div');
  const domComponentId = `ui${domContainer.children.length}`;
  domComponent.setAttribute('id', domComponentId);
  domComponent.setAttribute('class', 'recorder');
  domComponent.appendChild(document.createElement('recorder'));
  domContainer.appendChild(domComponent);
  return domComponent;
}

/**
 * Recorder UI component. Multibuffer. Records to a global buffer.
 *
 * @param  {object} options Recorder options
 * @param  {string} [options.name=''] Buffer name
 * @param  {number} [options.refresh=50] Refresh rate (ms)
 * @param  {boolean} [options.stacked=false] Specifies if curves should be
 * stacked (by default, curves are superposed)
 * @param  {string} [options.fill='none'] Plain fill options:
 * - 'none': no plain filling (defaut)
 * - 'bottom': fill from bottom
 * - 'middle': fill from middle
 * - 'top': fill to top
 * @param  {Stream} source  Input Stream (scalar or vector)
 * @return {Stream}         Unchanged Input Stream
 */
export default function recorder(options, source) {
  const params = parseParameters(definitions, options);
  params.name = params.name || generateContainerId();
  const attr = validateStream('recorder', specification, source.attr);
  attr.containerId = params.name;
  const container = registerContainer(params.name, attr);
  const domComponent = setupDom();
  const app = new Vue(recorderComponent);
  app.$data.legend = params.name;
  app.$data.channels = attr.size;
  app.$data.stacked = params.stacked;
  app.$data.fill = params.fill;
  return {
    attr,
    run(sink, scheduler) {
      app.$mount(domComponent);
      const recorderSink = new RecorderSink(app.setBufferData, container, params, sink, scheduler);
      app.$on('record', (recording, bufferIndex) => {
        recorderSink.record(recording, bufferIndex);
      });
      app.$on('remove', (bufferIndex) => {
        recorderSink.remove(bufferIndex);
      });
      app.$on('label', (bufferIndex, label) => {
        recorderSink.setLabel(bufferIndex, label);
      });
      const disposeSource = source.run(recorderSink, scheduler);
      const disposeThis = {
        dispose() {
          app.$destroy();
          app.$el.remove();
          recorderSink.end();
        },
      };
      return disposeBoth(disposeSource, disposeThis);
    },
  };
}
