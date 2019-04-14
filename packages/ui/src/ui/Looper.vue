<template>
  <base-component
    type="looper"
    :title="legend"
    @pause="paused => this.paused = paused"
    @close="$emit('close')"
  >
    <div slot="toolbar" class="toolbar">
      <div
        class="button"
        :class="!playing && !recording && 'active'"
        @click="thru"
      >thru</div>
      <div
        class="button"
        :class="recording && 'active'"
        @click="record"
      >record</div>
      <div
        class="button"
        :class="playing && 'active'"
        @click="play"
      >play</div>
    </div>
    <div class="looper">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        :viewBox="`0, -0.1, 5, 1.1`"
        preserveAspectRatio="none"
        style="width: 100%; height: 100px;"
      >
        <g
          v-for="(d, i) in path"
          :key="`path${i}`"
          :transform="stacked && `translate(0 ${i / channels}) scale(1, ${1 / channels})`"
        >
          <path
            :d="d"
            :stroke="color(i)"
            :fill="fill !== 'none' ? color(i) : 'none'"
            stroke-width="0.02"
          />
        </g>
      </svg>
    </div>
  </base-component>
</template>

<script>
import BaseComponent from './BaseComponent.vue';

let plotId = 0;

export default {
  components: { BaseComponent },
  data() {
    plotId += 1;
    return {
      plotId,
      legend: '',
      recording: false,
      playing: false,
      channels: 1,
      buffer: [],
      path: [''],
      min: +Infinity,
      max: -Infinity,
      stacked: false,
      fill: 'none',
    };
  },
  methods: {
    setBufferData(data) {
      this.buffer = data;
      data.forEach((vector) => {
        const vec = this.channels === 1 ? [vector] : vector;
        const minmax = vec
          .reduce(({ min, max }, x) => ({
            min: Math.min(min, x),
            max: Math.max(max, x),
          }), {
            min: this.min,
            max: this.max,
          });
        this.max = minmax.max;
        this.min = minmax.min;
      });
      this.updatePath();
    },
    updatePath() {
      const { min, max, buffer: buf } = this;
      if (this.channels > 1) {
        const d = Array(this.channels).fill('');
        for (let i = 0; i < this.channels; i += 1) {
          d[i] = buf
            .reduce((p, x, j) => {
              const y = 1 - ((x[i] - min) / (max - min));
              return `${p} L${(j * 5) / buf.length},${Number.isNaN(y) ? -0.11 : y}`;
            }, '')
            .slice(2);
          d[i] = `${this.pathTemplate[0]}${d[i]}${this.pathTemplate[1]}`;
        }
        this.path = d;
      }
      const d = buf
        .reduce((p, x, i) => {
          const y = 1 - ((x - min) / (max - min));
          return `${p} L${(i * 5) / buf.length},${Number.isNaN(y) ? -0.11 : y}`;
        }, '')
        .slice(2);
      return [`${this.pathTemplate[0]}${d}${this.pathTemplate[1]}`];
    },
    thru() {
      if (this.recording) this.$emit('record', false);
      this.recording = false;
      if (this.playing) this.$emit('play', false);
      this.playing = false;
    },
    record() {
      if (this.playing) this.$emit('play', false);
      this.playing = false;
      if (!this.recording) this.$emit('record', true);
      this.recording = true;
    },
    play() {
      if (this.recording) this.$emit('record', false);
      this.recording = false;
      if (!this.playing) this.$emit('play', true);
      this.playing = true;
    },
    color(idx) {
      // const colors = ['#32699c', '#25b478', '#b94250', '#da7524', '#0abb9c', '#a822a3'];
      const colors = ['#50fa7b', '#66d9ef', '#ff79c6', '#ff6400', '#f1fa8c', '#bd93f9'];
      return colors[idx % 6];
    },
  },
  computed: {
    pathTemplate() {
      if (this.fill === 'none') return ['M ', ''];
      if (this.fill === 'bottom') return ['M 0,1 L', ' L5,1 z'];
      if (this.fill === 'top') return ['M 0,0 L', ' L5,0 z'];
      return ['M 0,0.5 L', ' L5,0.5 z'];
    },
  },
};
</script>
