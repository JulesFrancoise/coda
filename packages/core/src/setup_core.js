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

export default function setupCore(Stream) {
  const s = Stream;
  /**
   * @return {Stream}
   */
  s.prototype.accum = function accum_() {
    return new Stream(accum(this));
  };

  /**
   * @todo check signature
   * @return {Stream}
   */
  s.prototype.add = function add_(streams) {
    return new Stream(add(this, streams));
  };

  /**
   * @return {Stream}
   */
  s.prototype.atodb = function atodb_() {
    return new Stream(atodb(this));
  };

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.biquad = function biquad_(options) {
    return new Stream(biquad(options, this));
  };

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.clip = function clip_(options) {
    return new Stream(clip(options, this));
  };

  /**
   * @param  {Array} buffer Buffer
   * @return {Stream}
   */
  s.prototype.cycle = function cycle_(buffer) {
    return new Stream(cycle(buffer, this));
  };

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.delta = function delta_(options) {
    return new Stream(delta(options, this));
  };

  /**
   * @return {Stream}
   */
  s.prototype.div = function div_(streams) {
    return new Stream(div(this, streams));
  };

  /**
   * @return {Stream}
   */
  s.prototype.dbtoa = function dbtoa_() {
    return new Stream(dbtoa(this));
  };

  /**
   * @param {Function} f function
   * @param {Stream} second second stream
   * @return {Stream}
   */
  s.prototype.elementwise = function elementwise_(f, second) {
    return new Stream(elementwise(f, this, second));
  };

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.force = function force_(options) {
    return new Stream(force(options, this));
  };

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.kicks = function kicks_(options) {
    return new Stream(kicks(options, this));
  };

  /**
   * @return {Stream}
   */
  s.prototype.max = function max_() {
    return new Stream(max(this));
  };

  /**
   * @return {Stream}
   */
  s.prototype.mean = function mean_() {
    return new Stream(mean(this));
  };

  /**
   * @return {Stream}
   */
  s.prototype.meanstd = function meanstd_() {
    return new Stream(meanstd(this));
  };

  /**
   * @return {Stream}
   */
  s.prototype.min = function min_() {
    return new Stream(min(this));
  };

  /**
   * @return {Stream}
   */
  s.prototype.minmax = function minmax_() {
    return new Stream(minmax(this));
  };

  /**
   * @return {Stream}
   */
  s.prototype.mul = function mul_(streams) {
    return new Stream(mul(this, streams));
  };

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.mvavrg = function mvavrg_(options) {
    return new Stream(mvavrg(options, this));
  };

  /**
   * @return {Stream}
   */
  s.prototype.prod = function prod_() {
    return new Stream(prod(this));
  };

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.rand = function rand_(options) {
    return new Stream(rand(options, this));
  };

  /**
   * @param {Function} reducer reducer
   * @param {*} initial initial value
   * @return {Stream}
   */
  s.prototype.reduce = function reduce_(reducer, initial) {
    return new Stream(reduce(reducer, initial, this));
  };

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.scale = function scale_(options) {
    return new Stream(scale(options, this));
  };

  /**
   * @return {Stream}
   */
  s.prototype.autoscale = function autoscale_() {
    return new Stream(autoscale(this));
  };

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.schmitt = function schmitt_(options) {
    return new Stream(schmitt(options, this));
  };

  /**
   * @param {Array} indices Indices
   * @return {Stream}
   */
  s.prototype.select = function select_(indices) {
    return new Stream(select(indices, this));
  };

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.slide = function slide_(options) {
    return new Stream(slide(options, this));
  };

  /**
   * @return {Stream}
   */
  s.prototype.std = function std_() {
    return new Stream(std(this));
  };

  /**
   * @return {Stream}
   */
  s.prototype.sub = function sub_(streams) {
    return new Stream(sub(this, streams));
  };

  /**
   * @return {Stream}
   */
  s.prototype.sum = function sum_() {
    return new Stream(sum(this));
  };

  /**
   * @return {Stream}
   */
  s.prototype.pak = function pak_(sources) {
    return pak([this, ...sources]).map(x => new Stream(x));
  };

  /**
   * @return {Stream}
   */
  s.prototype.pack = function pack_(sources) {
    return pack([this, ...sources]).map(x => new Stream(x));
  };

  /**
   * @return {Stream}
   */
  s.prototype.unpack = function unpack_() {
    return unpack(this).map(x => new Stream(x));
  };

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.wavelet = function wavelet_(options) {
    return new Stream(wavelet(options, this));
  };
}
