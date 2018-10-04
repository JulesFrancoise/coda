<template>
  <div class="overall_container">
    <site-header></site-header>
    <nuxt id="main"/>
    <site-footer></site-footer>
  </div>
</template>

<script type="text/javascript">
import SiteHeader from '../components/Header.vue';
import SiteFooter from '../components/Footer.vue';

export default {
  components: { SiteHeader, SiteFooter },
};
</script>
