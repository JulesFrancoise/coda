import { parseParameters } from '@coda/prelude';
import BaseAudioEffect from '../core/effect';
import tuna from '../lib/tuna';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  drive: {
    type: 'float',
    default: 1,
    min: 0,
    max: 1,
  },
  outputGain: {
    type: 'float',
    default: -3,
    max: 0,
  },
  amount: {
    type: 'float',
    default: 0,
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
 * @private
 * @extends BaseAudioEffect
 *
 * @property {Number|Stream<Number>} outputGain     Output Gain
 * @property {Number|Stream<Number>} drive          Drive
 * @property {Number|Stream<Number>} amount         Amount
 * @property {Number|Stream<Number>} algorithmIndex Type of Overdrive Algorithm (0-5)
 */
class Overdrive extends BaseAudioEffect {
  /**
   * @param {Object} [options={}]               Effect options
   * @param {Number} [options.outputGain=-3]    Output Gain (dB)
   * @param {Number} [options.drive=1]          Drive
   * @param {Number} [options.amount=0]         Amount
   * @param {Number} [options.algorithmIndex=0] Type of Overdrive Algorithm (0-5)
   */
  constructor(options) {
    super();
    this.overdrive = new tuna.Overdrive({ ...options, curveAmount: options.amount });
    this.input.connect(this.overdrive);
    this.overdrive.connect(this.wetNode);
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
 * Based on the Tuna Audio effect library: https://github.com/Theodeus/tuna/
 *
 * @param {Object} [options={}]               Effect options
 * @param {Number} [options.outputGain=-3]    Output Gain (dB)
 * @param {Number} [options.drive=1]          Drive
 * @param {Number} [options.amount=0]         Amount
 * @param {Number} [options.algorithmIndex=0] Type of Overdrive Algorithm (0-5)
 * @return {Overdrive} Overdrive engine
 */
export default function overdrive(options = {}) {
  const opts = parseParameters(definitions, options);
  return new Overdrive(opts);
}
