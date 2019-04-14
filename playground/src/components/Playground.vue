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
import createSandbox from '@coda/sandbox';
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
  },
};
</script>

<style>
.playground {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  background-color: rgb(39, 40, 34);
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
  background-color: #1a1b16;
  color: #d0d0d0;
  transition: background-color 1s linear;
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
  color: #0f5998;
}

#splitbar {
  width: 3px;
  display: block;
  background-color: black;
  cursor: col-resize;
  z-index: 3;
}

#ui {
  width: calc(50% - 3px);
  padding-right: 8px;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
</style>
