/* esdoc-ignore */
import * as most from '@most/core';
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
import ftom from './operator/mapping/ftom';
import mtof from './operator/mapping/mtof';
import quantize from './operator/mapping/quantize';
import rand from './operator/mapping/rand';
import scale from './operator/mapping/scale';
import autoscale from './operator/mapping/autoscale';
import train from './operator/ml/train';
import recognize from './operator/ml/recognize';
import kicks from './operator/spectral/kicks';
import wavelet from './operator/spectral/wavelet';
import heatmap from './ui/heatmap';
import plot from './ui/plot';
import recorder from './ui/recorder';
import looper from './ui/looper';
import tomax from './sink/tomax';
import scalelearn from './operator/ml/scalelearn';
import scale2 from './operator/ml/scale2';
import clusterize from './operator/ml/clusterize';

/**
 * Base class for the mars fluent stream API, that wraps all `mars` methods.
 * For the documentation of each member, see the dedicated static function of
 * the same name.
 *
 * Streams are composed of a set of attributes (`attr`) and a `run` method
 * called by the most core `runEffects` method.
 */
export default class Stream {
  /**
   * @param {Object} source Source Stream (from @most/core)
   */
  constructor(source) {
    this.isStream = true;
    /**
     * Stream attributes
     * @type {Object}
     */
    this.attr = source.attr || {};
    Object.keys(source).forEach((key) => {
      /**
       * @ignore
       */
      this[key] = source[key];
    });
    /**
     * Run function
     * @type {Function}
     */
    this.run = (sink, scheduler) => source.run(sink, scheduler);
  }

  extend(f) { // eslint-disable-line
    f(this);
  }

  /**
   * Create a stream with the source's attributes
   * @param  {Stream} source Source stream
   * @return {Stream}
   * @private
   */
  createWithAttr(source) {
    const s = new Stream(source);
    s.attr = this.attr;
    return s;
  }

  /**
   * @param  {*} x
   * @return {Stream}
   */
  startWith(x) {
    return this.createWithAttr(most.startWith(x, this));
  }

  /**
   * @param  {Function} f
   * @return {Stream}
   */
  continueWith(f) {
    return this.createWithAttr(most.continueWith(f, this));
  }

  /**
   * @param  {Function} f
   * @return {Stream}
   */
  map(f) {
    return this.createWithAttr(most.map(f, this));
  }

  /**
   * @param  {*} x
   * @return {Stream}
   */
  constant(x) {
    return this.createWithAttr(most.constant(x, this));
  }

  /**
   * @param  {Function} f
   * @return {Stream}
   */
  tap(f) {
    return this.createWithAttr(most.tap(f, this));
  }

  /**
   * @param  {Stream<Function>} fs
   * @return {Stream}
   */
  ap(fs) {
    return this.createWithAttr(most.ap(fs, this));
  }

  /**
   * @param  {Function} f
   * @param  {*} initial
   * @return {Stream}
   */
  scan(f, initial) {
    return this.createWithAttr(most.scan(f, initial, this));
  }

  /**
   * @param  {Function} stepper
   * @param  {*} seed
   * @return {Stream}
   */
  loop(stepper, seed) {
    return this.createWithAttr(most.loop(stepper, seed, this));
  }

  /**
   * @param  {Array} items
   * @return {Stream}
   */
  withItems(items) {
    return this.createWithAttr(most.withItems(items, this));
  }

  /**
   * @param  {Function} f
   * @param  {Array} items
   * @return {Stream}
   */
  zipItems(f, items) {
    return this.createWithAttr(most.zipItems(f, items, this));
  }

  /**
   * @return {Stream}
   */
  switchLatest() {
    return this.createWithAttr(most.switchLatest(this));
  }

  /**
   * @return {Stream}
   */
  join() {
    return this.createWithAttr(most.join(this));
  }

  /**
   * @param  {Function} f
   * @return {Stream}
   */
  chain(f) {
    return this.createWithAttr(most.chain(f, this));
  }

  /**
   * @param  {Function} f
   * @return {Stream}
   */
  concatMap(f) {
    return this.createWithAttr(most.concatMap(f, this));
  }

  /**
   * @param  {Number} concurrency
   * @return {Stream}
   */
  mergeConcurrently(concurrency) {
    return this.createWithAttr(most.mergeConcurrently(concurrency, this));
  }

  /**
   * @param  {Function} f
   * @param  {Number} concurrency
   * @return {Stream}
   */
  mergeMapConcurrently(f, concurrency) {
    return this.createWithAttr(most.mergeMapConcurrently(f, concurrency, this));
  }

