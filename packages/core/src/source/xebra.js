import { currentTime } from '@most/scheduler';
import validateStream from '../lib/common/validation';

/**
 * @ignore
 */
const Xebra = require('xebra.js');

/**
 * Hosts the Xebra state instance for the various hosts (avoids creating new
 * xebraState instances for every module).
 * @ignore
 */
const xebraStates = {};

/**
 * Stream I/O Attributes Specification
 * @ignore
 */
const specification = channel => ({
  format: {
    transform: () => ((channel === '*') ? 'object' : 'any'),
  },
});

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
 * Receive data from Cycling'74 Max using
 * [Xebra](https://github.com/Cycling74/Xebra.js). This module requires that
 * a Max instance is running a patcher including a `mira.channel` external.
 * `mira.channel` creates a websocket server that allows for streaming data to
 * several clients
 * @param  {String} [channel='*']          Channels to listen to. if '*', the
 * module outputs a stream stream of object with channels as keys. If a channel
 * is specified, the module outputs a stream of values received to the
 * corresponding channel.
 * @param  {String} [hostname='localhost'] IP address of the host computer
 * (only works on a local network).
 * @return {Stream}                        Data stream received from Max
 *
 * @example
 * import * from 'mars';
 *
 * const process = xebra().tap(log);
 * runEffects(process, newDefaultScheduler());
 */
export default function xebra(channel = '*', hostname = 'localhost') {
  const attr = validateStream('xebra', specification(channel), {});
  if (!Object.keys(xebraStates).includes(hostname)) {
    xebraStates[hostname] = new Xebra.State({
      hostname,
      port: 8086,
    });
  }
  const xebraState = xebraStates[hostname];
  return {
    attr,
    run(sink, scheduler) {
      xebraState.on('channel_message_received', (chan, msg) => {
        if (channel === '*') {
          tryEvent(currentTime(scheduler), { [chan]: msg }, sink);
        } else if (chan === channel) {
          tryEvent(currentTime(scheduler), msg, sink);
        }
      });
      return {
        dispose: () => {},
      };
    },
  };
}
