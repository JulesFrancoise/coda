import { parseParameters } from '@coda/prelude';
import BaseAudioEffect from '../core/effect';
import tuna from '../lib/tuna';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  outputGain: {
    type: 'float',
    default: 0.5,
    min: 0,
  },
  drive: {
    type: 'float',
    default: 0.7,
    min: 0,
    max: 1,
  },
  amount: {
    type: 'float',
    default: 1,
    min: 0,
    max: 1,
  },
  algorithmIndex: {
    type: 'integer',
    default: 0,
    min: 0,
    max: 5,
  },
};

/**
 * Overdrive audio effect
 */
class Overdrive extends BaseAudioEffect {
  constructor(options) {
    super();
    this.overdrive = new tuna.Overdrive(options);
    this.input.connect(this.overdrive);
    this.overdrive.connect(this.wet);
    this.defineParameter('outputGain', options.outputGain, (x) => {
      this.overdrive.outputGain = x;
    });
    this.defineParameter('drive', options.drive, (x) => {
      this.overdrive.drive = x;
    });
    this.defineParameter('amount', options.amount, (x) => {
      this.overdrive.curveAmount = x;
    });
    this.defineParameter('algorithmIndex', options.algorithmIndex, (x) => {
      this.overdrive.algorithmIndex = x;
    });
  }
}

/**
 * Create a Overdrive effect
 *
 * @param  {Object} [options={}] Overdrive parameters
 * @return {Overdrive}              Overdrive engine
 */
export default function overdrive(options = {}) {
  const opts = parseParameters(definitions, options);
  return new Overdrive(opts);
}
