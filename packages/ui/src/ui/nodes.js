import Vue from 'vue';
import {
  parseParameters,
  validateStream,
  registerContainer,
  generateContainerId,
} from '@coda/prelude';
import { disposeBoth } from '@most/disposable';
import { currentTime } from '@most/scheduler';
import nodesComponent from './Nodes.vue';
import uiSettings from '../lib/ui';

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

/**
 * Nodes Sink
 * @private
 */
class NodesSink {
  constructor(updateUI, container, params, sink, scheduler) {
    this.updateUI = updateUI;
    /**
     * event sink
     * @type {Object}
     */
    this.sink = sink;

    /**
     * scheduler
     * @type {Object}
     */
    this.scheduler = scheduler;
    /**
     * previous nodes
     * @type {Number}
     */
    this.prev = 0;
    /**
     * refresh period
     * @type {Number}
     */
    this.refresh = params.refresh;
    /**
     * container
     * @type {Object}
     */
    this.container = container;
    /**
     * buffer index
     * @type {Number}
     */
    this.bufferIndex = 0;
    /**
     * recording state
     * @type {boolean}
     */
    this.recording = false;
    /**
     * nodes coordinates: [x, y]
     * @type {Array}
     */
    this.coordnodes = [0, 0];
  }

  record(recording, node) {
    this.coordnodes = node.coords;
    this.recording = recording;
    this.bufferIndex = node.index;
    if (this.recording) {
      this.container.buffers[this.bufferIndex] = {
        label: node.label,
        datain: [], // recorded stream
        dataout: [], // nodes coordinates stream
      };
    }
    this.sink.event(currentTime(this.scheduler), {
      type: 'record',
      value: this.recording,
      bufferIndex: this.bufferIndex,
      coordnodes: this.coordnodes,
    });
  }

  moveNode(node) {
    if (Object.keys(this.container.buffers).includes(node.index.toString())) {
      this.coordnodes = node.coords;
      this.bufferIndex = node.index;
      const n = this.container.buffers[node.index].dataout.length;
      this.container.buffers[node.index].dataout = Array.from(Array(n), () => node.coords);
      this.sink.event(currentTime(this.scheduler), {
        type: 'change',
        bufferIndex: this.bufferIndex,
        coordnodes: this.coordnodes,
      });
    }
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
      this.container.buffers[this.bufferIndex].datain.push(x);
      this.container.buffers[this.bufferIndex].dataout.push(this.coordnodes);
      if (t - this.prev >= this.refresh) {
        this.updateUI(this.container.buffers[this.bufferIndex].data);
        this.prev = t;
      }
    }
  }

  /**
   * Propagate a stream end event
   * @param  {number} t Timestamp
   */
  end(t) {
    return this.sink.end(t);
  }

  /**
   * Propagate a stream error event
   * @param  {number} t Timestamp
   * @param  {Error} e Error
   */
  error(t, e) {
    return this.sink.error(t, e);
  }
}

/**
 * Setup the DOM with for the nodes UI component
 * @ignore
 */
function setupDom() {
  const container = document.getElementById(uiSettings.container);
  const component = document.createElement('div');
  const componentId = `ui${container.children.length}`;
  component.setAttribute('id', componentId);
  component.setAttribute('class', 'nodes');
  container.appendChild(component);
  return component;
}

/**
 * Nodes UI component with nodes interface. Multibuffer. Records to a global buffer.
 *
 * @param  {object} options Nodes options
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
export default function nodes(options, source) {
  const params = parseParameters(definitions, options);
  params.name = params.name || generateContainerId();
  const attr = validateStream('nodes', specification, source.attr);
  attr.containerId = params.name;
  const container = registerContainer(params.name, { ...attr, bimodal: true, sizeOut: 2 });
  const domComponent = setupDom();
  const app = new Vue(nodesComponent);
  app.$data.legend = params.name;
  app.$data.channels = attr.size;
  app.$data.stacked = params.stacked;
  app.$data.fill = params.fill;
  return {
    attr,
    run(sink, scheduler) {
      app.$mount(domComponent);
      const nodesSink = new NodesSink(app.setBufferData, container, params, sink, scheduler);
      app.$on('record', (recording, node) => {
        nodesSink.record(recording, node);
      });
      app.$on('move', (node) => {
        nodesSink.moveNode(node);
      });
      app.$on('remove', (bufferIndex) => {
        nodesSink.remove(bufferIndex);
      });
      app.$on('label', (bufferIndex, label) => {
        nodesSink.setLabel(bufferIndex, label);
      });
      const disposeSource = source.run(nodesSink, scheduler);
      const disposeThis = {
        dispose() {
          app.$destroy();
          app.$el.remove();
          nodesSink.end();
        },
      };
      return disposeBoth(disposeSource, disposeThis);
    },
  };
}
