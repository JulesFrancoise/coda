<template>
  <div class="container">
    <div class="title"><span style="color: #e43056;">}-{o</span> coda.js</div>
    <div class="subtitle">live-coding the moving body</div>
    <section class="headline">
      <b>coda</b> is a Javascript library and live-coding environment for designing movement-based interactions in the browser. <b>coda</b> integrates several bindings to common sensing devices (such as the Myo armband), a collection of low-level signal processing operator, and a number of movement analysis, recognition, and interaction design tools.
    </section>
    <code-example
      code="const mousePosition = mousemove(doc)
  .startWith([0.5, 0.5])   // initialize position to [0.5; 0.5]
  .resample(periodic(10))  // resample at 100Hz
  .mvavrg({ size: 7 })     // apply a moving-average filter
  .plot({ legend: 'Mouse position (100Hz)'});

const mouseVelocity = mousePosition
  .delta({ size: 9 })      // compute the first derivative
  .plot({ legend: 'Mouse velocity (100Hz)'});

const continuousWaveletTransform = mousePosition
  .wavelet()                // compute the online wavelet transform
  .heatmap({ legend: 'Continuous Wavelet Transform' });

// Run the stream
runEffects(continuousWaveletTransform, newDefaultScheduler());"
      name="index-codex-1"
    ></code-example>
  </div>
</template>

<script>
import CodeExample from '../components/CodeExample.vue';
import content from './index.md';

export default {
  components: { CodeExample },
  computed: {
    content() {
      return content;
    },
  },
};
</script>

<style scoped>
.container {
  position: relative;
  margin: 40px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.title {
  text-align: center;
  font-size: 100px;
  margin-top: 40px;
  color: #0f5595;
}

.subtitle {
  text-align: center;
  font-size: 40px;
  margin-top: 10px;
  padding-bottom: 40px;
  margin-bottom: 40px;
  color: #343b41;
  border-bottom: 2px solid #0f5595;
}

.headline {
  font-size: 24px;
  margin: 14px;
  margin-bottom: 20px;
}
</style>
