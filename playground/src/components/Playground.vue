<template>
  <div
    class="playground"
    :style="`width: ${width}; height: ${height}; ${vertical && 'flex-direction: column'};`"
  >
    <div
      class="left"
      :style="vertical ? 'width: 100%; height: 50%;' : `width: calc(50% + ${offset}px)`"
      v-if="editable"
    >
      <editor
        :value="value"
        @value="x => $emit('value', x)"
        @run="run"
      />
      <div class="console" :class="consoleError && 'error'">{{consoleMsg}}</div>
      <div id="meter"></div>
    </div>
    <div
      id="splitbar"
      class="splitbar"
      @mousedown.stop="selectSplit"
      @touchdown.stop="selectSplit"
      v-if="editable && !vertical"
    ></div>
    <div
      id="ui"
      class="ui"
      :style="(vertical || !editable) ? 'width: 100%;' : `width: calc(50% - ${offset}px)`"
    ></div>
  </div>
</template>

<script>
import createSandbox, { Master } from '@coda/sandbox';
import webAudioPeakMeter from 'web-audio-peak-meter';
import Editor from './Editor';

export default {
  name: 'Playground',
  components: {
    Editor,
  },
  props: {
    value: {
      type: String,
      default: '// Welcome to the playground...',
    },
    editable: {
      type: Boolean,
      default: true,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '100%',
    },
  },
  data() {
    return {
      consoleMsg: '',
      consoleError: false,
      offset: 0,
      drag: false,
      dragRefX: 0,
      dragRefY: 0,
    };
  },
  mounted() {
    this.runSnippet = createSandbox('ui', (msg, isError) => {
      this.consoleMsg = msg;
      if (isError) {
        this.consoleError = true;
        setTimeout(() => {
          this.consoleError = false;
        }, 200);
      }
    });
    document.documentElement.addEventListener('mousemove', this.move);
    document.documentElement.addEventListener('mouseup', this.up);
    document.documentElement.addEventListener('mouseleave', this.up);
    document.documentElement.addEventListener('touchmove', this.move, true);
    document.documentElement.addEventListener('touchend touchcancel', this.up, true);
    document.documentElement.addEventListener('touchstart', this.up, true);

    document.documentElement.addEventListener('mousedown', this.mousedown, true);

    const myMeterElement = document.getElementById('meter');
    const meterNode = webAudioPeakMeter.createMeterNode(Master.masterGainNode, Master.audioContext);
    webAudioPeakMeter.createMeter(myMeterElement, meterNode, {
      borderSize: 0,
      fontSize: 8,
      backgroundColor: '#0C1021',
      tickColor: 'transparent',
      gradient: ['red 2%', '#ff0 16%', 'lime 45%', '#080 100%'],
      maskTransition: '0.2s',
    });
  },
  beforeDestroy() {
    document.documentElement.removeEventListener('mousemove', this.move);
    document.documentElement.removeEventListener('mouseup', this.up);
    document.documentElement.removeEventListener('mouseleave', this.up);
    document.documentElement.removeEventListener('touchmove', this.move, true);
    document.documentElement.removeEventListener('touchend touchcancel', this.up, true);
    document.documentElement.removeEventListener('touchstart', this.up, true);
  },
  methods: {
    selectSplit(e) {
      this.drag = true;
      this.dragRefX = e.clientX - this.offset;
    },
    move(e) {
      if (!this.drag) return;
      this.offset = e.clientX - this.dragRefX;
      e.stopPropagation();
    },
    up() {
      if (this.drag) {
        this.drag = false;
      }
    },
    run(code) {
      this.runSnippet(code);
    },
    mousedown() {
      Master.audioContext.resume();
      document.documentElement.removeEventListener('mousedown', this.mousedown, true);
    },
  },
};
</script>

<style>
.playground {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  background-color: #0C1021;
}

.left {
  width: 50%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.console {
  width: 100%;
  display: block;
  box-sizing: border-box;
  padding-left: 30px;
  padding-top: 4px;
  height: 20px;
  background-color: #000620;
  color: #6d8a88;
  transition: background-color 1s linear;
  font-family: monospace;
}

.console.error {
  background-color: #a63131;
  transition: background-color 0s linear;
}

.console::before {
  content: '> ';
  left: 10px;
  bottom: 4px;
  position: absolute;
  color: #6d8a88;
}

#splitbar {
  width: 1px;
  display: block;
  background-color: #3c4972;
  cursor: col-resize;
  z-index: 3;
}

#ui {
  position: relative;
  width: calc(50% - 3px);
  padding-right: 8px;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

#meter {
  position: absolute;
  left: -16px;
  bottom: 0;
  width: 18px;
  height: 100%;
  z-index: 5;
}
</style>
