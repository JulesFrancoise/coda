<template>
  <div class="sidebar">
    <nuxt-link
      class="example-section"
      to="#basic"
      exact
    >Basic</nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'examples-sidebar',
};
</script>

<style scoped>
.sidebar {
  width: 250px !important;
  margin: 10px;
  border-right: 1px solid #dedede;
}
.example-section {
  font-size: 1.2em;
  display: block;
  color: rgb(53, 73, 94);
  margin-bottom: 10px;
}
.example-section.nuxt-link-active {
  color: rgb(40, 102, 167);
  font-weight: 500;
}
</style>
