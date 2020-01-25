import { Stream } from '@coda/prelude';
import * as elementwise_ from './operator/elementwise';
import * as meanstd_ from './operator/meanstd';
import pak_ from './operator/pak';
import pack_ from './operator/pack';
import schmitt_ from './operator/schmitt';
import select_ from './operator/select';
import slide_ from './operator/slide';
import * as reduce_ from './operator/reduce';
import unpack_ from './operator/unpack';
import biquad_ from './operator/biquad';
import force_ from './operator/force';
import mvavrg_ from './operator/mvavrg';
import accum_ from './operator/accum';
import clip_ from './operator/clip';
import cycle_ from './operator/cycle';
import delta_ from './operator/delta';
import rand_ from './operator/rand';
import scale_ from './operator/scale';
import autoscale_ from './operator/autoscale';
import kicks_ from './operator/kicks';
import kick_ from './operator/kick';
import wavelet_ from './operator/wavelet';
import adaptive_ from './operator/adaptive';
import distance_ from './operator/distance';
import intensity_ from './operator/intensity';
import line_ from './operator/line';
import lineto_ from './operator/lineto';
import adsr_ from './operator/adsr';

export const accum = stream => (
  new Stream(accum_(stream))
);

export const add = (first, second) => (
  new Stream(elementwise_.add(first, second))
);

export const biquad = (options, stream) => (
  new Stream(biquad_(options, stream))
);

export const clip = (options, stream) => (
  new Stream(clip_(options, stream))
);

export const cycle = (buffer, stream) => (
  new Stream(cycle_(buffer, stream))
);

export const delta = (options, stream) => (
  new Stream(delta_(options, stream))
);

export const div = (first, second) => (
  new Stream(elementwise_.div(first, second))
);

export const elementwise = (f, first, second) => (
  new Stream(elementwise_.default(f, first, second))
);

export const force = (options, stream) => (
  new Stream(force_(options, stream))
);

export const kicks = (options, stream) => (
  new Stream(kicks_(options, stream))
);

export const kick = (options, stream) => (
  new Stream(kick_(options, stream))
);

export const max = stream => (
  new Stream(reduce_.max(stream))
);

export const mean = stream => (
  new Stream(meanstd_.mean(stream))
);

export const meanstd = stream => (
  new Stream(meanstd_.meanstd(stream))
);

export const min = stream => (
  new Stream(reduce_.min(stream))
);

export const minmax = stream => (
  new Stream(reduce_.minmax(stream))
);

export const mul = (first, second) => (
  new Stream(elementwise_.mul(first, second))
);

export const mvavrg = (options, stream) => (
  new Stream(mvavrg_(options, stream))
);

export const norm = stream => (
  new Stream(reduce_.norm(stream))
);

export const prod = stream => (
  new Stream(reduce_.prod(stream))
);

export const rand = (options, stream) => (
  new Stream(rand_(options, stream))
);

export const reduce = (reducer, initial, stream) => (
  new Stream(reduce_.default(reducer, initial, stream))
);

export const scale = (options, stream) => (
  new Stream(scale_(options, stream))
);

export const autoscale = stream => (
  new Stream(autoscale_(stream))
);

export const schmitt = (options, stream) => (
  new Stream(schmitt_(options, stream))
);

export const select = (indices, stream) => (
  new Stream(select_(indices, stream))
);

export const slide = (options, stream) => (
  new Stream(slide_(options, stream))
);

export const std = stream => (
  new Stream(meanstd_.std(stream))
);

export const sub = (first, second) => (
  new Stream(elementwise_.sub(first, second))
);

export const sum = stream => (
  new Stream(reduce_.sum(stream))
);

export const unpack = stream => (
  unpack_(stream).map(s => new Stream(s))
);

export const pak = streams => (
  new Stream(pak_(streams))
);

export const pack = streams => (
  new Stream(pack_(streams))
);

export const concat = streams => (
  new Stream(pack_(streams.reduce((a, x) => a.concat(unpack(x)), [])))
);

export const wavelet = (options, stream) => (
  new Stream(wavelet_(options, stream))
);

export const adaptive = (options, stream) => (
  new Stream(adaptive_(options, stream))
);

export const distance = (first, second) => (
  new Stream(distance_(first, second))
);

export const intensity = (options, stream) => (
  new Stream(intensity_(options, stream))
);

export const line = options => (
  new Stream(line_(options))
);

export const lineto = (options, stream) => (
  new Stream(lineto_(options, stream))
);

export const adsr = (options, stream) => (
  new Stream(adsr_(options, stream))
);
