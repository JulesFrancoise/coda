/* esdoc-ignore */
import * as most from '@most/core';

export default function setupMost(Stream) {
  const s = Stream;

  /**
   * @param  {*} x
   * @return {Stream}
   */
  s.prototype.startWith = function startWith_(x) {
    return this.createWithAttr(most.startWith(x, this));
  };

  /**
   * @param  {Function} f
   * @return {Stream}
   */
  s.prototype.continueWith = function continueWith_(f) {
    return this.createWithAttr(most.continueWith(f, this));
  };

  /**
   * @param  {Function} f
   * @return {Stream}
   */
  s.prototype.map = function map_(f) {
    return this.createWithAttr(most.map(f, this));
  };

  /**
   * @param  {*} x
   * @return {Stream}
   */
  s.prototype.constant = function constant_(x) {
    return this.createWithAttr(most.constant(x, this));
  };

  /**
   * @param  {Function} f
   * @return {Stream}
   */
  s.prototype.tap = function tap_(f) {
    return this.createWithAttr(most.tap(f, this));
  };

  /**
   * @param  {Stream<Function>} fs
   * @return {Stream}
   */
  s.prototype.ap = function ap_(fs) {
    return this.createWithAttr(most.ap(fs, this));
  };

  /**
   * @param  {Function} f
   * @param  {*} initial
   * @return {Stream}
   */
  s.prototype.scan = function scan_(f, initial) {
    return this.createWithAttr(most.scan(f, initial, this));
  };

  /**
   * @param  {Function} stepper
   * @param  {*} seed
   * @return {Stream}
   */
  s.prototype.loop = function loop_(stepper, seed) {
    return this.createWithAttr(most.loop(stepper, seed, this));
  };

  /**
   * @param  {Array} items
   * @return {Stream}
   */
  s.prototype.withItems = function withItems_(items) {
    return this.createWithAttr(most.withItems(items, this));
  };

  /**
   * @param  {Function} f
   * @param  {Array} items
   * @return {Stream}
   */
  s.prototype.zipItems = function zipItems_(f, items) {
    return this.createWithAttr(most.zipItems(f, items, this));
  };

  /**
   * @return {Stream}
   */
  s.prototype.switchLatest = function switchLatest_() {
    return this.createWithAttr(most.switchLatest(this));
  };

  /**
   * @return {Stream}
   */
  s.prototype.join = function join_() {
    return this.createWithAttr(most.join(this));
  };

  /**
   * @param  {Function} f
   * @return {Stream}
   */
  s.prototype.chain = function chain_(f) {
    return this.createWithAttr(most.chain(f, this));
  };

  /**
   * @param  {Function} f
   * @return {Stream}
   */
  s.prototype.concatMap = function concatMap_(f) {
    return this.createWithAttr(most.concatMap(f, this));
  };

  /**
   * @param  {Number} concurrency
   * @return {Stream}
   */
  s.prototype.mergeConcurrently = function mergeConcurrently_(concurrency) {
    return this.createWithAttr(most.mergeConcurrently(concurrency, this));
  };

  /**
   * @param  {Function} f
   * @param  {Number} concurrency
   * @return {Stream}
   */
  s.prototype.mergeMapConcurrently = function mergeMapConcurrently_(f, concurrency) {
    return this.createWithAttr(most.mergeMapConcurrently(f, concurrency, this));
  };

  /**
   * @param  {Stream} stream1
   * @return {Stream}
   */
  s.prototype.merge = function merge_(stream1) {
    return this.createWithAttr(most.merge(stream1, this));
  };

  /**
   * @param  {Function} f
   * @param  {Stream} stream1
   * @return {Stream}
   */
  s.prototype.combine = function combine_(f, stream1) {
    return this.createWithAttr(most.combine(f, stream1, this));
  };

  /**
   * @param  {Function} f
   * @param  {Stream} stream1
   * @return {Stream}
   */
  s.prototype.zip = function zip_(f, stream1) {
    return this.createWithAttr(most.zip(f, stream1, this));
  };

  /**
   * @param  {Stream} sampler
   * @return {Stream}
   */
  s.prototype.resample = function resample_(sampler) {
    return this.createWithAttr(most.sample(this, sampler));
  };

  /**
   * @param  {Stream} values
   * @return {Stream}
   */
  s.prototype.sample = function sample_(values) {
    this.attr = values.attr;
    return this.createWithAttr(most.sample(values, this));
  };

  /**
   * @param  {Function} f
   * @param  {Stream} values
   * @return {Stream}
   */
  s.prototype.snapshot = function snapshot_(f, values) {
    return this.createWithAttr(most.snapshot(f, values, this));
  };

  /**
   * @param  {Function} p
   * @return {Stream}
   */
  s.prototype.filter = function filter_(p) {
    return this.createWithAttr(most.filter(p, this));
  };

  /**
   * @return {Stream}
   */
  s.prototype.skipRepeats = function skipRepeats_() {
    return this.createWithAttr(most.skipRepeats(this));
  };

  /**
   * @param  {Function} equals
   * @return {Stream}
   */
  s.prototype.skipRepeatsWith = function skipRepeatsWith_(equals) {
    return this.createWithAttr(most.skipRepeatsWith(equals, this));
  };

  /**
   * @param  {Number]} start
   * @param  {Number]} end
   * @return {Stream}
   */
  s.prototype.slice = function slice_(start, end) {
    return this.createWithAttr(most.slice(start, end, this));
  };

  /**
   * @param  {Number} n
   * @return {Stream}
   */
  s.prototype.take = function take_(n) {
    return this.createWithAttr(most.take(n, this));
  };

  /**
   * @param  {Number} n
   * @return {Stream}
   */
  s.prototype.skip = function skip_(n) {
    return this.createWithAttr(most.skip(n, this));
  };

  /**
   * @param  {Function} p
   * @return {Stream}
   */
  s.prototype.takeWhile = function takeWhile_(p) {
    return this.createWithAttr(most.takeWhile(p, this));
  };

  /**
   * @param  {Function} p
   * @return {Stream}
   */
  s.prototype.skipWhile = function skipWhile_(p) {
    return this.createWithAttr(most.skipWhile(p, this));
  };

  /**
   * @param  {Function} p
   * @return {Stream}
   */
  s.prototype.skipAfter = function skipAfter_(p) {
    return this.createWithAttr(most.skipAfter(p, this));
  };

  /**
   * @param  {Stream} signal
   * @return {Stream}
   */
  s.prototype.until = function until_(signal) {
    return this.createWithAttr(most.until(signal, this));
  };

  /**
   * @param  {Stream} signal
   * @return {Stream}
   */
  s.prototype.since = function since_(signal) {
    return this.createWithAttr(most.since(signal, this));
  };

  /**
   * @param  {Stream} timeWindow
   * @return {Stream}
   */
  s.prototype.during = function during_(timeWindow) {
    return this.createWithAttr(most.during(timeWindow, this));
  };

  /**
   * @param  {Number} delayTime
   * @return {Stream}
   */
  s.prototype.delay = function delay_(delayTime) {
    return this.createWithAttr(most.delay(delayTime, this));
  };

  /**
   * @param  {Number} origin
   * @return {Stream}
   */
  s.prototype.withLocalTime = function withLocalTime_(origin) {
    return this.createWithAttr(most.withLocalTime(origin, this));
  };

  /**
   * @param {Number} period period
   * @return {Stream}
   */
  s.prototype.throttle = function throttle_(period) {
    return this.createWithAttr(most.throttle(period, this));
  };

  /**
   * @param {Number} period period
   * @return {Stream}
   */
  s.prototype.debounce = function debounce_(period) {
    return this.createWithAttr(most.debounce(period, this));
  };

  /**
   * @return {Stream}
   */
  s.prototype.awaitPromises = function awaitPromises_() {
    return this.createWithAttr(most.awaitPromises(this));
  };

  /**
   * @param {Function} f function that returns a stream
   * @return {Stream}
   */
  s.prototype.recoverWith = function recoverWith_(f) {
    return this.createWithAttr(most.recoverWith(f, this));
  };

  /**
   * @return {Stream}
   */
  s.prototype.multicast = function multicast_() {
    return this.createWithAttr(most.multicast(this));
  };
}
