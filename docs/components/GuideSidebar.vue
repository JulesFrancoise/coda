<template>
  <div class="sidebar">
    <nuxt-link
      class="guide-section"
      to="/guide"
      exact
    >Introduction</nuxt-link>
    <nuxt-link
      class="guide-section"
      to="/guide/concepts"
      exact
    >Concepts</nuxt-link>
    <nuxt-link
      class="guide-section"
      to="/guide/getting-started"
      exact
    >Getting Started</nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'guide-sidebar',
};
</script>

<style scoped>
.sidebar {
  width: 250px !important;
  margin: 10px;
  border-right: 1px solid #dedede;
}
.guide-section {
  font-size: 1.2em;
  display: block;
  color: rgb(53, 73, 94);
  margin-bottom: 10px;
}
.guide-section.nuxt-link-active {
  color: rgb(40, 102, 167);
  font-weight: 500;
}
</style>
