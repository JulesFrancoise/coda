<template>
  <div id="app">
    <my-header @load="load" @run="run" ref="header" />
    <playground
      width="100%"
      height="calc(100vh - 33px)"
      :value="code"
      @value="x => code = x"
      ref="playground"
    ></playground>
  </div>
</template>

<script>
import Playground from './components/Playground';
import MyHeader from './components/Header';

export default {
  name: 'App',
  components: {
    Playground,
    MyHeader,
  },
  data() {
    return {
      code: '// Welcome to the playground...',
    };
  },
  mounted() {
    const example = 'basic';
    this.load(example);
    this.$refs.header.selected = example;
    // window.onbeforeunload = () => '';
  },
  methods: {
    async load(example) {
      let contents = null;
      try {
        const response = await fetch(`/examples/${example}.js`, { method: 'get' });
        contents = await response.text();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('Error Fetching example =>', e);
      }
      if (contents) {
        this.code = contents;
      }
      return contents;
    },
    run() {
      this.$refs.playground.run(this.code);
    },
  },
};
</script>s

<style>
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

#app {
  font-size: 12px;
  font-family: sans-serif;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
}
</style>
