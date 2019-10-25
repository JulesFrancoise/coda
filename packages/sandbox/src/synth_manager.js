function isObject(o) {
  return o !== null && typeof o === 'object';
}

export default class SynthManager {
  constructor(context) {
    this.context = context;
  }

  exists(synthId) {
    return Object.keys(this.context.synths).includes(synthId);
  }

  start(arg) {
    if (typeof arg !== 'string') {
      throw new Error('SynthManager\'s Method `start` takes a string argument');
    }
    const target = this.context[arg];
    if (Array.isArray(target)) {
      const synths = target.filter(x => isObject(x) && x.isSynth);
      synths.forEach((synth, i) => {
        const synthId = `${arg}_arr_${i}`;
        this.context[synthId] = synth;
        this.startOne(synthId);
      });
      target.stop = () => {
        this.stop(arg);
      };
    } else {
      this.startOne(arg);
    }
  }

  startOne(synthId) {
    const synth = this.context[synthId];
    if (!synth || !synth.isSynth) return;
    if (this.exists(synthId)) {
      this.stop(synthId);
    }
    this.context[synthId] = synth;
    this.context.synths[synthId] = {
      id: synthId,
      synth,
    };
  }

  stop(arg) {
    if (typeof arg !== 'string') {
      throw new Error('SynthManager\'s Method `stop` takes a string argument');
    }
    const target = this.context[arg];
    if (!target) return null;
    if (Array.isArray(target)) {
      const synthIds = target.filter(x => isObject(x) && x.isSynth)
        .map((_, i) => `${arg}_arr_${i}`);
      return this.stopMany(synthIds);
    }
    return this.stopOne(arg);
  }

  stopOne(synthId) {
    if (Object.keys(this.context.synths).includes(synthId)) {
      this.context.synths[synthId].synth.dispose();
      delete this.context.synths[synthId];
      delete this.context[synthId];
    }
  }

  stopMany(synthIds) {
    synthIds
      .filter(synthId => this.exists(synthId))
      .forEach(synthId => this.stopOne(synthId));
  }

  clear() {
    const syns = Object.keys(this.context.synths);
    syns.forEach((synthId) => {
      this.context.synths[synthId].synth.dispose();
      delete this.context.synths[synthId];
      delete this.context[synthId];
    });
  }
}
