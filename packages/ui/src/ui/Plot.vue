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
      <div class="button" :class="stacked && 'active'" @click="changeDisplay('stack')">stacked</div>
      <div class="button" @click="changeDisplay('fill')">{{fill}}</div>
    </div>
    <div class="plot">
      <div class="mintxt">{{min}}</div>
      <div class="maxtxt">{{max}}</div>
      <canvas
        ref="canvas"
        width="700"
        height="100"
        style="width: 100%; height: 100px"
      ></canvas>
      <canvas
        ref="tmpCanvas"
        width="700"
        height="100"
        style="display: none;"
      ></canvas>
    </div>
  </base-component>
</template>

<script>
import BaseComponent from './BaseComponent.vue';

export default {
  components: { BaseComponent },
  mounted() {
    this.canvas = this.$refs.canvas;
    this.context = this.canvas.getContext('2d');
    this.tmpCanvas = this.$refs.tmpCanvas;
    this.tmpContext = this.tmpCanvas.getContext('2d');
    this.updateCanvasDims();
  },
  data() {
    return {
      legend: '',
      paused: false,
      channels: 1,
      length: 500,
      buffer: Array(500).fill(NaN),
      min: +Infinity,
      max: -Infinity,
      stacked: false,
      fill: false,
      fillPos: 0,
      previousFrame: [101],
    };
  },
  watch: {
    channels(k) {
      this.buffer = Array.from(new Array(this.length), () => new Array(k).fill(NaN));
      this.previousFrame = Array.from(Array(k), () => 101);
      this.min = +Infinity;
      this.max = -Infinity;
    },
    length(n) {
      if (this.buffer.length > n) {
        this.buffer.splice(0, this.buffer.length - n);
      } else {
        const zeros = Array.from(
          Array(n - this.buffer.length),
          () => Array(this.channels).fill(NaN),
        );
        this.buffer = zeros.concat(this.buffer);
      }
      this.updateCanvasDims();
    },
    fill(mode) {
      const scale = this.stacked ? this.canvas.height / this.channels : this.canvas.height;
      if (mode === 'top') {
        this.fillPos = scale;
      } else if (mode === 'middle') {
        this.fillPos = (0.5 * scale);
      } else {
        this.fillPos = 0;
      }
    },
  },
  methods: {
    push(elements) {
      if (this.paused) return;
      const n = elements.length;
      const { width, height } = this.canvas;

      // Draw the previous image on tmpCanvas
      this.tmpContext.drawImage(this.canvas, 0, 0, width, height);
      // Fill the new area in the main context
      this.context.fillStyle = '#000620';
      this.context.fillRect(width - ((n + 1) * this.dx), 0, ((n + 1) * this.dx), height);

      // Update Min/Max
      elements.forEach((frame) => {
        const vec = this.channels === 1 ? [frame] : frame;
        const minmax = vec
          .reduce(({ min, max }, x) => ({
            min: Math.min(min, x),
            max: Math.max(max, x),
          }), { min: this.min, max: this.max });
        this.max = minmax.max;
        this.min = minmax.min;
        if (this.min >= this.max) {
          this.min = 0;
          this.max = 1;
        }
      });

      // Draw new lines
      this.context.lineJoin = 'round';
      this.context.lineWidth = 2;
      for (let channel = 0; channel < this.channels; channel += 1) {
        const scale = this.stacked ? height / this.channels : height;
        const offset = this.stacked ? height - ((this.channels - channel - 1) * scale) : height;
        this.context.beginPath();
        this.context.strokeStyle = this.color(channel);
        if (this.fill !== 'none') {
          this.context.fillStyle = this.color(channel);
          this.context.moveTo(
            width - (n * this.dx),
            offset - this.fillPos,
          );
          this.context.lineTo(
            width - (n * this.dx),
            this.previousFrame[channel],
          );
        } else {
          this.context.moveTo(
            width - (n * this.dx),
            this.previousFrame[channel],
          );
        }
        for (let i = 0; i < n; i += 1) {
          const y = this.channels === 1 ? elements[i] : elements[i][channel];
          const yp = ((y - this.min)) / (this.max - this.min);
          const px = width - ((n - i - 1) * this.dx);
          const py = offset - (yp * scale);
          this.previousFrame[channel] = py;
          this.context.lineTo(px, py);
        }
        if (this.fill !== 'none') {
          this.context.lineTo(
            width,
            offset - this.fillPos,
          );
          this.context.closePath();
          this.context.fill();
        }
        this.context.stroke();
      }

      this.context.translate(-n * this.dx, 0);
      // draw prev canvas before translation
      this.context.drawImage(this.tmpCanvas, 0, 0, width, height, 0, 0, width, height);
      // reset transformation matrix
      this.context.setTransform(1, 0, 0, 1, 0, 0);
    },
    updateCanvasDims() {
      this.canvas.width = Math.ceil(700 / this.length) * this.length;
      this.tmpCanvas.width = Math.ceil(700 / this.length) * this.length;
      this.canvas.height = Math.floor(this.canvas.width / 7);
      this.tmpCanvas.height = Math.floor(this.tmpCanvas.width / 7);
    },
    changeLength(factor) {
      this.length = Math.floor(this.length * factor);
    },
    color(idx) {
      // const colors = ['#32699c', '#25b478', '#b94250', '#da7524', '#0abb9c', '#a822a3'];
      const colors = ['#50fa7b', '#66d9ef', '#ff79c6', '#ff6400', '#f1fa8c', '#bd93f9'];
      return colors[idx % 6];
    },
    changeDisplay(type) {
      if (type === 'stack') {
        this.stacked = !this.stacked;
      } else if (type === 'fill') {
        if (this.fill === 'none') {
          this.fill = 'bottom';
        } else if (this.fill === 'bottom') {
          this.fill = 'middle';
        } else if (this.fill === 'middle') {
          this.fill = 'top';
        } else {
          this.fill = 'none';
        }
      }
    },
  },
  computed: {
    dx() {
      return this.canvas.width / this.length;
    },
  },
};
</script>

<style scoped>
.mintxt, .maxtxt {
  font-size: 9px;
  position: absolute;
  margin-top: 3px;
  margin-left: 3px;
}
.mintxt {
  margin-top: 94px;
}
</style>
