import { currentTime } from '@most/scheduler';
import { audioContext } from '../core/master';

/**
 * Try to propagate an event or propagate an error to the stream
 * @ignore
 */
function tryEvent(t, x, sink) {
  try {
    sink.event(t, x);
  } catch (e) {
    sink.error(t, e);
  }
}

class MeterSource {
  constructor(sink, scheduler, sourceNode) {
    this.sink = sink;
    this.scheduler = scheduler;
    this.channelCount = sourceNode.channelCount;
    this.meterNode = audioContext.createScriptProcessor(512, this.channelCount, this.channelCount);
    sourceNode.connect(this.meterNode);
    this.meterNode.connect(audioContext.destination);
    this.meterNode.onaudioprocess = this.updateMeter.bind(this);
  }

  updateMeter(audioProcessingEvent) {
    const { inputBuffer } = audioProcessingEvent;
    const channelData = [];
    const channelMaxes = [];
    for (let i = 0; i < this.channelCount; i += 1) {
      channelData[i] = inputBuffer.getChannelData(i);
      channelMaxes[i] = 0.0;
    }
    for (let sample = 0; sample < inputBuffer.length; sample += 1) {
      for (let i = 0; i < this.channelCount; i += 1) {
        if (Math.abs(channelData[i][sample]) > channelMaxes[i]) {
          channelMaxes[i] = Math.abs(channelData[i][sample]);
        }
      }
    }
    tryEvent(currentTime(this.scheduler), channelMaxes, this.sink);
  }
}

export default function meter(audioSource) {
  let sourceNode;
  if (audioSource.isSynth) {
    sourceNode = audioSource.output;
  } else if (audioSource instanceof AudioNode) {
    sourceNode = audioSource;
  } else {
    throw new Error('Meter works with either synths or AudioNodes');
  }
  return {
    attr: {
      format: 'vector',
      size: sourceNode.channelCount,
      samplerate: 86.13,
    },
    run(sink, scheduler) {
      const m = new MeterSource(sink, scheduler, sourceNode);
      return {
        dispose() {
          sourceNode.disconnect(m.meterNode);
        },
      };
    },
  };
}
