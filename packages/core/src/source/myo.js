import Myo from 'myo';
import { currentTime, periodic as schedulePeriodic } from '@most/scheduler';

/**
 * Myo data source base class
 * @private
 */
class MyoDataSource {
  /**
   * Constructor
   * @param  {object} device Myo device (from Myo.js)
   * @param  {object} sink   Event Sink
   */
  constructor(device, sink) {
    /**
     * Myo device (from Myo.js)
     * @type {Object}
     */
    this.device = device;
    /**
     * Event Sink
     * @type {Object}
     */
    this.sink = sink;
    /**
     * Specifies if the sink is active
     * @type {Boolean}
     */
    this.active = true;
  }

  /**
   * Dispose the sink
   */
  dispose() {
    this.device.off(this.callbackId);
    this.active = false;
  }

  /**
   * Propagate an error on the stream
   * @param  {Number} t event timestamp
   * @param  {Error} e error message
   */
  error(t, e) {
    this.sink.error(t, e);
  }
}

/**
 * Myo EMG data source. Polls EMG Data from the Myo at 200 Hz with some smart
 * resampling (the framerate from Myo connect is quite variable).
 * @private
 */
class MyoEmgSource extends MyoDataSource {
  /**
   * Constructor
   * @param  {Object} device    Myo device (from Myo.js)
   * @param  {Object} sink      Event Sink
   * @param  {Object} scheduler most Scheduler
   */
  constructor(device, sink, scheduler) {
    super(device, sink);
    /**
     * Current buffer of EMG data frames
     * @type {Array}
     */
    this.frames = [Array(8).fill(0)];
    /**
     * Time of the previous packet
     * @type {Number}
     */
    this.prevtime = 0;
    /**
     * ID of the EMG data callback (myo.js)
     * @type {Number}
     */
    this.callbackId = this.device.on('emg', (data) => {
      const t = currentTime(scheduler);
      if (t - this.prevtime > 20) {
        this.frames = [data.map(x => x / 127)];
      } else {
        this.frames.push(data.map(x => x / 127));
      }
      this.prevtime = t;
    });
  }

  /**
   * Run the sink
   * @param  {Number} t Timestamp
   */
  run(t) {
    if (!this.active) return;
    if (this.frames.length > 1) {
      const x = this.frames.shift();
      this.sink.event(t, x);
    } else {
      this.sink.event(t, this.frames[0]);
    }
  }
}

/**
 * Myo Accelerometer data source. Polls Acclerometer Data as soon as it is
 * available from the Myo middleware.
 * @private
 */
class MyoAccSource extends MyoDataSource {
  /**
   * Constructor
   * @param  {Object} device    Myo device (from Myo.js)
   * @param  {Object} sink      Event Sink
   */
  constructor(device, sink) {
    super(device, sink);
    /**
     * Current accelerometer data frame
     * @type {Array}
     */
    this.frame = Array(3).fill(0);
    /**
     * ID of the acc data callback (myo.js)
     * @type {Number}
     */
    this.callbackId = this.device.on('accelerometer', (data) => {
      this.frame = [data.x, data.y, data.z];
    });
  }

  /**
   * Run the sink
   * @param  {Number} t Timestamp
   */
  run(t) {
    if (!this.active) return;
    this.sink.event(t, this.frame);
  }
}

/**
 * Myo gyroscope data source. Polls gyroscope Data as soon as it is
 * available from the Myo middleware.
 * @private
 */
class MyoGyroSource extends MyoDataSource {
  /**
   * Constructor
   * @param  {Object} device    Myo device (from Myo.js)
   * @param  {Object} sink      Event Sink
   */
  constructor(device, sink) {
    super(device, sink);
    /**
     * Current gyroscope data frame
     * @type {Array}
     */
    this.frame = Array(3).fill(0);
    /**
     * ID of the gyro data callback (myo.js)
     * @type {Number}
     */
    this.callbackId = this.device.on('gyroscope', (data) => {
      this.frame = [data.x, data.y, data.z];
    });
  }

  /**
   * Run the sink
   * @param  {Number} t Timestamp
   */
  run(t) {
    if (!this.active) return;
    this.sink.event(t, this.frame);
  }
}

/**
 * Myo orientation data source. Polls quanternions Data as soon as it is
 * available from the Myo middleware.
 * @private
 */
