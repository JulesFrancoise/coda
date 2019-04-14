<template>
  <base-component
    type="heatmap"
    :title="legend"
    @pause="paused => this.paused = paused"
    @close="$emit('close')"
  >
    <div slot="toolbar" class="toolbar">
      <div class="button" @click="changeLength(2)">* 2</div>
      <div class="button" @click="changeLength(0.5)">/ 2</div>
    </div>
    <div class="heatmap">
      <canvas
        ref="canvas"
        style="width: 100%; height: 100px"
      ></canvas>
      <canvas
        ref="tmpCanvas"
        style="display: none;"
      ></canvas>
    </div>
  </base-component>
</template>

<script>
import colormap from 'colormap';
import BaseComponent from './BaseComponent.vue';

export default {
  components: { BaseComponent },
  mounted() {
    this.canvas = this.$refs.canvas;
    this.context = this.canvas.getContext('2d');
    this.tmpCanvas = this.$refs.tmpCanvas;
    this.tmpContext = this.tmpCanvas.getContext('2d');
    this.colors = colormap({
      colormap: 'cubehelix',
      nshades: 100,
      format: 'hex',
      alpha: 1,
    });
    [this.context.fillStyle] = this.colors;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  },
  data() {
    return {
      legend: '',
      paused: false,
      channels: 1,
      length: 500,
      min: +Infinity,
      max: -Infinity,
    };
  },
  computed: {
    dx() {
      return this.canvas.width / this.length;
    },
    dy() {
      return this.canvas.height / this.channels;
    },
  },
  watch: {
    channels(k) {
      this.buffer = Array.from(
        Array(this.length),
        () => (k === 1 ? NaN : Array(k).fill(NaN)),
      );
    },
    length(n) {
      if (this.buffer.length > n) {
        this.buffer.splice(0, this.buffer.length - n);
      } else {
        const zeros = Array.from(
          Array(n - this.buffer.length),
          () => (this.channels === 1 ? NaN : Array(this.channels).fill(NaN)),
        );
        this.buffer = zeros.concat(this.buffer);
      }
    },
  },
  methods: {
    push(elements) {
      if (this.paused) return;
      const { width, height } = this.canvas;

      this.tmpContext.drawImage(this.canvas, 0, 0, width, height);

      const n = elements.length;
      elements.forEach((vector, i) => {
        const vec = this.channels === 1 ? [vector] : vector;
        const minmax = vec
          .reduce(({ min, max }, x) => ({
            min: Math.min(min, x),
            max: Math.max(max, x),
          }), { min: this.min, max: this.max });
        this.max = minmax.max;
        this.min = minmax.min;
        vec.forEach((x, j) => {
          const v = ((x - this.min) * 100) / (this.max - this.min);
          this.context.fillStyle = this.colors[Math.trunc(v)];
          this.context.fillRect(
            width - ((n - i) * this.dx),
            height - (j * this.dy),
            this.dx,
            this.dy,
          );
        });
      });

      this.context.translate(-n * this.dx, 0);
      // // draw prev canvas before translation
      this.context.drawImage(this.tmpCanvas, 0, 0, width, height, 0, 0, width, height);
      // // reset transformation matrix
      this.context.setTransform(1, 0, 0, 1, 0, 0);
    },
    changeLength(factor) {
      this.length = Math.floor(this.length * factor);
    },
  },
};
</script>
