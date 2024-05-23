import Vue from 'vue';
import { parseParameters } from '@coda/prelude';
import { currentTime } from '@most/scheduler';
import posenetComponent from './Posenet.vue';
import uiSettings from '../lib/ui';

const parts = [
  'nose',
  'leftEye',
  'rightEye',
  'leftEar',
  'rightEar',
  'leftShoulder',
  'rightShoulder',
  'leftElbow',
  'rightElbow',
  'leftWrist',
  'rightWrist',
  'leftHip',
  'rightHip',
  'leftKnee',
  'rightKnee',
  'leftAnkle',
  'rightAnkle',
];

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  reference: {
    type: 'string',
    default: 'none',
    list: ['none'].concat(parts),
  },
};

/**
 * Setup the DOM with for the recorder UI component
 * @ignore
 */
function setupDom() {
  const container = document.getElementById(uiSettings.container);
  const component = document.createElement('div');
  const componentId = `ui${container.children.length}`;
  component.setAttribute('id', componentId);
  component.setAttribute('class', 'posenet');
  container.appendChild(component);
  return component;
}

/**
 * Try to propagate an event or propagate an error to the stream
 * @ignore
 */
function tryEvent(t, x, sink) {
  try {
    sink.event(t, x);
  } catch (e) {
    sink.error(t, e);
  }
}

// export default function posenet(options) {
//   const params = parseParameters(definitions, options);
//   const attr = {
//     format: 'vector',
//     size: params.parts.length * 2,
//     samplerate: 100,
//   };
//   const domComponent = setupDom();
//   const app = new Vue(posenetComponent);
//   return {
//     attr,
//     run(sink, scheduler) {
//       app.$mount(domComponent);
//       app.$on('keypoints', (keypoints) => {
//         const frame = keypoints.filter(p => params.parts.includes(p.part))
//           .map(p => [p.position.x / 400, p.position.y / 300])
//           .reduce((x, y) => x.concat(y), []);
//         tryEvent(currentTime(scheduler), frame, sink);
//       });
//       return {
//         dispose() {
//           app.$destroy();
//           app.$el.remove();
//         },
//       };
//     },
//   };
// }

class PosenetManager {
  constructor(refPart) {
    this.callbacks = {};
    this.numCallbacks = 0;
    this.refPart = refPart;
    this.keypoints = parts.reduce((a, b) => ({ ...a, [b]: { x: 0, y: 0 } }), {});
    this.xRef = 0;
    this.yRef = 0;
  }

  /**
   * Register a new callback function
   * @param {String}   callbackId Callback id (for later deletions)
   * @param {Function} callback   Callback function, that applies to a Leap Motion Frame
   */
  addCallback(callbackId, callback) {
    this.removeCallback(callbackId);
    this.callbacks[callbackId] = callback;
    this.numCallbacks += 1;
  }

  /**
   * Remove an existing callback function
   * @param {String}   callbackId Callback id
   */
  removeCallback(callbackId) {
    if (Object.keys(this.callbacks).includes(callbackId)) {
      delete this.callbacks[callbackId];
      this.numCallbacks -= 1;
    }
  }

  /**
   * Process a Leap Motion Frame
   * @param  {Leap.Frame} frame Leap Motion Frame
   */
  processFrame(frame) {
    frame.forEach(({ part, position }) => {
      if (part === this.refPart) {
        this.xRef = position.x / 400;
        this.yRef = 1 - (position.y / 300);
      }
      this.keypoints[part] = {
        x: position.x / 400,
        y: 1 - (position.y / 300),
      };
    });
    Object.values(this.callbacks).forEach((x) => { x(this.keypoints); });
  }
}

let callbackCounter = 0;
function genId() {
  callbackCounter += 1;
  return `${callbackCounter}`;
}

export default function posenet(options) {
  const params = parseParameters(definitions, options);
  const attr = {
    format: 'vector',
    size: 2,
    // samplerate: 100,
  };
  const domComponent = setupDom();
  const app = new Vue(posenetComponent);
  // let mounted = false;
  const manager = new PosenetManager(params.reference);
  app.$mount(domComponent);
  app.$on('keypoints', (keypoints) => {
    manager.processFrame(keypoints);
  });
  function createStream(part) {
    return {
      attr,
      run(sink, scheduler) {
        // if (!mounted) {
        //   app.$mount(domComponent);
        //   app.$on('keypoints', (keypoints) => {
        //     manager.processFrame(keypoints);
        //   });
        //   mounted = true;
        // }
        const callbackId = genId();
        manager.addCallback(callbackId, (keypoints) => {
          let { x, y } = keypoints[part];
          if (params.reference !== 'none') {
            x -= manager.xRef;
            y -= manager.yRef;
          }
          tryEvent(currentTime(scheduler), [x, y], sink);
        });
        return {
          dispose() {
            // app.$destroy();
            // app.$el.remove();
          },
        };
      },
    };
  }
  return parts.reduce((a, b) => ({ ...a, [b]: createStream(b) }), {});
}
