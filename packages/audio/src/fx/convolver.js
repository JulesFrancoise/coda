import * as wavesLoaders from 'waves-loaders';
import { audioContext } from 'waves-audio';
import BaseAudioEffect from '../core/effect';
import parseParameters from '../../../core/src/lib/common/parameters';

/**
 * Parameter definitions
 * @ignore
 */
const definitions = {
  file: {
    type: 'string',
    default: '',
  },
};

/**
 * Convolver audio effect
 */
class Convolver extends BaseAudioEffect {
  constructor(file) {
    super();
    this.loader = new wavesLoaders.AudioBufferLoader();
    this.convolver = audioContext.createConvolver();
    this.input.connect(this.convolver);
    this.convolver.connect(this.wet);
    this.defineParameter('file', file, x => this.load(x), 200);
  }

  /**
   * Load a new audio file
   * @param  {String} filename File name (in /media)
   */
  load(filename) {
    const audioFile = `/media/${filename}.wav`;
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
 * @param  {Object} [options={}]      Convolution parameters
 * @param  {String} [options.file=''] Default audio file
 * @return {Convolver}                Convolution engine
 */
export default function convolver(options = {}) {
  const opts = parseParameters(definitions, options);
  return new Convolver(opts.file);
}
