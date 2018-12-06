import MotionInput from '@ircam/motion-input';
import { currentTime } from '@most/scheduler';

/**
 * Device motion data source
 * @private
 */
class DeviceMotionSource {
  /**
   * Constructor
   * @param  {object} device Myo device (from Myo.js)
   * @param  {object} sink   Event Sink
   */
  constructor(sink) {
    /**
     * Event Sink
     * @type {Object}
     */
    this.sink = sink;
    /**
     * Callback for accelerationIncludingGravity datas
     * @type {Function}
     */
    this.accelerationIncludingGravityCallback = () => {};
    /**
     * Callback for acceleration datas
     * @type {Function}
     */
    this.accelerationCallback = () => {};
    /**
     * Callback for orientation datas
     * @type {Function}
     */
    this.orientationCallback = () => {};
  }

  init() {
    MotionInput
      .init([
        'accelerationIncludingGravity',
        'acceleration',
        'orientation',
      ])
      .then(([
        accelerationIncludingGravity,
        acceleration,
        orientation,
      ]) => {
        if (accelerationIncludingGravity.isValid) {
          accelerationIncludingGravity.addListener((val) => {
            this.accelerationIncludingGravityCallback(val);
          });
        }
        if (acceleration.isValid) {
          acceleration.addListener((val) => {
            this.accelerationCallback(val);
          });
        }
        if (orientation.isValid) {
          orientation.addListener((val) => {
            this.orientationCallback(val);
          });
        }
      })
      .catch((err) => {
        console.error(err.stack); // eslint-disable-line no-console
      });
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
 * Create a stream for a particular devicemotion Event
 * @ignore
 *
 * @param  {String}   type               event type
 * @param  {Function} callback           Callback name
 * @param  {Object}   deviceMotionSource deviceMotionSource object
 * @return {Stream}
 */
function createStream(type, callback, deviceMotionSource) {
  const dm = deviceMotionSource;
  return {
    attr: {
      type,
      format: 'vector',
      size: 3,
    },
    run(sink, scheduler) {
      dm.sink = sink;
      dm[callback] = (frame) => {
        tryEvent(currentTime(scheduler), frame, sink);
      };
      return {
        dispose() {
          dm[callback] = () => {};
        },
      };
    },
  };
}

/**
 * Create streams from the DeviceMotion API. Three streams are created:
 * - `accelerationG`: acceleration including gravity
 * - `acceleration`: acceleration without gravity
 * - `orientation`: orientation
 *
 * @todo check why some descriptors do not run sometimes (multiple streams)
 *
 * @warning This operator does not work on all devices (especially, on desktop computers).
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent
 *
 * @return {Object} Devicemotion data structure, including the following streams:
 * - `accelerationG`: acceleration including gravity
 * - `acceleration`: acceleration without gravity
 * - `orientation`: orientation
 *
 * @example
 * dm = devicemotion();
 *
 * s1 = dm.accelerationG
 *   .plot({ legend: 'Acceleration Including Gravity' });
 *
 * s2 = dm.acceleration
 *   .plot({ legend: 'Acceleration' });
 *
 * s3 = dm.orientation
 *   .plot({ legend: 'Orientation' });
 */
export default function devicemotion() {
  const dm = new DeviceMotionSource();
  dm.init();
  return {
    accelerationG: createStream(
      'acceleration',
      'accelerationIncludingGravityCallback',
      dm,
    ),
    acceleration: createStream(
      'acceleration',
      'accelerationCallback',
      dm,
    ),
    orientation: createStream(
      'orientation',
      'orientationCallback',
      dm,
    ),
  };
}
