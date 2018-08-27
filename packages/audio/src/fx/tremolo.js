import { parseParameters } from '@coda/prelude';
import { audioContext } from 'waves-audio';
import BaseAudioEffect from '../core/effect';
import tuna from '../lib/tuna';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  intensity: {
    type: 'float',
    default: 0.3,
    min: 0,
    max: 1,
  },
  rate: {
    type: 'float',
    default: 4,
    min: 0.001,
  },
  stereoPhase: {
    type: 'float',
    default: 0,
    min: 0,
    max: 180,
  },
};

/**
 * Tremolo audio effect
 */
class Tremolo extends BaseAudioEffect {
  constructor(options) {
    super();
    this.tremolo = new tuna.Tremolo(options);
    this.sine = audioContext.createOscillator();
    this.sine.type = 'square';
    this.sine.frequency.setValueAtTime(3000, audioContext.currentTime); // value in hertz
    this.sine.connect(this.tremolo);
    // this.input.connect(this.tremolo);
    this.tremolo.connect(audioContext.destination);
    this.defineParameter('intensity', options.intensity, (x) => {
      this.tremolo.intensity = x;
    });
    this.defineParameter('rate', options.rate, (x) => {
      this.tremolo.rate = x;
    });
    this.defineParameter('stereoPhase', options.stereoPhase, (x) => {
      this.tremolo.stereoPhase = x;
    });
    this.sine.start();
  }
}

/**
 * Create a Tremolo effect
 *
 * @param  {Object} [options={}] Tremolo parameters
 * @return {Tremolo}              Tremolo engine
 */
export default function tremolo(options = {}) {
  const opts = parseParameters(definitions, options);
  return new Tremolo(opts);
}
