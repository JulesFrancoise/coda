const AudioContext = window.AudioContext || window.webkitAudioContext;

/**
 * Expose a unique audio context singleton as the default audio
 * context used by the components of the Waves Audio library and
 * applications using the library.
 *
 * @type AudioContext
 * @name audioContext
 * @constant
 * @global
 * @instance
 *
 * @example
 * import * as audio from 'waves-audio';
 * const audioContext = audio.audioContext;
 */

if (!AudioContext) {
  throw new Error('AudioContext is not available');
}

console.log('Creating an audio context');
const audioContext = new AudioContext();

if (/(iPhone|iPad)/i.test(navigator.userAgent) && audioContext.sampleRate < 44100) {
  const buffer = audioContext.createBuffer(1, 1, 44100);
  const dummy = audioContext.createBufferSource();
  dummy.buffer = buffer;
  dummy.connect(audioContext.destination);
  dummy.start(0);
  dummy.disconnect();
}

export default audioContext;
