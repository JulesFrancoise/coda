/* esdoc-ignore */
import { Stream } from '@coda/prelude';
import ftom_ from './operator/ftom';
import mtof_ from './operator/mtof';
import quantize_ from './operator/quantize';
import transport_ from './source/transport';

import setup from './setup';

export const ftom = stream =>
  new Stream(ftom_(stream));

export const mtof = stream =>
  new Stream(mtof_(stream));

export const quantize = (options, stream) =>
  new Stream(quantize_(options, stream));

export const transport = name =>
  new Stream(transport_(name));

export default setup;
