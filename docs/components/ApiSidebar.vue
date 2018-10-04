<template>
  <div class="sidebar">
    <input type="text" name="" placeholder="Search..." @input="filter">
    <div
      v-for="(section, key, i) in api"
      :key="`outline-section-${i}`"
    >
      <a
        class="api-section"
        href="javascript:void(0)"
      >{{key}}</a>
      <ul class="section-detail">
        <li
          v-for="(f, j) in section"
          v-show="!search || f.name.includes(search)"
          :key="`outline-section-${i}-${j}`"
        >
          <a :href="`#${f.name}`">
            <span class="hash"># </span>{{f.name}}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'api-sidebar',
  props: {
    api: Object,
  },
  data() {
    return { search: false };
  },
  methods: {
    filter(e) {
      this.search = e.target.value || false;
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 250px !important;
  margin: 10px;
  border-right: 1px solid #dedede;
}
input {
  width: calc(100% - 10px);
  padding: 5px;
  margin-bottom: 10px;
}
.api-section {
  font-size: 1.2em;
  display: block;
  color: rgb(53, 73, 94);
}
ul.section-detail {
  list-style: none;
  padding-left: 10px;
}
.hash {
  color: #bdbdbd
}
</style>
