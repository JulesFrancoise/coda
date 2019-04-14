<template>
  <div class="overall_container">
    <site-header fixed></site-header>
    <nuxt id="main"/>
    <!-- <site-footer></site-footer> -->
  </div>
</template>

<script type="text/javascript">
import SiteHeader from '../components/Header';
// import SiteFooter from '../components/Footer';

export default {
  components: { SiteHeader },
  // components: { SiteHeader, SiteFooter },
};
</script>
