import { audioContext } from 'waves-audio';

const masterGainNode = audioContext.createGain();
masterGainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
masterGainNode.connect(audioContext.destination);

export { audioContext };

export default {
  masterGainNode,
  audioContext,
  set gain(value) {
    masterGainNode.gain.setValueAtTime(value, audioContext.currentTime);
  },
  get gain() {
    return masterGainNode.gain.value;
  },
};
