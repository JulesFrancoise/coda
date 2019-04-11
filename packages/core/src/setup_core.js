import elementwise, { add, sub, mul, div } from './operator/elementwise';
import { mean, std, meanstd } from './operator/meanstd';
import pak from './operator/pak';
import pack from './operator/pack';
import schmitt from './operator/schmitt';
import select from './operator/select';
import slide from './operator/slide';
import reduce, { min, max, minmax, sum, prod, norm } from './operator/reduce';
import unpack from './operator/unpack';
import biquad from './operator/biquad';
import force from './operator/force';
import mvavrg from './operator/mvavrg';
import accum from './operator/accum';
import clip from './operator/clip';
import cycle from './operator/cycle';
import delta from './operator/delta';
import rand from './operator/rand';
import scale from './operator/scale';
import autoscale from './operator/autoscale';
import kicks from './operator/kicks';
import kick from './operator/kick';
import wavelet from './operator/wavelet';
import adaptive from './operator/adaptive';
import distance from './operator/distance';
import intensity from './operator/intensity';
import lineto from './operator/lineto';
import adsr from './operator/adsr';

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
  s.prototype.add = function add_(second) {
    return new Stream(add(this, second));
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
  s.prototype.div = function div_(second) {
    return new Stream(div(this, second));
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
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.kick = function kick_(options) {
    return new Stream(kick(options, this));
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
  s.prototype.mul = function mul_(second) {
    return new Stream(mul(this, second));
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
  s.prototype.norm = function norm_() {
    return new Stream(norm(this));
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
  s.prototype.sub = function sub_(second) {
    return new Stream(sub(this, second));
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

  /**
   * @ignore
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.distance = function distance_(second) {
    return new Stream(distance(this, second));
  };

  /**
   * @ignore
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.intensity = function intensity_(options) {
    return new Stream(intensity(options, this));
  };

  /**
   * @ignore
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.lineto = function lineto_(options) {
    return new Stream(lineto(options, this));
  };

  /**
   * @ignore
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.adsr = function adsr_(options) {
    return new Stream(adsr(options, this));
  };
}
