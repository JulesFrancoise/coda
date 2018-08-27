import { parseParameters } from '@coda/prelude';
import { audioContext } from 'waves-audio';
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
 */
class PingPongDelay extends BaseAudioEffect {
  constructor(options) {
    super();
    this.pingpong = new tuna.PingPongDelay(options);
    this.input.connect(this.pingpong);
    this.pingpong.connect(audioContext.destination);
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
 * @param  {Object} [options={}] PingPongDelay parameters
 * @return {PingPongDelay}              PingPongDelay engine
 */
export default function pingpong(options = {}) {
  const opts = parseParameters(definitions, options);
  return new PingPongDelay(opts);
}
