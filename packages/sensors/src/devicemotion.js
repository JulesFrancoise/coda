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
    this.rotationRateCallback = () => {};
  }

  init() {
    MotionInput
      .init([
        'accelerationIncludingGravity',
        'acceleration',
        'rotationRate',
      ])
      .then(([
        accelerationIncludingGravity,
        acceleration,
        rotationRate,
      ]) => {
        if (accelerationIncludingGravity.isProvided && accelerationIncludingGravity.isValid) {
          accelerationIncludingGravity.addListener((val) => {
            this.accelerationIncludingGravityCallback(val);
          });
        }
        if (acceleration.isProvided && acceleration.isValid) {
          acceleration.addListener((val) => {
            this.accelerationCallback(val);
          });
        }
        if (rotationRate.isProvided && rotationRate.isValid) {
          rotationRate.addListener((val) => {
            this.rotationRateCallback(val);
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
 * - `acc`: acceleration without gravity
 * - `accG`: acceleration including gravity
 * - `gyro`: gyroscopes (rotation rates)
 *
 * @todo check why some descriptors do not run sometimes (multiple streams)
 *
 * @warning This operator does not work on all devices (especially, on desktop computers).
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent
 *
 * @return {Object} Devicemotion data structure, including the following streams:
 * - `acc`: acceleration without gravity
 * - `accG`: acceleration including gravity
 * - `gyro`: gyroscopes (rotation rates)
 *
 * @example
 * dm = devicemotion();
 *
 * s1 = dm.accG
 *   .plot({ legend: 'Acceleration Including Gravity' });
 *
 * s2 = dm.acc
 *   .plot({ legend: 'Acceleration' });
 *
 * s3 = dm.gyro
 *   .plot({ legend: 'Rotation Rates' });
 */
export default function devicemotion() {
  const dm = new DeviceMotionSource();
  dm.init();
  return {
    accG: createStream(
      'acceleration',
      'accelerationIncludingGravityCallback',
      dm,
    ),
    acc: createStream(
      'acceleration',
      'accelerationCallback',
      dm,
    ),
    gyro: createStream(
      'rotationRate',
      'rotationRateCallback',
      dm,
    ),
  };
}
