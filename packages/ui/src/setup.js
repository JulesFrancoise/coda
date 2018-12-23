import { setUiContainer } from './lib/ui';
import heatmap from './ui/heatmap';
import plot from './ui/plot';
import recorder from './ui/recorder';
import looper from './ui/looper';
import nodes from './ui/nodes';

export default function setup(Stream, containerId = null) {
  const s = Stream;
  /**
   * @ignore
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.plot = function plot_(options) {
    return new Stream(plot(options, this));
  };

  /**
   * @ignore
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.heatmap = function heatmap_(options) {
    return new Stream(heatmap(options, this));
  };

  /**
   * @ignore
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.looper = function looper_(options) {
    return new Stream(looper(options, this));
  };

  /**
   * @ignore
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.recorder = function recorder_(options) {
    return new Stream(recorder(options, this));
  };

  /**
   * @ignore
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.nodes = function nodes_(options) {
    return new Stream(nodes(options, this));
  };


  if (containerId) setUiContainer(containerId);
}
