import { parseParameters, validateStream, withAttr } from '@coda/prelude';
import { tap } from '@most/core';

let wsocket;
let connected = false;

function connectWebsocket(host, port) {
  if (!('WebSocket' in window)) throw new Error('Websockets are not supported');
  if (connected) return;
  const address = `ws://${host}:${port}/`;
  // eslint-disable-next-line no-console
  console.log('::TOMAX:: Connecting to', address);
  wsocket = new WebSocket(address);
  wsocket.onopen = () => {
    // eslint-disable-next-line no-console
    console.log('::TOMAX:: CONNECTED to', address);
    connected = true;
  };

  wsocket.onclose = () => {
    // eslint-disable-next-line no-console
    console.log('::TOMAX:: DISCONNECTED from', address);
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
    default: 'data',
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
};

/**
 * Send data to Max
 *
 * @param  {Object}  [options={}]                   Options
 * @param  {String} [options.hostname='localhost'] Hostname (ws server)
 * @param  {String} [options.channel='data']       Channel name
 * @param  {Stream}  source                         Source stream
 * @return {Stream}                                 Unchanged stream
 */
export default function toMax(options = {}, source) {
  const attr = validateStream('toMax', specification, source.attr);
  const { hostname, channel } = parseParameters(definitions, options);
  connectWebsocket(hostname, 8081);
  const f = (e) => {
    let msg;
    if (attr.format === 'scalar') {
      msg = e;
    } else if (attr.format === 'vector') {
      msg = e.reduce((x, y) => `${x} ${y}`, '');
    } else {
      msg = JSON.stringify(e);
    }
    if (connected && wsocket !== undefined) wsocket.send(`${channel} ${msg}`);
  };
  return withAttr(attr)(tap(f, source));
}
