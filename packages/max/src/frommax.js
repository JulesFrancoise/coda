import { parseParameters } from '@coda/prelude';
import { currentTime } from '@most/scheduler';

let wsocket;
let connected = false;

function connectWebsocket(host, port) {
  if (!('WebSocket' in window)) throw new Error('Websockets are not supported');
  if (connected) return;
  const address = `ws://${host}:${port}/`;
  // eslint-disable-next-line no-console
  console.log('::FROMMAX:: Connecting to', address);
  wsocket = new WebSocket(address);
  wsocket.onopen = () => {
    // eslint-disable-next-line no-console
    console.log(`::FROMMAX:: CONNECTED to ${address}`);
    connected = true;
  };

  wsocket.onclose = () => {
    // eslint-disable-next-line no-console
    console.log(`::FROMMAX:: DISCONNECTED from ${address}`);
    connected = false;
  };

  wsocket.onerror = (e) => {
    // eslint-disable-next-line no-console
    console.log('::TOMAX:: WebSocket error at address', address, '\n', e);
  };
}

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  hostname: {
    type: 'string',
    default: 'localhost',
  },
  channel: {
    type: 'string',
    default: 'mars',
  },
  size: {
    type: 'integer',
    default: 1,
  },
};

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
 * Receive data from Max
 *
 * @param  {Object}  [options={}]                   Options
 * @param  {string} [options.hostname='localhost'] Hostname (ws server)
 * @param  {string} [options.channel='mars']       Channel name
 * @return {Stream}                                 Unchanged stream
 */
export default function fromMax(options = {}) {
  const { hostname, channel, size } = parseParameters(definitions, options);
  connectWebsocket(hostname, 8081);
  return {
    attr: { format: size > 1 ? 'vector' : 'scalar', size },
    run(sink, scheduler) {
      wsocket.onmessage = (ev) => {
        // was it a dict?
        if (ev.data.charAt(0) === '{') {
          console.log('Dicts are not currently supported');
          // attempt to json parse it:
          // const tree = JSON.parse(ev.data);
          // console.log(`parsed ${JSON.stringify(tree)}`);
        } else {
          const [ch, ...data] = ev.data.substr(0, 50).split(' ');
          if (ch === channel) {
            tryEvent(currentTime(scheduler), data.map(parseFloat), sink);
          }
        }
      };
      return {
        dispose: () => {},
      };
    },
  };
}
