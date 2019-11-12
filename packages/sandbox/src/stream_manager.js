import { currentTime } from '@most/scheduler';
import {
  newDefaultScheduler,
  multicast,
  until,
  runEffects,
} from '@coda/core';

function isObject(o) {
  return o !== null && typeof o === 'object';
}

export default class StreamManager {
  constructor(context) {
    this.context = context;
    this.scheduler = newDefaultScheduler();
  }

  getObjRef(path) {
    const p = [...path];
    if (p.length > 0) {
      const x = p.pop();
      return this.getObjRef(p)[x];
    }
    return this.context;
  }

  setObjRef(path, value) {
    if (path.length <= 1) {
      throw new Error('Path must have at least one arguments');
    }
    if (path.length === 1) {
      this.context[path[0]] = value;
    }
    const last = path[path.length - 1];
    const prefix = this.getObjRef(path.slice(0, path.length - 1));
    prefix[last] = value;
  }

  exists(streamId) {
    return Object.keys(this.context.streams).includes(streamId);
  }

  find(stream) {
    const streamId = Object.values(this.context.streams)
      .filter(x => x.stream === stream)
      .map(x => x.id);
    return (streamId && streamId[0]) || null;
  }

  cancel(streamId) {
    if (Object.keys(this.context.streams).includes(streamId)) {
      this.context.streams[streamId].cancel();
    }
  }

  start(arg) {
    if (typeof arg !== 'string') {
      throw new Error('StreamManager\'s Method `start` takes a string argument');
    }
    const target = this.context[arg];
    if (Array.isArray(target)) {
      const streams = target.filter(x => isObject(x) && x.isStream);
      streams.forEach((stream, i) => {
        const streamId = `${arg}.${i}`;
        this.startOne(streamId, [arg, i]);
      });
      target.stop = () => {
        this.stop(arg);
      };
    } else if (isObject(target) && !target.isStream) {
      Object.keys(target)
        .filter(x => target[x] && target[x].isStream)
        .forEach((x) => {
          const streamId = `${arg}.${x}`;
          this.startOne(streamId, [arg, x]);
        });
      target.stop = () => {
        this.stop(arg);
      };
    } else {
      this.startOne(arg);
    }
  }

  /**
   * Start a stream: run effects on a most-type stream
   * @private
   * @param  {object} sandbox the Node VM context
   * @return {function}       [description]
   */
  async startOne(streamId, path = undefined) {
    const stream = path ? this.getObjRef(path) : this.context[streamId];
    if (!stream || !stream.isStream) return;
    // If a stream with the same name already exists, cancel it.
    await this.stopOne(streamId);
    // Store stream information in the sandbox
    this.context.streams[streamId] = { id: streamId };
    // Create a "canceller" stream to interrupt the processing when necessary
    const cancellerStream = {
      run: (sink, scheduler) => {
        this.context.streams[streamId].cancel = () => {
          try {
            sink.event(currentTime(scheduler), null);
          } catch (e) {
            sink.error(currentTime(scheduler), e);
          }
        };
        return {
          dispose() {},
        };
      },
    };
    // Multicast the stream (for multiple sinks) and merge with the canceller stream
    if (path) {
      this.setObjRef(path, multicast(until(cancellerStream, stream)));
    } else {
      this.context[streamId] = multicast(until(cancellerStream, stream));
    }
    const s = path ? this.getObjRef(path) : this.context[streamId];
    s.stop = () => this.stopOne(streamId);
    // Run the stream
    const effects = runEffects(s, this.scheduler)
      .then(() => {
        const elt = this.context.doc.getElementById(`stream-display-${streamId}`);
        if (elt) {
          elt.remove();
        }
        delete this.context.streams[streamId];
        delete this.context[streamId];
      });
    this.context.streams[streamId].stream = this.context[streamId];
    this.context.streams[streamId].effects = effects;
    const newDiv = document.createElement('div');
    newDiv.appendChild(document.createTextNode(streamId));
    newDiv.setAttribute('class', 'stream');
    newDiv.setAttribute('id', `stream-display-${streamId}`);
    const elt = this.context.doc.getElementById('streams');
    if (elt) {
      elt.appendChild(newDiv);
    }
  }

  stop(arg) {
    if (typeof arg !== 'string') {
      throw new Error('StreamManager\'s Method `stop` takes a string argument');
    }
    const target = this.context[arg];
    if (!target) return null;
    if (Array.isArray(target)) {
      const streamIds = target.filter(x => isObject(x) && x.isStream)
        .map((_, i) => `${arg}.${i}`);
      return this.stopMany(streamIds);
    }
    if (isObject(target) && !target.isStream) {
      const streamIds = Object.keys(target)
        .filter(x => target[x] && target[x].isStream)
        .map(x => `${arg}.${x}`);
      return this.stopMany(streamIds);
    }
    return this.stopOne(arg);
  }

  stopOne(stream) {
    const streamId = (typeof stream === 'string')
      ? stream
      : this.find(stream);
    if (streamId && this.exists(streamId)) {
      this.cancel(streamId);
      return this.context.streams[streamId].effects;
    }
    return null;
  }

  stopMany(streamIds) {
    const canceledStreams = streamIds
      .filter(streamId => this.exists(streamId))
      .map(streamId => this.stopOne(streamId));
    return Promise.all(canceledStreams);
  }

  clear() {
    const proms = Object.keys(this.context.streams).map((streamId) => {
      this.cancel(streamId);
      return this.context.streams[streamId].effects;
    });
    return Promise.all(proms);
  }
}
