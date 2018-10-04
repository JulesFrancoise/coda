<template>
  <div class="coda-code-example">
    <div class="editor">
      <pre class="language-js"><code class="language-js" v-html="prismCode"></code></pre>
      <el-button
        @click="running ? stop(code) : run(code)"
        :type="running ? 'danger' : 'success'"
      >
        {{running ? 'stop' : 'run'}}
      </el-button>
    </div>
    <div v-show="running" style="position: relative;">
      <div class="console" :class="consoleError && 'error'">{{consoleMsg}}</div>
      <div :id="`${name}-ui`" class="ui"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'code-example',
  props: {
    code: String,
    name: String,
  },
  data() {
    return {
      running: false,
      consoleMsg: '',
      consoleError: false,
    };
  },
  mounted() {
    this.runSnippet = this.$createSandbox(`${this.name}-ui`, (msg, isError) => {
      this.consoleMsg = msg;
      if (isError) {
        this.consoleError = true;
        setTimeout(() => {
          this.consoleError = false;
        }, 200);
      }
    });
  },
  computed: {
    prismCode() {
      return this.$highlight(this.code);
    },
  },
  methods: {
    run(snippet) {
      this.runSnippet(snippet.replace(/console.log/g, 'log'));
      this.running = true;
    },
    stop() {
      this.runSnippet('clear();');
      this.running = false;
    },
  },
};
</script>

<style scoped>
.coda-code-example {
  width: calc(100% - 20px);
  margin: 10px;
  border-radius: 5px;
  border: 1px solid #dedede;
  overflow: hidden;
  padding: 0;
}

.coda-code-example .editor {
  position: relative;
  font-size: 14px;
}

.coda-code-example .editor button {
  position: absolute;
  right: 20px;
  bottom: 10px;
  padding-top: 7px;
  padding-bottom: 7px;
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
  padding-top: 4px;
  padding-bottom: 4px;
  font-size: 14px;
  background-color: #1a1b16;
  color: #d0d0d0;
  transition: background-color 1s linear;
}

.coda-code-example .console.error {
  background-color: #a63131;
  transition: background-color 0s linear;
}

.coda-code-example .console::before {
  content: '> ';
  left: 8px;
  font-weight: bold;
  color: #0f5998;
}

.coda-code-example .ui {
  font-family: monospace;
  background-color: rgb(39, 40, 34);
  padding: 10px;
  display: flex;
  flex-direction: column;
}
</style>
