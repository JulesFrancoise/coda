<template>
  <div class="container">
    <api-sidebar :api="api" :fixed="fixed"></api-sidebar>
    <div class="right" :class="fixed && 'fixed'">
      <nuxt-child/>
    </div>
  </div>
</template>

<script>
import ApiSidebar from '../components/ApiSidebar';
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
  layout: 'fixed',
  components: { ApiSidebar },
  data() {
    return {
      fixed: false,
    };
  },
  computed: {
    api() {
      return structuredApi;
    },
  },
  mounted() {
    if (process.browser) {
      window.addEventListener('scroll', this.handleScroll);
    }
  },
  methods: {
    handleScroll(e) {
      this.fixed = e.pageY > 100;
    },
  },
};
</script>

<style scoped>
.container {
  /* background: #f5f5f5; */
  margin-top: 80px !important;
}
.right {
  position: relative;
  padding: 5px;
  width: calc(100% - 280px);
  margin-left: 270px;
}
.right.fixed {
}
.api_entry {
  padding: 10px;
}
.section-title {
  color: #a13167;
  font-weight: 700;
  background: #fff;
  padding: 12px;
  margin-bottom: 8px;
}
#ui {
  overflow: auto;
  width: 50%;
  background-color: #1c2630;
}
</style>
