<template>
  <div class="coda-code-example">
    <div class="editor">
      <slot />
      <!-- <pre class="language-js"><code class="language-js" v-html="prismCode"></code></pre> -->
      <button
        @click="running ? stop() : run()"
        :type="running ? 'danger' : 'success'"
      >
        {{running ? 'stop' : 'run'}}
      </button>
    </div>
    <div v-show="running" style="position: relative;">
      <div class="console" :class="consoleError && 'error'">{{consoleMsg}}</div>
      <div :id="uiContainer" class="ui"></div>
    </div>
  </div>
</template>

<script>
/* global sandbox */
export default {
  name: 'CodeExample',
  data() {
    const uiContainer = 'ui-xxxxxxxxxxxx'.replace(
      /[x]/g,
      () => (Math.random() * 16 | 0).toString(16),
    );
    return {
      uiContainer,
      running: false,
      consoleMsg: '',
      consoleError: false,
    };
  },
  computed: {
    code() {
      return this.$slots.default[0].elm.innerText;
    },
  },
  mounted() {
    document.documentElement.addEventListener('mousedown', this.mousedown, true);
  },
  methods: {
    run() {
      this.runSnippet = sandbox.createSandbox(this.uiContainer, (msg, isError) => {
        this.consoleMsg = msg;
        if (isError) {
          this.consoleError = true;
          setTimeout(() => {
            this.consoleError = false;
          }, 200);
        }
      });
      this.runSnippet(this.code.replace(/console.log/g, 'log'));
      this.running = true;
    },
    stop() {
      this.runSnippet('clear();');
      this.running = false;
    },
    mousedown() {
      sandbox.Master.audioContext.resume();
      console.log('sandbox.Master', sandbox.Master);
      document.documentElement.removeEventListener('mousedown', this.mousedown, true);
    },
  },
};
</script>

<style scoped>
.coda-code-example {
  width: 100%;
  border-radius: 5px;
  overflow: hidden;
  padding: 0;
  position: relative;
  z-index: 0;
}

.coda-code-example .editor {
  position: relative;
  z-index: 2;
}

.coda-code-example .editor button {
  position: absolute;
  right: 10px;
  bottom: 10px;
  background-color: #7ec699;
  color: #fff;
  padding-left: 0.8rem;
  padding-right: 0.8rem;
  padding-top: .3rem;
  padding-bottom: .3rem;
  font-weight: 700;
  border-radius: .25rem;
  cursor: pointer;
  text-align: center;
  text-transform: none;
  overflow: visible;
  margin: 0;
  border: 0 solid #e2e8f0;
  z-index: 6;
}

.coda-code-example .editor button:hover {
  background-color: #41885c;
}

.coda-code-example pre[class*="language-"] {
  margin: 0;
}

.coda-code-example .console {
  width: 100%;
  display: block;
  box-sizing: border-box;
  min-height: 28px;
  padding-left: 30px;
  padding-top: 14px;
  padding-bottom: 4px;
  font-size: 14px;
  background-color: #1a1b16;
  color: #d0d0d0;
  transition: background-color 1s linear;
  margin-top: -10px;
  z-index: 1;
}

.coda-code-example .console.error {
  background-color: #a63131;
  transition: background-color 0s linear;
}

.coda-code-example .console::before {
  content: '> ';
  left: 8px;
  font-weight: bold;
  color: #6d8a88;
}

.coda-code-example .ui {
  font-family: monospace;
  background-color: #000620;
  padding: 10px;
  display: flex;
  flex-direction: column;
}
</style>
