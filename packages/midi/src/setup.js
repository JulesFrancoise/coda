/* esdoc-ignore */
import ftom from './operator/ftom';
import mtof from './operator/mtof';
import quantize from './operator/quantize';

export default function setup(Stream) {
  const s = Stream;

  /**
   * @ignore
   * @return {Stream}
   */
  s.prototype.ftom = function ftom_() {
    return new Stream(ftom(this));
  };

  /**
   * @ignore
   * @return {Stream}
   */
  s.prototype.mtof = function mtof_() {
    return new Stream(mtof(this));
  };

  /**
   * @ignore
   * @return {Stream}
   */
  s.prototype.quantize = function quantize_(options) {
    return new Stream(quantize(options, this));
  };
}
