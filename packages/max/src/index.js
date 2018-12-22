/* esdoc-ignore */
import { Stream } from '@coda/prelude';
import fromMax_ from './frommax';
import toMax_ from './tomax';
import setup from './setup';

export const fromMax = options => new Stream(fromMax_(options));

export const toMax = (options, stream) => new Stream(toMax_(options, stream));

export default setup;