  /**
   * @param  {Stream} stream1
   * @return {Stream}
   */
  merge(stream1) {
    return this.createWithAttr(most.merge(stream1, this));
  }

  /**
   * @param  {Function} f
   * @param  {Stream} stream1
   * @return {Stream}
   */
  combine(f, stream1) {
    return this.createWithAttr(most.combine(f, stream1, this));
  }

  /**
   * @param  {Function} f
   * @param  {Stream} stream1
   * @return {Stream}
   */
  zip(f, stream1) {
    return this.createWithAttr(most.zip(f, stream1, this));
  }

  /**
   * @param  {Stream} sampler
   * @return {Stream}
   */
  resample(sampler) {
    return this.createWithAttr(most.sample(this, sampler));
  }

  /**
   * @param  {Stream} values
   * @return {Stream}
   */
  sample(values) {
    this.attr = values.attr;
    return this.createWithAttr(most.sample(values, this));
  }

  /**
   * @param  {Function} f
   * @param  {Stream} values
   * @return {Stream}
   */
  snapshot(f, values) {
    return this.createWithAttr(most.snapshot(f, values, this));
  }

  /**
   * @param  {Function} p
   * @return {Stream}
   */
  filter(p) {
    return this.createWithAttr(most.filter(p, this));
  }

  /**
   * @return {Stream}
   */
  skipRepeats() {
    return this.createWithAttr(most.skipRepeats(this));
  }

  /**
   * @param  {Function} equals
   * @return {Stream}
   */
  skipRepeatsWith(equals) {
    return this.createWithAttr(most.skipRepeatsWith(equals, this));
  }

  /**
   * @param  {Number]} start
   * @param  {Number]} end
   * @return {Stream}
   */
  slice(start, end) {
    return this.createWithAttr(most.slice(start, end, this));
  }

  /**
   * @param  {Number} n
   * @return {Stream}
   */
  take(n) {
    return this.createWithAttr(most.take(n, this));
  }

  /**
   * @param  {Number} n
   * @return {Stream}
   */
  skip(n) {
    return this.createWithAttr(most.skip(n, this));
  }

  /**
   * @param  {Function} p
   * @return {Stream}
   */
  takeWhile(p) {
    return this.createWithAttr(most.takeWhile(p, this));
  }

  /**
   * @param  {Function} p
   * @return {Stream}
   */
  skipWhile(p) {
    return this.createWithAttr(most.skipWhile(p, this));
  }

  /**
   * @param  {Function} p
   * @return {Stream}
   */
  skipAfter(p) {
    return this.createWithAttr(most.skipAfter(p, this));
  }

  /**
   * @param  {Stream} signal
   * @return {Stream}
   */
  until(signal) {
    return this.createWithAttr(most.until(signal, this));
  }

  /**
   * @param  {Stream} signal
   * @return {Stream}
   */
  since(signal) {
    return this.createWithAttr(most.since(signal, this));
  }

  /**
   * @param  {Stream} timeWindow
   * @return {Stream}
   */
  during(timeWindow) {
    return this.createWithAttr(most.during(timeWindow, this));
  }

  /**
   * @param  {Number} delayTime
   * @return {Stream}
   */
  delay(delayTime) {
    return this.createWithAttr(most.delay(delayTime, this));
  }

  /**
   * @param  {Number} origin
   * @return {Stream}
   */
  withLocalTime(origin) {
    return this.createWithAttr(most.withLocalTime(origin, this));
  }

  /**
   * @param {Number} period period
   * @return {Stream}
   */
  throttle(period) {
    return this.createWithAttr(most.throttle(period, this));
  }

  /**
   * @param {Number} period period
   * @return {Stream}
   */
  debounce(period) {
    return this.createWithAttr(most.debounce(period, this));
  }

  /**
   * @return {Stream}
   */
  awaitPromises() {
    return this.createWithAttr(most.awaitPromises(this));
  }

  /**
   * @param {Function} f function that returns a stream
   * @return {Stream}
   */
  recoverWith(f) {
    return this.createWithAttr(most.recoverWith(f, this));
  }

  /**
   * @return {Stream}
   */
  multicast() {
    return this.createWithAttr(most.multicast(this));
  }

  // =====================
  // == MARS OPERATORS
  // =====================
  /**
   * @return {Stream}
   */
  accum() {
    return new Stream(accum(this));
  }

  /**
   * @todo check signature
   * @return {Stream}
   */
  add(streams) {
    return new Stream(add(this, streams));
  }

