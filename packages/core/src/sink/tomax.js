import { tap } from '@most/core';
import parseParameters from '../lib/common/parameters';
import validateStream from '../lib/common/validation';
import withAttr from '../lib/common/mixins';

let wsocket;
let connected = false;
let connectTask;

function connectWebsocket(host, port) {
  if (connected) return;
  if ('WebSocket' in window) {
    console.log('::TOMAX:: Connecting');
    const address = `ws://${host}:${port}/`;
    wsocket = new WebSocket(address);
    wsocket.onopen = () => {
      console.log(`::TOMAX:: CONNECTED to ${address}`);
      connected = true;
      // cancel the auto-reconnect task:
      if (connectTask !== undefined) clearInterval(connectTask);
      // apparently this first reply is necessary
      // var message = 'hello from browser';
      // console.log('SENT: ' + message);
      // wsocket.send(message);

      // send some JSON:
      // wsocket.send(JSON.stringify({ "hello": "world" }));

      // client messages sent with a "*" prefix will have the "*" stripped,
      // but the server will broadcast them all back to all other clients
      // broadcast a hello:
      // send(`*hello ${Math.floor(Math.random() * 100)}`);
    };

    wsocket.onclose = () => {
      console.log(`DISCONNECTED from ${address}`);
      connected = false;
      // set up an auto-reconnect task:
      // connectTask = setInterval(ws_connect, 1000);
    };

    // wsocket.onmessage = (ev) => {
    //   // was it a dict?
    //   if (ev.data.charAt(0) === '{') {
    //     // attempt to json parse it:
    //     const tree = JSON.parse(ev.data);
    //     console.log(`parsed ${JSON.stringify(tree)}`);
    //   } else {
    //     console.log(`received msg:${ev.data.length}: ${ev.data.substr(0, 50)}`);
    //   }
    // };

    wsocket.onerror = () => {
      console.log('WebSocket error');
    };
  } else {
    console.log('WebSockets are not available in this browser!!!');
  }
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
 * Send data to Max using xebra.js
 *
 * To receive data in max, use `mira.channel`
 *
 * @param  {Object}  [options={}]                   Xebra options
 * @param  {Stringn} [options.hostname='localhost'] Hostname (xebra server)
 * @param  {Stringn} [options.channel='mars']       Xebra channel name
 * @param  {Stream}  source                         Source stream
 * @return {Stream}                                 Unchanged stream
 */
export default function tomax(options = {}, source) {
  const attr = validateStream('tomax', specification, source.attr);
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
