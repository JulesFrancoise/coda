/* esdoc-ignore */

/**
 * Base class for the mars fluent stream API, that wraps all `mars` methods.
 * For the documentation of each member, see the dedicated static function of
 * the same name.
 *
 * Streams are composed of a set of attributes (`attr`) and a `run` method
 * called by the most core `runEffects` method.
 *
 * @private
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
   * @param  {Object} attributes Attributes
   * @return {Stream}
   */
  withAttr(attributes) {
    this.attr = Object.assign(this.attr, attributes);
    return this;
  }

  static use(module, ...args) {
    module(Stream, ...args);
    return Stream;
  }
}
