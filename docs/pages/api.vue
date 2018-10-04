<template>
  <div class="container">
    <api-sidebar :api="api"></api-sidebar>
    <div class="right">
      <section
        v-for="(section, key, i) in api"
        :key="`api-section-${i}`"
      >
        <h1 class="section-title">{{key}}</h1>
        <api-entry
          v-for="(entry, j) in section"
          :id="entry.name"
          :key="`api-entry-${i}-${j}`"
          :entry="entry"
          :allEntries="api"
        ></api-entry>
      </section>
      <div class="playground-container" v-if="playground">
        <div class="playground-header">
          <button type="button" name="run">Run</button>
        </div>
        <div class="playground">
          <div id="playground-left">
            <div id="editor">
              <pre>run(snippet, uiContainer) {
    console.log('this.$runCodeSnippet', this.$runCodeSnippet);
    this.$runCodeSnippet(snippet, uiContainer, this);
    console.log(snippet, uiContainer);
    this.running = true;
  };</pre>
            </div>
            <div id="console"></div>
          </div>
          <div id="ui"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiSidebar from '../components/ApiSidebar.vue';
import ApiEntry from '../components/ApiEntry.vue';
import api from './api.json';

let currentSection = 'default';
const structuredApi = api.reduce((s, entry) => {
  const t = s;
  if (entry.kind === 'note') {
    currentSection = entry.name;
    t[currentSection] = [];
  } else {
    t[currentSection].push(entry);
  }
  return s;
}, {});

export default {
  components: { ApiSidebar, ApiEntry },
  data() {
    return {
      playground: false,
    };
  },
  computed: {
    api() {
      return structuredApi;
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  background: #f5f5f5;
}
.right {
  position: relative;
  padding: 5px;
  width: calc(100% - 250px);
}
.api_entry_container {
  padding: 10px;
}
.section-title {
  color: #a13167;
  font-weight: 700;
  background: #fff;
  padding: 12px;
  margin-bottom: 8px;
}
.playground-container {
  position: fixed;
  bottom: -10px;
  right: 20px;
  height: 250px;
  width: calc(100vw - 310px);
  background-color: #35495e;
  border-radius: 10px;
  z-index: 4;
  display: flex;
  flex-direction: column;
}
.playground {
  display: flex;
  flex-direction: row;
}
#playground-left {
  display: flex;
  flex-direction: column;
  border-right: 2px solid #c1c1c1;
}
#editor {
  margin: 4px;
  color: white;
  height: 224px;
}
#console {
  padding-left: 10px;
  background: black;
  color: white;
  height: 16px;
}
.playground-header {
  height: 24px;
  color: #dedede;
  background-color: #203e5e;
  width: 100%;
  display: block;
  z-index: 5;
}
#ui {
  overflow: auto;
  width: 50%;
  background-color: #1c2630;
}
</style>
