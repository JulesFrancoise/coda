/* esdoc-ignore */
import toMax from './tomax';

export default function setup(Stream) {
  const s = Stream;
  /**
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.toMax = function toMax_(options) {
    return new Stream(toMax(options, this));
  };
}
