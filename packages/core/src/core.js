import { Stream } from '@coda/prelude';
import * as elementwise_ from './operator/basic/elementwise';
import * as meanstd_ from './operator/basic/meanstd';
import pak_ from './operator/basic/pak';
import pack_ from './operator/basic/pack';
import schmitt_ from './operator/basic/schmitt';
import select_ from './operator/basic/select';
import slide_ from './operator/basic/slide';
import * as reduce_ from './operator/basic/reduce';
import unpack_ from './operator/basic/unpack';
import biquad_ from './operator/filter/biquad';
import force_ from './operator/filter/force';
import mvavrg_ from './operator/filter/mvavrg';
import accum_ from './operator/mapping/accum';
import atodb_ from './operator/mapping/atodb';
import clip_ from './operator/mapping/clip';
import cycle_ from './operator/mapping/cycle';
import delta_ from './operator/mapping/delta';
import dbtoa_ from './operator/mapping/dbtoa';
import rand_ from './operator/mapping/rand';
import scale_ from './operator/mapping/scale';
import autoscale_ from './operator/mapping/autoscale';
import kicks_ from './operator/spectral/kicks';
import wavelet_ from './operator/spectral/wavelet';
import adaptive_ from './operator/mapping/adaptive';
import distance_ from './operator/basic/distance';
import devicemotion_ from './sources/devicemotion';
import smartphone_ from './sources/smartphone';

/** @ignore */
export const accum = stream =>
  new Stream(accum_(stream));

/** @ignore */
export const add = (first, second) =>
  new Stream(elementwise_.add(first, second));

/** @ignore */
export const atodb = stream =>
  new Stream(atodb_(stream));

/** @ignore */
export const biquad = (options, stream) =>
  new Stream(biquad_(options, stream));

/** @ignore */
export const clip = (options, stream) =>
  new Stream(clip_(options, stream));

/** @ignore */
export const cycle = (buffer, stream) =>
  new Stream(cycle_(buffer, stream));

/** @ignore */
export const delta = (options, stream) =>
  new Stream(delta_(options, stream));

/** @ignore */
export const div = (first, second) =>
  new Stream(elementwise_.div(first, second));

/** @ignore */
export const dbtoa = stream =>
  new Stream(dbtoa_(stream));

/** @ignore */
export const elementwise = (f, first, second) =>
  new Stream(elementwise_.default(f, first, second));

/** @ignore */
export const force = (options, stream) =>
  new Stream(force_(options, stream));

/** @ignore */
export const kicks = (options, stream) =>
  new Stream(kicks_(options, stream));

/** @ignore */
export const max = stream =>
  new Stream(reduce_.max(stream));

/** @ignore */
export const mean = stream =>
  new Stream(meanstd_.mean(stream));

/** @ignore */
export const meanstd = stream =>
  new Stream(meanstd_.meanstd(stream));

/** @ignore */
export const min = stream =>
  new Stream(reduce_.min(stream));

/** @ignore */
export const minmax = stream =>
  new Stream(reduce_.minmax(stream));

/** @ignore */
export const mul = (first, second) =>
  new Stream(elementwise_.mul(first, second));

/** @ignore */
export const mvavrg = (options, stream) =>
  new Stream(mvavrg_(options, stream));

/** @ignore */
export const norm = stream =>
  new Stream(reduce_.norm(stream));

/** @ignore */
export const prod = stream =>
  new Stream(reduce_.prod(stream));

/** @ignore */
export const rand = (options, stream) =>
  new Stream(rand_(options, stream));

/** @ignore */
export const reduce = (reducer, initial, stream) =>
  new Stream(reduce_.default(reducer, initial, stream));

/** @ignore */
export const scale = (options, stream) =>
  new Stream(scale_(options, stream));

/** @ignore */
export const autoscale = stream =>
  new Stream(autoscale_(stream));

/** @ignore */
export const schmitt = (options, stream) =>
  new Stream(schmitt_(options, stream));

/** @ignore */
export const select = (indices, stream) =>
  new Stream(select_(indices, stream));

/** @ignore */
export const slide = (options, stream) =>
  new Stream(slide_(options, stream));

/** @ignore */
export const std = stream =>
  new Stream(meanstd_.std(stream));

/** @ignore */
export const sub = (first, second) =>
  new Stream(elementwise_.sub(first, second));

/** @ignore */
export const sum = stream =>
  new Stream(reduce_.sum(stream));

/** @ignore */
export const unpack = stream =>
  unpack_(stream).map(s => new Stream(s));

/** @ignore */
export const pak = streams =>
  new Stream(pak_(streams));

/** @ignore */
export const pack = streams =>
  new Stream(pack_(streams));

/** @ignore */
export const wavelet = (options, stream) =>
  new Stream(wavelet_(options, stream));

/** @ignore */
export const adaptive = (options, stream) =>
  new Stream(adaptive_(options, stream));

/** @ignore */
export const distance = (first, second) =>
  new Stream(distance_(first, second));

/** @ignore */
export const devicemotion = () => {
  const dm = devicemotion_();
  return {
    accG: new Stream(dm.accG),
    acc: new Stream(dm.acc),
    gyro: new Stream(dm.gyro),
  };
};

/** @ignore */
export const smartphone = (name) => {
  const sm = smartphone_(name);
  return {
    acc: new Stream(sm.acc),
    accG: new Stream(sm.accG),
    gyro: new Stream(sm.gyro),
  };
};
