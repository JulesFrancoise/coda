import { withAttr } from '@coda/prelude';
import { periodic, multicast } from '@most/core';

/**
 * Global Transport Hashtable
 * @type {Object}
 * @ignore
 */
const transports = {};

/**
 * Setup a new named transport, given a BPM value.
 *
 * @param  {String} name      Transport name
 * @param  {Number} [bpm=120] Transport BPM
 * @return {Stream}           Transport event stream (64th)
 */
export function setupTransport(name, bpm = 120) {
  const interval64th = (60000 / 128) / bpm;
  transports[name] = multicast(withAttr({
    samplerate: 1000 / interval64th,
  })(periodic(interval64th)));
  return transports[name];
}

/**
 * Remove an existing transport by name.
 * @param  {String} [name='default'] Transport name
 * @throws Error if the transport does not exist
 */
export function removeTransport(name = 'default') {
  if (!Object.keys(transports).includes(name)) {
    throw new Error(`Transport ${name} does not exist.`);
  }
  delete transports[name];
}

/**
 * Access an existing transport by name
 * @param  {String} name Transport name
 * @return {Stream}      Tranport event stream
 */
export function getTransport(name) {
  if (!Object.keys(transports).includes(name)) {
    throw new Error(`Transport ${name} does not exist.`);
  }
  return transports[name];
}

setupTransport('default');
