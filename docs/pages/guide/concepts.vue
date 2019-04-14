<template>
  <div class="container">
    <guide-sidebar></guide-sidebar>
    <div class="right">
      <div v-html="content"></div>
    </div>
  </div>
</template>

<script>
import GuideSidebar from '../../components/GuideSidebar';
import content from './concepts.md';

export default {
  components: { GuideSidebar },
  computed: {
    content() {
      return content;
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
}
.right {
  position: relative;
  margin: 10px;
  width: calc(100% - 250px);
}
</style>
