<template>
  <base-component
    type="plot"
    :title="legend"
    @pause="paused => this.paused = paused"
    @close="$emit('close')"
  >
    <div slot="toolbar" class="toolbar">
      <div class="button" @click="changeLength(2)">* 2</div>
      <div class="button" @click="changeLength(0.5)">/ 2</div>
    </div>
    <div class="plot">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        :viewBox="`0, -0.1, 5, 1.1`"
        preserveAspectRatio="none"
        style="width: 100%; height: 100px;"
      >
        <defs>
          <linearGradient :id="`mars-plot-${plotId}-1`" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#25b478"></stop>
            <stop offset="1" stop-color="#32699c"></stop>
          </linearGradient>
          <linearGradient :id="`mars-plot-${plotId}-2`" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#b97742"></stop>
            <stop offset="1" stop-color="#b94250"></stop>
          </linearGradient>
          <linearGradient :id="`mars-plot-${plotId}-3`" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#949e25"></stop>
            <stop offset="1" stop-color="#338b2b"></stop>
          </linearGradient>
          <linearGradient :id="`mars-plot-${plotId}-4`" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#71c918"></stop>
            <stop offset="1" stop-color="#c7b121"></stop>
          </linearGradient>
        </defs>
        <g
          v-for="(d, i) in path"
          :key="`path${i}`"
          :transform="stacked && `translate(0 ${i / channels}) scale(1, ${1 / channels})`"
        >
          <path
            :d="d"
            :stroke="`url(#mars-plot-${plotId}-${i % 4 + 1})`"
            :fill="fill !== 'none' ? `url(#mars-plot-${plotId}-${i % 4 + 1})` : 'none'"
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
      paused: false,
      channels: 1,
      length: 500,
      buffer: Array(500).fill(NaN),
      min: +Infinity,
      max: -Infinity,
      stacked: false,
      fill: 'none',
    };
  },
  watch: {
    channels(k) {
      this.buffer = Array.from(new Array(this.length), () =>
        new Array(k).fill(NaN));
      this.min = +Infinity;
      this.max = -Infinity;
    },
    length(n) {
      if (this.buffer.length > n) {
        this.buffer.splice(0, this.buffer.length - n);
      } else {
        const zeros = Array.from(Array(n - this.buffer.length), () =>
          Array(this.channels).fill(NaN));
        this.buffer = zeros.concat(this.buffer);
      }
    },
  },
  methods: {
    push(elements) {
      if (this.paused) return;
      elements.forEach((vector) => {
        // const vec = this.channels === 1 ? [vector] : vector;
        this.buffer.shift();
        this.buffer.push(vector);
        const minmax = vector
          .reduce(({ min, max }, x) => ({
            min: Math.min(min, x),
            max: Math.max(max, x),
          }), { min: this.min, max: this.max });
        this.max = minmax.max;
        this.min = minmax.min;
      });
    },
    changeLength(factor) {
      this.length = Math.floor(this.length * factor);
    },
  },
  computed: {
    pathTemplate() {
      if (this.fill === 'none') {
        return ['M ', ''];
      } else if (this.fill === 'bottom') {
        return ['M 0,1 L', ' L5,1 z'];
      } else if (this.fill === 'top') {
        return ['M 0,0 L', ' L5,0 z'];
      }
      return ['M 0,0.5 L', ' L5,0.5 z'];
    },
    path() {
      if (this.channels > 1) {
        const d = Array(this.channels).fill('');
        for (let i = 0; i < this.channels; i += 1) {
          d[i] = this.buffer
            .reduce((p, x, j) => {
              const y = 1 - ((x[i] - this.min) / (this.max - this.min));
              return `${p} L${(j * 5) / this.length},${Number.isNaN(y) ? -0.11 : y}`;
            }, '')
            .slice(2);
          d[i] = `${this.pathTemplate[0]}${d[i]}${this.pathTemplate[1]}`;
        }
        return d;
      }
      const d = this.buffer
        .reduce((p, x, i) => {
          const y = 1 - ((x - this.min) / (this.max - this.min));
          return `${p} L${(i * 5) / this.length},${Number.isNaN(y) ? -0.11 : y}`;
        }, '')
        .slice(2);
      return [`${this.pathTemplate[0]}${d}${this.pathTemplate[1]}`];
    },
  },
};
</script>
