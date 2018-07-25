/* esdoc-ignore */
import { setupUI } from './lib/ui';
import heatmap from './ui/heatmap';
import plot from './ui/plot';
import recorder from './ui/recorder';
import looper from './ui/looper';

export default function setup(Stream, containerId = null) {
  const s = Stream;
  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.plot = function plot_(options) {
    return new Stream(plot(options, this));
  };

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.heatmap = function heatmap_(options) {
    return new Stream(heatmap(options, this));
  };

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.looper = function looper_(options) {
    return new Stream(looper(options, this));
  };

  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.recorder = function recorder_(options) {
    return new Stream(recorder(options, this));
  };


  if (containerId) setupUI(containerId);
}