  /**
   * @return {Stream}
   */
  atodb() {
    return new Stream(atodb(this));
  }

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  biquad(options) {
    return new Stream(biquad(options, this));
  }

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  clip(options) {
    return new Stream(clip(options, this));
  }

  /**
   * @param  {Array} buffer Buffer
   * @return {Stream}
   */
  cycle(buffer) {
    return new Stream(cycle(buffer, this));
  }

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  delta(options) {
    return new Stream(delta(options, this));
  }

  /**
   * @return {Stream}
   */
  div(streams) {
    return new Stream(div(this, streams));
  }

  /**
   * @return {Stream}
   */
  dbtoa() {
    return new Stream(dbtoa(this));
  }

  /**
   * @param {Function} f function
   * @param {Stream} second second stream
   * @return {Stream}
   */
  elementwise(f, second) {
    return new Stream(elementwise(f, this, second));
  }

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  force(options) {
    return new Stream(force(options, this));
  }

  /**
   * @return {Stream}
   */
  ftom() {
    return new Stream(ftom(this));
  }

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  kicks(options) {
    return new Stream(kicks(options, this));
  }

  /**
   * @return {Stream}
   */
  max() {
    return new Stream(max(this));
  }

  /**
   * @return {Stream}
   */
  mean() {
    return new Stream(mean(this));
  }

  /**
   * @return {Stream}
   */
  meanstd() {
    return new Stream(meanstd(this));
  }

  /**
   * @return {Stream}
   */
  min() {
    return new Stream(min(this));
  }

  /**
   * @return {Stream}
   */
  minmax() {
    return new Stream(minmax(this));
  }

  /**
   * @return {Stream}
   */
  mtof() {
    return new Stream(mtof(this));
  }

  /**
   * @return {Stream}
   */
  mul(streams) {
    return new Stream(mul(this, streams));
  }

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  mvavrg(options) {
    return new Stream(mvavrg(options, this));
  }

  /**
   * @return {Stream}
   */
  prod() {
    return new Stream(prod(this));
  }

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  quantize(options) {
    return new Stream(quantize(options, this));
  }

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  rand(options) {
    return new Stream(rand(options, this));
  }

  /**
   * @param {Function} reducer reducer
   * @param {*} initial initial value
   * @return {Stream}
   */
  reduce(reducer, initial) {
    return new Stream(reduce(reducer, initial, this));
  }

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  scale(options) {
    return new Stream(scale(options, this));
  }

  /**
   * @return {Stream}
   */
  autoscale() {
    return new Stream(autoscale(this));
  }

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  schmitt(options) {
    return new Stream(schmitt(options, this));
  }

  /**
   * @param {Array} indices Indices
   * @return {Stream}
   */
  select(indices) {
    return new Stream(select(indices, this));
  }

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  train(options) {
    return new Stream(train(options, this));
  }

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  recognize(options) {
    return new Stream(recognize(options, this));
  }

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  slide(options) {
    return new Stream(slide(options, this));
  }

  /**
   * @return {Stream}
   */
  std() {
    return new Stream(std(this));
  }

  /**
   * @return {Stream}
   */
  sub(streams) {
    return new Stream(sub(this, streams));
  }

  /**
   * @return {Stream}
   */
  sum() {
    return new Stream(sum(this));
  }

  /**
   * @return {Stream}
   */
  pak(sources) {
    return pak([this, ...sources]).map(s => new Stream(s));
  }

  /**
   * @return {Stream}
   */
  pack(sources) {
    return pack([this, ...sources]).map(s => new Stream(s));
  }

  /**
   * @return {Stream}
   */
  unpack() {
    return unpack(this).map(s => new Stream(s));
  }

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  wavelet(options) {
    return new Stream(wavelet(options, this));
  }

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  plot(options) {
    return new Stream(plot(options, this));
  }

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  heatmap(options) {
    return new Stream(heatmap(options, this));
  }

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  recorder(options) {
    return new Stream(recorder(options, this));
  }

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  looper(options) {
    return new Stream(looper(options, this));
  }

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  tomax(options) {
    return new Stream(tomax(options, this));
  }

  /**
   * @return {Stream}
   */
  scalelearn() {
    return new Stream(scalelearn(this));
  }

  /**
  * @param  {Stream} minmaxstream    stream of extremum
   * @return {Stream}
   */
  scale2(minmaxstream) {
    return new Stream(scale2(minmaxstream, this));
  }

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  clusterize(options) {
    return new Stream(clusterize(options, this));
  }

  /**
   * @param  {Object} attributes Attributes
   * @return {Stream}
   */
  withAttr(attributes) {
    this.attr = Object.assign(this.attr, attributes);
    return this;
  }
}
