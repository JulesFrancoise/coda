/* esdoc-ignore */
import elementwise, { add, sub, mul, div } from './operator/basic/elementwise';
import { mean, std, meanstd } from './operator/basic/meanstd';
import pak from './operator/basic/pak';
import pack from './operator/basic/pack';
import schmitt from './operator/basic/schmitt';
import select from './operator/basic/select';
import slide from './operator/basic/slide';
import reduce, { min, max, minmax, sum, prod } from './operator/basic/reduce';
import unpack from './operator/basic/unpack';
import biquad from './operator/filter/biquad';
import force from './operator/filter/force';
import mvavrg from './operator/filter/mvavrg';
import accum from './operator/mapping/accum';
import atodb from './operator/mapping/atodb';
import clip from './operator/mapping/clip';
import cycle from './operator/mapping/cycle';
import delta from './operator/mapping/delta';
import dbtoa from './operator/mapping/dbtoa';
import rand from './operator/mapping/rand';
import scale from './operator/mapping/scale';
import autoscale from './operator/mapping/autoscale';
import kicks from './operator/spectral/kicks';
import wavelet from './operator/spectral/wavelet';
import adaptive from './operator/mapping/adaptive';

export default function setupCore(Stream) {
  const s = Stream;
  /**
   * @ignore
   * @return {Stream}
   */
  s.prototype.accum = function accum_() {
    return new Stream(accum(this));
  };

  /**
   * @todo check signature
   * @ignore
   * @return {Stream}
   */
  s.prototype.add = function add_(streams) {
    return new Stream(add(this, streams));
  };

  /**
   * @ignore
   * @return {Stream}
   */
  s.prototype.atodb = function atodb_() {
    return new Stream(atodb(this));
  };

  /**
   * @ignore
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.biquad = function biquad_(options) {
    return new Stream(biquad(options, this));
  };

  /**
   * @ignore
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.clip = function clip_(options) {
    return new Stream(clip(options, this));
  };

  /**
   * @ignore
   * @param  {Array} buffer Buffer
   * @return {Stream}
   */
  s.prototype.cycle = function cycle_(buffer) {
    return new Stream(cycle(buffer, this));
  };

  /**
   * @ignore
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.delta = function delta_(options) {
    return new Stream(delta(options, this));
  };

  /**
   * @ignore
   * @return {Stream}
   */
  s.prototype.div = function div_(streams) {
    return new Stream(div(this, streams));
  };

  /**
   * @ignore
   * @return {Stream}
   */
  s.prototype.dbtoa = function dbtoa_() {
    return new Stream(dbtoa(this));
  };

  /**
   * @ignore
   * @param {Function} f function
   * @param {Stream} second second stream
   * @return {Stream}
   */
  s.prototype.elementwise = function elementwise_(f, second) {
    return new Stream(elementwise(f, this, second));
  };

  /**
   * @ignore
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.force = function force_(options) {
    return new Stream(force(options, this));
  };

  /**
   * @ignore
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.kicks = function kicks_(options) {
    return new Stream(kicks(options, this));
  };

  /**
   * @ignore
   * @return {Stream}
   */
  s.prototype.max = function max_() {
    return new Stream(max(this));
  };

  /**
   * @ignore
   * @return {Stream}
   */
  s.prototype.mean = function mean_() {
    return new Stream(mean(this));
  };

  /**
   * @ignore
   * @return {Stream}
   */
  s.prototype.meanstd = function meanstd_() {
    return new Stream(meanstd(this));
  };

  /**
   * @ignore
   * @return {Stream}
   */
  s.prototype.min = function min_() {
    return new Stream(min(this));
  };

  /**
   * @ignore
   * @return {Stream}
   */
  s.prototype.minmax = function minmax_() {
    return new Stream(minmax(this));
  };

  /**
   * @ignore
   * @return {Stream}
   */
  s.prototype.mul = function mul_(streams) {
    return new Stream(mul(this, streams));
  };

  /**
   * @ignore
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.mvavrg = function mvavrg_(options) {
    return new Stream(mvavrg(options, this));
  };

  /**
   * @ignore
   * @return {Stream}
   */
  s.prototype.prod = function prod_() {
    return new Stream(prod(this));
  };

  /**
   * @ignore
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.rand = function rand_(options) {
    return new Stream(rand(options, this));
  };

  /**
   * @ignore
   * @param {Function} reducer reducer
   * @param {*} initial initial value
   * @return {Stream}
   */
  s.prototype.reduce = function reduce_(reducer, initial) {
    return new Stream(reduce(reducer, initial, this));
  };

  /**
   * @ignore
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.scale = function scale_(options) {
    return new Stream(scale(options, this));
  };

  /**
   * @ignore
   * @return {Stream}
   */
  s.prototype.autoscale = function autoscale_() {
    return new Stream(autoscale(this));
  };

  /**
   * @ignore
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.schmitt = function schmitt_(options) {
    return new Stream(schmitt(options, this));
  };

  /**
   * @ignore
   * @param {Array} indices Indices
   * @return {Stream}
   */
  s.prototype.select = function select_(indices) {
    return new Stream(select(indices, this));
  };

  /**
   * @ignore
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.slide = function slide_(options) {
    return new Stream(slide(options, this));
  };

  /**
   * @ignore
   * @return {Stream}
   */
  s.prototype.std = function std_() {
    return new Stream(std(this));
  };

  /**
   * @ignore
   * @return {Stream}
   */
  s.prototype.sub = function sub_(streams) {
    return new Stream(sub(this, streams));
  };

  /**
   * @ignore
   * @return {Stream}
   */
  s.prototype.sum = function sum_() {
    return new Stream(sum(this));
  };

  /**
   * @ignore
   * @return {Stream}
   */
  s.prototype.pak = function pak_(sources) {
    return pak([this, ...sources]).map(x => new Stream(x));
  };

  /**
   * @ignore
   * @return {Stream}
   */
  s.prototype.pack = function pack_(sources) {
    return pack([this, ...sources]).map(x => new Stream(x));
  };

  /**
   * @ignore
   * @return {Stream}
   */
  s.prototype.unpack = function unpack_() {
    return unpack(this).map(x => new Stream(x));
  };

  /**
   * @ignore
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.wavelet = function wavelet_(options) {
    return new Stream(wavelet(options, this));
  };

  /**
   * @ignore
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.adaptive = function adaptive_(options) {
    return new Stream(adaptive(options, this));
  };
}
