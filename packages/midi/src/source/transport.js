import { filter } from '@most/core';
import { getTransport } from '../lib/transport';

/**
 * Parse the midi interval to a number of beats (64th) to skip
 * @ignore
 *
 * @param  {String} interval Interval (midi notation: 4n, 4m, 1n, ...)
 * @return {Number}          Number of beats to skip
 */
function parseInterval(interval) {
  const symbol = interval.slice(-1);
  if (!['n', 'm'].includes(symbol)) {
    throw new Error(`Invalid interval expression ${interval}`);
  }
  const num = parseInt(interval.slice(0, -1), 10);
  const numSkip = (symbol === 'm') ?
    (128 * num) - 1 :
    (128 / num) - 1;
  return numSkip;
}

/**
 * Generate periodic events driven by a global transport.
 *
 * @todo details on transport mechanisms (bpm, interval format)
 *
 * @param  {String} interval         Interval (ex: 1n, 4n, 4m, ...)
 * @param  {String} [name='default'] Transport name
 * @return {Stream}                  Transport event stream
 *
 * @see {@link setupTransport}
 * @see {@link removeTransport}
 * @see {@link getTransport}
 */
export default function transport(interval, name = 'default') {
  const eventsToSkip = parseInterval(interval);
  const tp = getTransport(name);
  let eventIndex = 0;
  return filter(() => {
    const q = eventIndex % eventsToSkip === 0;
    eventIndex = (eventIndex + 1) % eventsToSkip;
    return q;
  }, tp);
}
