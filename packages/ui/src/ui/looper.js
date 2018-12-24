import Vue from 'vue';
import { parseParameters, validateStream } from '@coda/prelude';
import { disposeBoth } from '@most/disposable';
import looperComponent from './Looper.vue';
import uiSettings from '../lib/ui';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
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
 * Looper Sink Class: records data and calls the UI update function at reduced
 * frame rate.
 * @private
 */
class LooperSink {
  /**
   * Looper Sink Constructor
   *
   * @ignore
   *
   * @param  {Function} updateUI Update UI Function (bound to a vue instance)
   * @param  {object} params     Looper parameters
   * @param  {object} sink       Sink
   */
  constructor(updateUI, params, sink) {
    this.updateUI = updateUI;
    this.sink = sink;
    this.prev = 0;
    this.refresh = params.refresh;
    this.buffer = [];
    this.recording = false;
    this.playing = false;
    this.playbackIndex = 0;
    this.update = true;
  }

  /**
   * Toggle recording mode
   * @param  {boolean} recording
   */
  record(recording) {
    this.recording = recording;
    if (this.recording) {
      this.buffer = [];
    }
  }

  /**
   * Toggle playing mode
   * @param  {boolean} playing
   */
  play(playing) {
    this.playing = playing;
    if (this.playing) {
      this.playbackIndex = 0;
    }
  }

  /**
   * Stop updating the UI when the component is closed
   */
  stop() {
    this.update = false;
  }

  /**
   * Process and propagate an event
   * @param  {number} t Event timestamp
   * @param  {number|Array} x Event value
   */
  event(t, x) {
    if (this.update) {
      if (this.playing) {
        this.sink.event(t, this.buffer[this.playbackIndex]);
        this.playbackIndex = (this.playbackIndex + 1) % this.buffer.length;
        return;
      }
      if (this.recording) {
        this.buffer.push(x);
        if (t - this.prev >= this.refresh) {
          this.updateUI(this.buffer);
          this.prev = t;
        }
      }
    }
    this.sink.event(t, x);
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
 * Data Looper UI component. This module allows to record a buffer of Stream
 * data that can be looped.
 *
 * @param  {object} options Looper UI options
 * @param  {number} [options.refresh=50] Refresh rate (ms)
 * @param  {boolean} [options.stacked=false] Specifies if curves should be
 * stacked (by default, curves are superposed)
 * @param  {string} [options.fill='none'] Plain fill options:
 * - 'none': no plain filling (defaut)
 * - 'bottom': fill from bottom
 * - 'middle': fill from middle
 * - 'top': fill to top
 * @param  {Stream} source  Input Stream (scalar or vector)
 * @return {Stream}         Output Stream: either unchanged input stream (in
 * 'thru' or 'recording' modes), or loop of the recorded buffer (in playing
 * mode)
 *
 * @example
 * data = periodic(10).rand().mvavrg({ size: 30 }).plot();
 * l = data.looper().plot();
 */
export default function looper(options, source) {
  const params = parseParameters(definitions, options);
  const attr = validateStream('looper', specification, source.attr);
  const container = document.getElementById(uiSettings.container);
  const component = document.createElement('div');
  const componentId = `ui${container.children.length}`;
  component.setAttribute('id', componentId);
  component.setAttribute('class', 'recorder');
  container.appendChild(component);
  const app = new Vue(looperComponent);
  app.$data.channels = attr.size;
  app.$data.stacked = params.stacked;
  app.$data.fill = params.fill;
  return {
    attr,
    run(sink, scheduler) {
      app.$mount(component);
      const plotSink = new LooperSink(app.setBufferData, params, sink);
      app.$on('record', (recording) => {
        plotSink.record(recording);
      });
      app.$on('play', (recording) => {
        plotSink.play(recording);
      });
      app.$on('close', () => {
        plotSink.stop();
      });
      const disposeSource = source.run(plotSink, scheduler);
      const disposeThis = {
        dispose() {
          app.$destroy();
          app.$el.remove();
          plotSink.end();
        },
      };
      return disposeBoth(disposeSource, disposeThis);
    },
  };
}
