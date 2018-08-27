import { parseParameters } from '@coda/prelude';
import BaseAudioEffect from '../core/effect';
import tuna from '../lib/tuna';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  rate: {
    type: 'float',
    default: 1.2,
    min: 0.01,
  },
  depth: {
    type: 'float',
    default: 0.3,
    min: 0,
    max: 1,
  },
  feedback: {
    type: 'float',
    default: 0.2,
    min: 0,
  },
  stereoPhase: {
    type: 'float',
    default: 30,
    min: 0,
    max: 180,
  },
  baseModulationFrequency: {
    type: 'float',
    default: 700,
    min: 500,
    max: 1500,
  },
};

/**
 * Phaser audio effect
 */
class Phaser extends BaseAudioEffect {
  constructor(options) {
    super();
    this.phaser = new tuna.Phaser(options);
    this.input.connect(this.phaser);
    this.phaser.connect(this.wet);
    this.defineParameter('rate', options.rate, (x) => {
      this.phaser.rate = x;
    });
    this.defineParameter('depth', options.depth, (x) => {
      this.phaser.depth = x;
    });
    this.defineParameter('feedback', options.feedback, (x) => {
      this.phaser.feedback = x;
    });
    this.defineParameter('stereoPhase', options.stereoPhase, (x) => {
      this.phaser.stereoPhase = x;
    });
    this.defineParameter('baseModulationFrequency', options.baseModulationFrequency, (x) => {
      this.phaser.baseModulationFrequency = x;
    });
  }
}

/**
 * Create a Phaser effect
 *
 * @param  {Object} [options={}] Phaser parameters
 * @return {Phaser}              Phaser engine
 */
export default function phaser(options = {}) {
  const opts = parseParameters(definitions, options);
  return new Phaser(opts);
}
