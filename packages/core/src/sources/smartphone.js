import { currentTime } from '@most/scheduler';

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
function createStream(channel) {
  return {
    attr: {
      format: 'vector',
      size: 3,
    },
    run(sink, scheduler) {
      callbacks[channel] = (m) => {
        if (Object.keys(m).includes(channel)) {
          tryEvent(currentTime(scheduler), m[channel], sink);
        }
      };
      return {
        dispose() {
          delete callbacks[channel];
        },
      };
    },
  };
}

/**
 * Stream data from a connected smartphone. To connect a new smartphone, go to:
 * - <a href="https://animacoda.netlify.com/device" target="_blank">https://animacoda.netlify.com/device</a> if using the online version
 * - <a href="http://localhost:8080/device" target="_blank">http://localhost:8080/device</a> if running the playground on your machine
 *
 * This object is similar to the `devicemotion` operator, it returns a Devicemotion data
 * structure, including the following streams:
 * - `acc`: acceleration without gravity
 * - `accG`: acceleration including gravity
 * - `gyro`: gyroscopes (rotation rates)
 *
 * @param  {String} name Device name
 * @return {Object}      Devicemotion data structure, including the following streams:
 * - `acc`: acceleration without gravity
 * - `accG`: acceleration including gravity
 * - `gyro`: gyroscopes (rotation rates)
 *
 * @example
 * sm = smartphone('test'); // connect your smartphone with the id 'test'
 *
 * s1 = sm.accG
 *   .plot({ legend: 'Acceleration Including Gravity' });
 *
 * s2 = sm.acc
 *   .plot({ legend: 'Acceleration' });
 *
 * s3 = sm.gyro
 *   .plot({ legend: 'Rotation Rates' });
 */
export default function smartphone(name) {
  if (typeof name !== 'string' || !name) {
    throw Error('Invalid device name');
  }
  const host = (window.location.hostname === 'localhost')
    ? `ws://${window.location.hostname}:9090`
    : 'wss://codaws.glitch.me/';
  const socket = new WebSocket(host);
  socket.onopen = () => {
    socket.send(JSON.stringify({ type: 'operator' }));
  };
  socket.onerror = () => {
    // eslint-disable-next-line no-console
    console.error('[smartphone] Error: the websocket server is unavailable at', host);
  };
  socket.onclose = () => {
    // eslint-disable-next-line no-console
    console.error('[smartphone] Error: lost connection with the websocket server');
  };
  socket.onmessage = (json) => {
    const m = JSON.parse(json.data);
    if (m.id !== name) return;
    Object.values(callbacks).forEach((f) => {
      f(m);
    });
  };
  return {
    acc: createStream('acceleration'),
    accG: createStream('accelerationIncludingGravity'),
    gyro: createStream('rotationRate'),
  };
}