class MyoQuatSource extends MyoDataSource {
  /**
   * Constructor
   * @param  {Object} device    Myo device (from Myo.js)
   * @param  {Object} sink      Event Sink
   */
  constructor(device, sink) {
    super(device, sink);
    /**
     * Current quaternions data frame
     * @type {Array}
     */
    this.frame = Array(4).fill(0);
    /**
     * ID of the quaternions data callback (myo.js)
     * @type {Number}
     */
    this.callbackId = this.device.on('orientation', (data) => {
      this.frame = [data.w, data.x, data.y, data.z];
    });
  }

  /**
   * Run the sink
   * @param  {Number} t Timestamp
   */
  run(t) {
    if (!this.active) return;
    this.sink.event(t, this.frame);
  }
}

try {
  Myo.connect('com.coda.myolala');
} catch (e) {
  // eslint-disable-next-line no-console
  console.log('Unable to activate myo (use only locally)');
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
 * The myo module listens to the data emitted by the Myo armband. Rather than
 * returning a complex stream with all datatypes, the myo factory function
 * return an object containing the following streams:
 * - `emg`: EMG Data (vector, 8 channels)
 * - `acc`: accelerometer data (vector, 3D)
 * - `gyro`: gyroscope data (vector, 3D)
 * - `quat`: orientation data as quaternions (vector, 4D)
 * - `pose/pose_off`: beginning and end of the gestures recognized by the factory
 * myo classification (string)
 *
 * @param  {String} [name=''] Name of the armband
 * @return {Object}           An object containing a set of streams, of the
 * form:
 * ```
 * {
 *   emg: Stream<format='vector', size=8>
 *   acc: Stream<format='vector', size=3>
 *   gyro: Stream<format='vector', size=3>
 *   quat: Stream<format='vector', size=4>
 *   pose/pose_off: Stream<format='string'>
 * }
 * ```
 *
 * @todo Make an example and add credits
 *
 * @see {@link https://github.com/thalmiclabs/myo.js}
 */
export default function myo(name = '') {
  const deviceList = Myo.myos.map(x => x.name);
  const deviceName = name || (deviceList && deviceList[0]);
  const device = Myo.myos[deviceList.indexOf(deviceName)];
  if (!device) {
    throw new Error(`The myo named ${deviceName} is not connected.`);
  }
  device.streamEMG(true);
  device.unlock(true);
  device.vibrate();
  Myo.on('connected', ({ x }) => {
    console.log(`Myo ${x} is connected!`); // eslint-disable-line no-console
  });
  return {
    emg: {
      attr: {
        type: 'emg',
        format: 'vector',
        size: 8,
        samplerate: 200,
      },
      run(sink, scheduler) {
        return schedulePeriodic(
          5,
          new MyoEmgSource(device, sink, scheduler),
          scheduler,
        );
      },
    },
    acc: {
      attr: {
        type: 'accelerometer',
        format: 'vector',
        size: 3,
        samplerate: 50,
      },
      run(sink, scheduler) {
        return schedulePeriodic(
          20,
          new MyoAccSource(device, sink),
          scheduler,
        );
      },
    },
    gyro: {
      attr: {
        type: 'gyroscope',
        format: 'vector',
        size: 3,
        samplerate: 50,
      },
      run(sink, scheduler) {
        return schedulePeriodic(
          20,
          new MyoGyroSource(device, sink),
          scheduler,
        );
      },
    },
    quat: {
      attr: {
        type: 'quaternions',
        format: 'vector',
        size: 4,
        samplerate: 50,
      },
      run(sink, scheduler) {
        return schedulePeriodic(
          20,
          new MyoQuatSource(device, sink),
          scheduler,
        );
      },
    },
    pose: {
      attr: {
        type: 'label',
        format: 'string',
      },
      run(sink, scheduler) {
        const callbackId = device.on('pose', (poseName) => {
          tryEvent(currentTime(scheduler), poseName, sink);
        });
        return {
          dispose: () => {
            device.off(callbackId);
          },
        };
      },
    },
    pose_off: {
      attr: {
        type: 'label',
        format: 'string',
      },
      run(sink, scheduler) {
        const callbackId = device.on('pose_off', (poseName) => {
          tryEvent(currentTime(scheduler), poseName, sink);
        });
        return {
          dispose: () => {
            device.off(callbackId);
          },
        };
      },
    },
  };
}
