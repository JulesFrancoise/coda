import * as wavesLoaders from 'waves-loaders';
import { audioContext } from 'waves-audio';
import { parseParameters } from '@coda/prelude';
import BaseAudioEffect from '../core/effect';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  file: {
    type: 'string',
    default: '',
  },
  filePrefix: {
    type: 'string',
    default: '/media/',
  },
  fileExt: {
    type: 'string',
    default: 'flac',
  },
};

/**
 * Convolver audio effect
 */
class Convolver extends BaseAudioEffect {
  constructor(options) {
    super();
    this.loader = new wavesLoaders.AudioBufferLoader();
    this.filePrefix = options.filePrefix;
    this.fileExt = options.fileExt;
    this.convolver = audioContext.createConvolver();
    this.input.connect(this.convolver);
    this.convolver.connect(this.wet);
    this.defineParameter('file', options.file, x => this.load(x), 200);
  }

  /**
   * Load a new audio file
   * @param  {String} filename File name (in /media)
   */
  load(filename) {
    const audioFile = `${this.filePrefix}${filename}.${this.fileExt}`;
    this.loader.load(audioFile).then((loaded) => {
      this.convolver.buffer = loaded;
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log('[convolver] Error loading file: ', err);
    });
  }
}

/**
 * Create a Convolver effect
 *
 * @param  {Object} [options={}]            Convolution parameters
 * @param  {String} [options.file='']       Default audio file
 * @param  {String} [options.filePrefix=''] Address where audio files are stored
 * @param  {String} [options.fileExt='']    Audio files extension
 * @return {Convolver}                      Convolution engine
 */
export default function convolver(options = {}) {
  const opts = parseParameters(definitions, options);
  return new Convolver(opts);
}
