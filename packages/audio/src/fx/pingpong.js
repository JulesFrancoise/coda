import { parseParameters } from '@coda/prelude';
import BaseAudioEffect from '../core/effect';
import tuna from '../lib/tuna';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  level: {
    type: 'float',
    default: 0.5,
    min: 0,
    max: 1,
  },
  feedback: {
    type: 'float',
    default: 0.3,
    min: 0,
    max: 1,
  },
  timeLeft: {
    type: 'float',
    default: 150,
    min: 1,
    max: 10000,
  },
  timeRight: {
    type: 'float',
    default: 200,
    min: 1,
    max: 10000,
  },
};

/**
 * PingPongDelay audio effect
 * @private
 * @extends BaseAudioEffect
 *
 * @property {Number|Stream<Number>} level     Level
 * @property {Number|Stream<Number>} feedback  Feedback
 * @property {Number|Stream<Number>} timeLeft  Left delay time (ms)
 * @property {Number|Stream<Number>} timeRight Left delay time (ms)
 */
class PingPongDelay extends BaseAudioEffect {
  /**
   * @param {Object} [options={}]            Effect options
   * @param {Number} [options.level=0.5]     Level
   * @param {Number} [options.feedback=0.3]  Feedback
   * @param {Number} [options.timeLeft=150]  Left delay time (ms)
   * @param {Number} [options.timeRight=200] Left delay time (ms)
   */
  constructor(options) {
    super();
    this.pingpong = new tuna.PingPongDelay(options);
    this.input.connect(this.pingpong);
    this.pingpong.connect(this.wetNode);
    this.defineParameter('level', options.level, (x) => {
      this.pingpong.wetLevel = x;
    });
    this.defineParameter('feedback', options.feedback, (x) => {
      this.pingpong.feedback = x;
    });
    this.defineParameter('timeLeft', options.timeLeft, (x) => {
      this.pingpong.delayTimeLeft = x;
    });
    this.defineParameter('timeRight', options.timeRight, (x) => {
      this.pingpong.delayTimeRight = x;
    });
  }
}

/**
 * Create a PingPongDelay effect
 *
 * Based on the Tuna Audio effect library: https://github.com/Theodeus/tuna/
 *
 * @param {Object} [options={}]            Effect options
 * @param {Number} [options.level=0.5]     Level
 * @param {Number} [options.feedback=0.3]  Feedback
 * @param {Number} [options.timeLeft=150]  Left delay time (ms)
 * @param {Number} [options.timeRight=200] Left delay time (ms)
 * @return {PingPongDelay} PingPongDelay engine
 */
export default function pingpong(options = {}) {
  const opts = parseParameters(definitions, options);
  return new PingPongDelay(opts);
}
