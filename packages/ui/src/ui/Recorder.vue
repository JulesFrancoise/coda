<template>
  <base-component
    type="recorder"
    :title="legend"
    @pause="paused => this.paused = paused"
    @close="$emit('close')"
  >
    <div slot="toolbar" class="toolbar">
      <div class="button" @click="record">
        <icon :name="recording ? 'stop' : 'circle'" scale="0.5" style="color: red"></icon>
      </div>
      <div class="button" @click="addbuffer">
        <icon name="plus" scale="0.5"></icon>
      </div>
      <div class="buffers">
        <span style="margin-right: 2px;">buffers:</span>
        <div
          v-for="(buffer, idx) in buffers"
          :key="`buffer-idx-${idx}`"
          class="button"
          :class="(parseInt(idx, 10) === bufferIndex) && 'active'"
          @click="bufferIndex = parseInt(idx, 10)"
        >{{ idx }}</div>
      </div>
      <div class="bufferinfo">
        <span style="margin-right: 2px;">buffer #{{ bufferIndex }} => label:</span>
        <input v-model="buffers[bufferIndex].label" @change="setLabel">
        <div class="button" @click="removebuffer">
          <icon name="trash" scale="0.5"></icon>
        </div>
      </div>
    </div>
    <div class="recorder">
      <div class="multibuffer">
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
    </div>
  </base-component>
</template>

<script>
import 'vue-awesome/icons/circle';
import 'vue-awesome/icons/stop';
import 'vue-awesome/icons/plus';
import 'vue-awesome/icons/trash';
import Icon from 'vue-awesome/components/Icon.vue';
import BaseComponent from './BaseComponent.vue';

let recorderId = 0;
let nextBuffer = 2;

export default {
  components: { BaseComponent, Icon },
  data() {
    recorderId += 1;
    return {
      recorderId,
      legend: '',
      recording: false,
      closed: false,
      channels: 1,
      bufferIndex: 1,
      buffers: {
        1: {
          data: [],
          label: '1',
          min: +Infinity,
          max: -Infinity,
        },
      },
      path: [],
      stacked: false,
      fill: 'none',
    };
  },
  methods: {
    setBufferData(data) {
      this.buffers[this.bufferIndex].data = data;
      data.forEach((vector) => {
        const vec = this.channels === 1 ? [vector] : vector;
        const minmax = vec
          .reduce(({ min, max }, x) => ({
            min: Math.min(min, x),
            max: Math.max(max, x),
          }), {
            min: this.buffers[this.bufferIndex].min,
            max: this.buffers[this.bufferIndex].max,
          });
        this.buffers[this.bufferIndex].max = minmax.max;
        this.buffers[this.bufferIndex].min = minmax.min;
      });
      this.updatePath();
    },
    updatePath() {
      const { data, min, max } = this.buffers[this.bufferIndex];
      if (this.channels > 1) {
        const d = Array(this.channels).fill('');
        for (let i = 0; i < this.channels; i += 1) {
          d[i] = data
            .reduce((p, x, j) => {
              const y = 1 - ((x[i] - min) / (max - min));
              return `${p} L${(j * 5) / data.length},${Number.isNaN(y) ? -0.11 : y}`;
            }, '')
            .slice(2);
          d[i] = `${this.pathTemplate[0]}${d[i]}${this.pathTemplate[1]}`;
        }
        this.path = d;
      }
      const d = data
        .reduce((p, x, i) => {
          const y = 1 - ((x - min) / (max - min));
          return `${p} L${(i * 5) / data.length},${Number.isNaN(y) ? -0.11 : y}`;
        }, '')
        .slice(2);
      return [`${this.pathTemplate[0]}${d}${this.pathTemplate[1]}`];
    },
    record() {
      this.recording = !this.recording;
      this.$emit('record', this.recording, this.bufferIndex);
    },
    addbuffer() {
      if (this.recording) this.record();
      this.buffers[nextBuffer] = {
        data: [],
        label: (nextBuffer).toString(),
        min: +Infinity,
        max: -Infinity,
      };
      this.bufferIndex = nextBuffer;
      nextBuffer += 1;
    },
    removebuffer() {
      this.$emit('remove', this.bufferIndex);
      if (Object.keys(this.buffers).length > 1) {
        delete this.buffers[this.bufferIndex];
      } else {
        this.buffers = {
          1: {
            data: [],
            label: '1',
            path: '',
            min: +Infinity,
            max: -Infinity,
          },
        };
        nextBuffer = 2;
      }
      this.bufferIndex = parseInt(Object.keys(this.buffers)[0], 10);
      this.updatePath();
    },
    close() {
      this.closed = true;
    },
    setLabel(e) {
      this.$emit('label', this.bufferIndex, e.target.value);
    },
    color(idx) {
      // const colors = ['#32699c', '#25b478', '#b94250', '#da7524', '#0abb9c', '#a822a3'];
      const colors = ['#50fa7b', '#66d9ef', '#ff79c6', '#ff6400', '#f1fa8c', '#bd93f9'];
      return colors[idx % 6];
    },
  },
  watch: {
    bufferIndex() {
      this.updatePath();
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

<style scoped>
.buffers, .bufferinfo {
  margin: 0 4px;
  padding: 0 4px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  align-content: center;
  height: 16px;
}
.buffers {
  border-left: 2px solid #409be6;
  border-right: 2px solid #409be6;
}
.bufferinfo {
  border-left: 2px solid #22c26b;
  border-right: 2px solid #22c26b;
}
.buffers .button.active {
  background-color: #22c26b;
}
.multibuffer {
  display: flex;
  flex-direction: column;
}
</style>
