<template>
  <div class="sidebar" :class="fixed && 'fixed'">
    <input type="text" name="" placeholder="Search..." @input="filter">
    <el-collapse v-model=sections>
      <el-collapse-item
        v-for="(section, key, i) in api"
        :key="`outline-section-${i}`"
        :title="key"
        :name="key"
        v-show="!search || section.filter(f => f.name.includes(search)).length > 0"
      >
      <ul class="section-detail">
        <li
          v-for="(f, j) in section"
          v-show="!search || f.name.includes(search)"
          :style="f.name === entry && 'font-weight: bold'"
          :key="`outline-section-${i}-${j}`"
        >
          <a :href="`/api/${f.name}`">
            <span class="hash"># </span>{{f.name}}
          </a>
        </li>
      </ul>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: 'api-sidebar',
  props: {
    api: Object,
    fixed: Boolean,
  },
  data() {
    const entry = (this.$route.params && this.$route.params.entry) || 'accum';
    const sections = Object.keys(this.api)
      .map(x => this.api[x].map(y => y.name).includes(entry) && x)
      .filter(x => !!x);
    return {
      search: false,
      entry,
      sections,
    };
  },
  methods: {
    filter(e) {
      this.search = e.target.value || false;
      this.sections = e.target.value ? Object.keys(this.api) : [];
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 250px !important;
  margin: 10px;
  border-right: 1px solid #dedede;
  position: absolute;
  top: 100px;
  left: 20px;
  width: 250px !important;
  height: calc(100vh - 120px);
  overflow: auto;
  position: fixed;
  top: 85px;
  height: calc(100vh - 95px);
  overflow: auto;
}
input {
  width: calc(100% - 10px);
  padding: 5px;
  margin-bottom: 10px;
}
.api-section {
  font-size: 0.8em;
  font-weight: 600;
  display: block;
  color: rgb(53, 73, 94);
}
ul.section-detail {
  list-style: none;
  margin: 0;
  padding-left: 10px;
}
.hash {
  color: #bdbdbd;
  font-size: 0.8em;
}
</style>
