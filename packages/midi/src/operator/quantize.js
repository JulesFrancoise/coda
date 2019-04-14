import { parseParameters, validateStream, withAttr } from '@coda/prelude';
import { map } from '@most/core';
import { Scale, Note } from 'tonal';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  scale: {
    type: 'string',
    default: 'chromatic',
  },
  mode: {
    type: 'enum',
    default: 'round',
    list: [
      'round',
      'floor',
      'ceil',
    ],
  },
  octavemin: {
    type: 'integer',
    default: 0,
  },
  octavemax: {
    type: 'integer',
    default: 10,
  },
};

/**
 * Stream I/O Attributes Specification
 * @ignore
 */
const specification = {
  format: {
    required: true,
    check: ['scalar', 'vector'],
  },
  size: {
    required: true,
    check: { min: 1 },
  },
};

/**
 * Quantize a value to the nearest lower note
 * @param  {number} x     target value
 * @param  {Array} notes  List of notes
 * @return {number}       nearest lower note
 *
 * @private
 */
function quantizeFloor(x, notes) {
  for (let i = 0; i < notes.length; i += 1) {
    if (notes[i] - x > 0) return notes[i];
  }
  return notes[0];
}

/**
 * Quantize a value to the nearest upper note
 * @param  {number} x     target value
 * @param  {Array} notes  List of notes
 * @return {number}       nearest upper note
 *
 * @private
 */
function quantizeCeil(x, notes) {
  for (let i = 0; i < notes.length - 1; i += 1) {
    if (notes[i] - x > 0) return notes[i + 1];
  }
  return notes[0];
}

/**
 * Quantize a value to the nearest note
 * @param  {number} x     target value
 * @param  {Array} notes  List of notes
 * @return {number}       nearest note
 *
 * @private
 */
function quantizeRound(x, notes) {
  for (let i = 0; i < notes.length - 1; i += 1) {
    if (notes[i] - x > 0) {
      return ((notes[i] - x) <= (notes[i + 1] - x)) ? notes[i] : notes[i + 1];
    }
  }
  return notes[0];
}

/**
 * Quantize a scalar or vector stream to a given scale (chromatic by default).
 *
 * @param  {Object} [options={}]
 * @param  {Number} [options.scale='chromatic']  Musical Scale (ex: 'C major')
 *
 * Available scales: aeolian, altered, augmented, augmented heptatonic,
 * balinese, bebop, bebop dominant, bebop locrian, bebop major, bebop minor,
 * chromatic, composite blues, diminished, dorian, dorian #4, double harmonic
 * lydian, double harmonic major, egyptian, enigmatic, flamenco, flat six
 * pentatonic, flat three pentatonic, harmonic major, harmonic minor,
 * hirajoshi, hungarian major, hungarian minor, ichikosucho, in-sen, ionian
 * augmented, ionian pentatonic, iwato, kafi raga, kumoijoshi, leading whole
 * tone, locrian, locrian #2, locrian major, locrian pentatonic, lydian,
 * lydian #5P pentatonic, lydian #9, lydian augmented, lydian diminished, lydian
 * dominant, lydian dominant pentatonic, lydian minor, lydian pentatonic,
 * major, major blues, major flat two pentatonic, major pentatonic, malkos
 * raga, melodic minor, melodic minor fifth mode, melodic minor second mode,
 * minor #7M pentatonic, minor bebop, minor blues, minor hexatonic, minor
 * pentatonic, minor six diminished, minor six pentatonic, mixolydian,
 * mixolydian pentatonic, mystery #1, neopolitan, neopolitan major, neopolitan
 * major pentatonic, neopolitan minor, oriental, pelog, persian, phrygian,
 * piongio, prometheus, prometheus neopolitan, purvi raga, ritusen, romanian
 * minor, scriabin, six tone symmetric, spanish, spanish heptatonic, super
 * locrian pentatonic, todi raga, vietnamese 1, vietnamese 2, whole tone, whole
 * tone pentatonic
 * @param  {Number} [options.mode='round']  Quantization mode: 'round' selects
 * the closest note, 'floor' the closest lower note, 'ceil' the closest higher
 * note.
 * @param  {Number} [options.octavemin=0] Minimum octave
 * @param  {Number} [options.octavemax=10] Maximum octave
 * @param  {Stream} source             Input stream (~midi notes)
 * @return {Stream}                    Quantized stream
 *
 * @see https://github.com/danigb/tonal
 */
export default function quantize(options = {}, source) {
  const attr = validateStream('quantize', specification, source.attr);
  const params = parseParameters(definitions, options);
  const scaleName = params.scale.includes(' ')
    ? params.scale
    : `C ${params.scale}`;
  if (!Scale.exists(scaleName)) {
    throw new Error(`This scale does not exist, See:\n${Scale.names()}`);
  }
  const scale = Scale.notes(scaleName);
  const octaves = Array.from(
    Array((1 + params.octavemax) - params.octavemin),
    (_, i) => i + params.octavemin,
  );
  const midiNotes = octaves
    .map(i => scale.map(x => Note.midi(`${x}${i}`)))
    .reduce((a, x) => a.concat(x), [])
    .filter(x => x && x > 0 && x < 128);
  let quantFunc;
  switch (params.mode) {
    case 'floor':
      quantFunc = quantizeFloor;
      break;
    case 'ceil':
      quantFunc = quantizeCeil;
      break;
    default:
      quantFunc = quantizeRound;
  }
  const f = attr.format === 'scalar'
    ? x => quantFunc(x, midiNotes)
    : frame => frame.map(x => quantFunc(x, midiNotes));
  return withAttr(attr)(map(f, source));
}
