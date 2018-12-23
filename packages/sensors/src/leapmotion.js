import Leap from 'leapjs';
import { currentTime } from '@most/scheduler';
import { sample, periodic } from '@coda/core';
// import { currentTime, periodic as schedulePeriodic } from '@most/scheduler';

let callbackCounter = 0;

/**
 * @ignore
 *
 * Generate a new unique callback id
 * @return {String} callback id
 */
function genId() {
  callbackCounter += 1;
  return `${callbackCounter}`;
}

/**
 * Leap Motion device manager. The manager helps running a single callback function on the
 * Leap Motion API, with multiple data streams that can be added or removed dynamically.
 *
 * @private
 */
class LeapMotionManager {
  constructor() {
    /**
     * Leap Motion Controller (see: https://github.com/leapmotion/leapjs)
     */
    this.controller = new Leap.Controller({
      enableGestures: false,
      background: true,
      optimizeHMD: false,
      frameEventName: 'deviceFrame',
    }).connect()
      .on('frame', this.processFrame.bind(this));
    /**
     * Callback functions
     */
    this.callbacks = {};
  }

  /**
   * Register a new callback function
   * @param {String}   callbackId Callback id (for later deletions)
   * @param {Function} callback   Callback function, that applies to a Leap Motion Frame
   */
  addCallback(callbackId, callback) {
    this.removeCallback(callbackId);
    this.callbacks[callbackId] = callback;
  }

  /**
   * Remove an existing callback function
   * @param {String}   callbackId Callback id
   */
  removeCallback(callbackId) {
    if (Object.keys(this.callbacks).includes(callbackId)) {
      delete this.callbacks[callbackId];
    }
  }

