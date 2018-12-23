import toMax from './tomax';

export default function setup(Stream) {
  const s = Stream;
  /**
   * @ignore
   * @param  {Object} options Options
   * @return {Stream}
   */
  s.prototype.toMax = function toMax_(options) {
    return new Stream(toMax(options, this));
  };
}
