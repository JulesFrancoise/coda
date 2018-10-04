<template>
  <section class="container">
    <div>
      <div v-html="content"></div>
    </div>
  </section>
</template>

<script>
import content from './credits.md';

export default {
  computed: {
    content() {
      return content;
    },
  },
};
</script>

<style>
.container {
}
</style>