  /**
   * Process a Leap Motion Frame
   * @param  {Leap.Frame} frame Leap Motion Frame
   */
  processFrame(frame) {
    Object.values(this.callbacks).forEach((x) => { x(frame); });
  }
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

/**
 * Helper function to create a data stream by transforming Leap Motion Frame data
 * @private
 * @param  {String}   hand             Hand type ('left' / 'right')
 * @param  {Function} h2x              Transformation function (applies to a frame)
 * @param  {Object}   attr             Stream attributes
 * @param  {Object}   manager          Leap Manager object
 * @param  {Number}   [samplePeriod=0] Sampling period (no resampling if 0)
 * @return {Stream}
 */
function createStream(hand, h2x, attr, manager, samplePeriod = 0) {
  const realAttr = {
    format: 'vector',
    size: 3,
    ...attr,
  };
  if (samplePeriod > 0) {
    realAttr.samplerate = 1000 / samplePeriod;
  }
  const stream = {
    attr: realAttr,
    run(sink, scheduler) {
      const callbackId = genId();
      manager.addCallback(callbackId, (frame) => {
        const thisHand = frame.hands.filter(x => x.type === hand);
        if (thisHand.length <= 0) return;
        tryEvent(currentTime(scheduler), h2x(thisHand[0]), sink);
      });
      return {
        dispose: () => {
          manager.removeCallback(callbackId);
        },
      };
    },
  };
  return (samplePeriod > 0) ? sample(stream, periodic(samplePeriod)) : stream;
}

/**
 * Helper function to create stream of raw Leap Motion Frame data
 * @private
 * @param  {Object}   manager          Leap Manager object
 * @param  {Number}   [samplePeriod=0] Sampling period (no resampling if 0)
 * @return {Stream}
 */
function createRawStream(manager, samplePeriod = 0) {
  const stream = {
    attr: {
      format: 'object',
    },
    run(sink, scheduler) {
      const callbackId = genId();
      manager.addCallback(callbackId, (frame) => {
        tryEvent(currentTime(scheduler), frame, sink);
      });
      return {
        dispose: () => {
          manager.removeCallback(callbackId);
        },
      };
    },
  };
  return (samplePeriod > 0) ? sample(stream, periodic(samplePeriod)) : stream;
}

/**
 * The `leapmotion` source operator listens to the data streamed by the Leap Motion
 * device.<br>
 *
 * The operator returns an object containing a nested set of streams. The object includes
 * a `raw` entry that creates a stream of objects containing all frame data from the Leap Motion
 * middleware, as well as a `hands` entry containing a nested structure of data streams (hand
 * position, velocity, finger attributes, etc). See below for details on the content of this
 * structure.
 *
 * @todo Throw an error when the Leap Motion middleware is not running
 *
 * @warning This operator only works locally. The Leap Motion must be properly configured,
 * and the Leap Motion middleware must be installed and Running.
 *
 * @param  {Object} [options={}]        Options
 * @param  {Number} [options.period=10] Sampling period, if resampling is desired.
 * @return {Object} Leap Motion Data Structure, containing a nested set of streams
 * of the following form:
 * ```
 * {
 *   hands: {
 *     left: {
 *       visible: Stream<Boolean>
 *       confidence: Stream<Number>
 *       direction: Stream<Vector(3)>
 *       grabStrength: Stream<Number>
 *       palmPosition: Stream<Vector(3)>
 *       palmVelocity: Stream<Vector(3)>
 *       palmNormal: Stream<Vector(3)>
 *       pinchStrength: Stream<Number>
 *       sphereCenter: Stream<Vector(3)>
 *       sphereRadius: Stream<Number>
 *       thumb: {
 *         carpPosition: Stream<Vector(3)>
 *         dipPosition: Stream<Vector(3)>
 *         direction: Stream<Vector(3)>
 *         extended: Stream<Boolean>
 *         length: Stream<Number>
 *         mcpPosition: Stream<Vector(3)>
 *         pipPosition: Stream<Vector(3)>
 *         stabilizedTipPosition: Stream<Vector(3)>
 *         tipPosition: Stream<Vector(3)>
 *         tipVelocity: Stream<Vector(3)>
 *         width: Stream<Number>
 *       }
 *       index: <same as other fingers>
 *       middle: <same as other fingers>
 *       pinky: <same as other fingers>
 *       ring: <same as other fingers>
 *     },
 *     right: <same as the left hand >,
 *   }
 *   raw: <Stream of objects with thte raw datat of each frame>
 * }
 * ```
 *
 * @see For more information about the Leap Motion Device, see https://www.leapmotion.com/. For details on the LeapJS API, see https://github.com/leapmotion/leapjs
 *
 * @example
 * // Create a leapmotion listener
 * leap = leapmotion();
 *
 * // Create a stream that tracks when the right hand is visible (see console)
 * rightHere = leap.hands.right.visible.skipRepeats().tap(log);
 *
 * // The following lines compute the distance between the tip of the thumb and the tip of the
 * // index finger
 * rightThumb = leap.hands.right.thumb.tipPosition;
 * rightIndex = leap.hands.right.index.tipPosition;
 * thumb2index = rightThumb.distance(rightIndex).plot({ legend: 'thumb-index distance' });
 */
export default function leapmotion({ period = 0 } = {}) {
  const manager = new LeapMotionManager();
  const createHandDesc = (hand, h2x, attr) => createStream(hand, h2x, attr, manager, period);
  const createFinger = (hand, finger) => ({
    carpPosition: createHandDesc(hand, h => h[finger].carpPosition, { type: 'position' }),
    dipPosition: createHandDesc(hand, h => h[finger].dipPosition, { type: 'position' }),
    direction: createHandDesc(hand, h => h[finger].direction, { type: 'normal' }),
    extended: createHandDesc(hand, h => h[finger].extended, { type: 'boolean' }),
    length: createHandDesc(hand, h => h[finger].length, { type: 'distance' }),
    mcpPosition: createHandDesc(hand, h => h[finger].mcpPosition, { type: 'position' }),
    pipPosition: createHandDesc(hand, h => h[finger].pipPosition, { type: 'position' }),
    stabilizedTipPosition: createHandDesc(hand, h => h[finger].stabilizedTipPosition, { type: 'position' }),
    tipPosition: createHandDesc(hand, h => h[finger].tipPosition, { type: 'position' }),
    tipVelocity: createHandDesc(hand, h => h[finger].tipVelocity, { type: 'velocity' }),
    width: createHandDesc(hand, h => h[finger].width, { format: 'scalar', size: 1 }),
  });
  const createHand = hand => ({
    confidence: createHandDesc(hand, h => h.confidence, { format: 'scalar', size: 1 }),
    direction: createHandDesc(hand, h => h.direction, { type: 'normal' }),
    grabStrength: createHandDesc(hand, h => h.grabStrength, { format: 'scalar', size: 1 }),
    palmPosition: createHandDesc(hand, h => h.palmPosition, { type: 'position' }),
    palmVelocity: createHandDesc(hand, h => h.palmVelocity, { type: 'velocity' }),
    palmNormal: createHandDesc(hand, h => h.palmNormal, { type: 'normal' }),
    pinchStrength: createHandDesc(hand, h => h.pinchStrength, { format: 'scalar', size: 1 }),
    sphereCenter: createHandDesc(hand, h => h.sphereCenter, { type: 'position' }),
    sphereRadius: createHandDesc(hand, h => h.sphereRadius, { format: 'scalar', size: 1 }),
    thumb: createFinger(hand, 'thumb'),
    index: createFinger(hand, 'indexFinger'),
    middle: createFinger(hand, 'middleFinger'),
    pinky: createFinger(hand, 'pinky'),
    ring: createFinger(hand, 'ringFinger'),
    visible: {
      attr: { type: 'boolean', format: 'scalar', size: 1 },
      run(sink, scheduler) {
        const callbackId = genId();
        manager.addCallback(callbackId, (frame) => {
          const thisHand = frame.hands.filter(x => x.type === hand);
          tryEvent(currentTime(scheduler), (thisHand.length > 0), sink);
        });
        return {
          dispose: () => {
            manager.removeCallback(callbackId);
          },
        };
      },
    },
  });
  return {
    hands: {
      left: createHand('left'),
      right: createHand('right'),
    },
    raw: createRawStream(manager, period),
  };
}
