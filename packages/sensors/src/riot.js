import { currentTime } from '@most/scheduler';
import { sample, periodic } from '@coda/core';

const callbacks = {};

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
 * @ignore
 */
function createStream(id, channel, size) {
  return {
    attr: {
      format: 'vector',
      size,
      samplerate: 100,
    },
    run(sink, scheduler) {
      callbacks[id][channel] = (m) => {
        if (Object.keys(m).includes(channel)) {
          tryEvent(currentTime(scheduler), m[channel], sink);
        }
      };
      return {
        dispose() {
          delete callbacks[id][channel];
        },
      };
    },
  };
}

/**
 * Stream data from a connected R-IoT.
 *
 * This operator returns a data structure including the following streams:
 * - `acc`: acceleration
 * - `gyro`: gyroscopes (rotation rates)
 * - `quat`: quaternions (orientation)
 * - `euler`: euler angles (orientation)
 * - `magneto`: magnetometers
 *
 * @param {Number} id RIOT Device ID
 * @return {Object} data structure including the following streams:
 * - `acc`: acceleration
 * - `gyro`: gyroscopes (rotation rates)
 * - `quat`: quaternions (orientation)
 * - `euler`: euler angles (orientation)
 * - `magneto`: magnetometers
 *
 * @example
 * sm = riot();
 *
 * s1 = sm.acc
 *   .plot({ legend: 'Acceleration' });
 * s2 = sm.gyro
 *   .plot({ legend: 'Gyroscopes' });
 */
export default function riot(id = 0) {
  if (window.location.hostname !== 'localhost') {
    throw new Error('The `riot` operator is only available locally');
  }
  const host = 'ws://localhost:9090';
  const socket = new WebSocket(host);
  socket.onerror = () => {
    // eslint-disable-next-line no-console
    console.error('[riot] Error: the websocket server is unavailable at', host);
  };
  socket.onclose = () => {
    // eslint-disable-next-line no-console
    console.error('[riot] Error: lost connection with the websocket server');
  };
  socket.onmessage = (json) => {
    const m = JSON.parse(json.data);
    if (m.id !== `${id}`) return;
    Object.values(callbacks[id]).forEach((f) => {
      f(m);
    });
  };
  callbacks[id] = {};
  return {
    acc: sample(createStream(id, 'acc', 3), periodic(10)),
    gyro: sample(createStream(id, 'gyro', 3), periodic(10)),
    magneto: sample(createStream(id, 'magneto', 3), periodic(10)),
    quat: sample(createStream(id, 'quat', 4), periodic(10)),
    euler: sample(createStream(id, 'euler', 3), periodic(10)),
  };
}
