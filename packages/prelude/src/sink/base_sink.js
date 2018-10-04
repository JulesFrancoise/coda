/**
 * Base sinks for implementing CO/DA modules
 * @private
 */
export default class BaseStream {
  /**
   * @param {Object} sink      Event sink
   * @param {Object} scheduler Most scheduler
   */
  constructor(sink, scheduler) {
    this.sink = sink;
    this.scheduler = scheduler;
  }

  /**
   * Propagate an event
   * @param  {number} t   event timestamp
   * @param  {*} x event value
   */
  event(t, x) { // eslint-disable-line
    throw new Error('The event method must be overloaded');
  }

  /**
   * Terminate the stream
   * @param  {number} t   event timestamp
   */
  end(t) {
    return this.sink.end(t);
  }

  /**
   * Propagate an error on the stream
   * @param  {number} t   event timestamp
   * @param  {Error} e    Error message
   */
  error(t, e) {
    return this.sink.error(t, e);
  }
}
