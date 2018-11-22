<template>
  <div class="container">
    <div class="title"><span style="color: #e43056;">}-{o</span> coda.js</div>
    <div class="subtitle">live-coding the moving body</div>
    <section class="headline">
      <b>coda.js</b> is a Javascript library and live-coding environment for designing movement-based interactions in the browser.
      <!-- <b>coda.js</b> integrates bindings to some common sensing devices (such as the Myo armband), a collection of low-level signal processing operators, and a number of movement analysis, recognition, and interaction design tools. -->
    </section>
    <section class="icons">
      <SenseIcon w="60px" h="60px" animate="shake" />
      <ArrowIcon w="60px" h="60px" style="fill: #e43056;"/>
      <AnalyzeIcon w="60px" h="60px" animate="shake" />
      <ArrowIcon w="60px" h="60px" style="fill: #e43056;"/>
      <GenerateIcon w="60px" h="60px" animate="shake" />
    </section>
    <section class="columns">
      <div class="column">
        <h4>Sense</h4>
        <p><b>coda.js</b> integrates bindings to some common sensing devices (such as the Myo armband) and bridges with other platforms (for example, Max).</p>
      </div>
      <div class="column">
        <h4>Analyze</h4>
        <p><b>coda.js</b> comes with a collection of low-level signal processing operators, and a number of movement analysis, recognition, and interaction design tools.</p>
      </div>
      <div class="column">
        <h4>Generate</h4>
        <p><b>coda.js</b> integrates sound synthesis engines and digital audioi effects to facilitate conntinuous movement sonification</p>
      </div>
    </section>
    <center>
      <nuxt-link to="/guide/">
        <el-button type="success">Get Started →</el-button>
      </nuxt-link>
    </center>
    <section>
      <h3>Example</h3>
      <p>In this example, we map the position and velocity of the mouse to control sound textures of a thunderstorm.</p>
      <el-alert
        title="Audio might be loud!"
        type="warning"
        center
        show-icon
      >
      </el-alert>
      <code-example
        name="index-codex-1"
        code="const mousePosition = mousemove(doc)
  .startWith([0.5, 0.5])   // initialize position to [0.5; 0.5]
  .resample(periodic(10))  // resample at 100Hz
  .mvavrg({ size: 7 })     // apply a moving-average filter
  .plot({ legend: 'Mouse position (100Hz)'});

const mouseVelocity = mousePosition
  .delta({ size: 9 })      // compute the first derivative
  .plot({ legend: 'Mouse velocity (100Hz)'});

const mouseEnergy = mouseVelocity
  .map(x => Math.sqrt((x[0] * x[0] + x[1] * x[1]) / 2))     // norm of the velocity
  .withAttr({ format: 'scalar', size: 1 }) // adapt stream attributes
  .plot({ legend: 'mouse energy' });

const granulator = granular({
  file: 'thunderstorm',
  period: 0.2,
  duration: 2,
  releaseRel: 0.5,
});
granulator.connect();

granulator.gain = mouseEnergy;
granulator.position = mousePosition.unpack()[0];
granulator.resampling = mousePosition.unpack()[1]
  .scale({ outmin: -2400, outmax: 2400 });"
      ></code-example>
    </section>
  </div>
</template>

<script>
import SenseIcon from 'vue-ionicons/dist/ios-walk.vue';
import ArrowIcon from 'vue-ionicons/dist/ios-arrow-round-forward.vue';
import AnalyzeIcon from 'vue-ionicons/dist/ios-analytics.vue';
import GenerateIcon from 'vue-ionicons/dist/ios-flask.vue';
import CodeExample from '../components/CodeExample.vue';

export default {
  components: {
    CodeExample,
    ArrowIcon,
    SenseIcon,
    AnalyzeIcon,
    GenerateIcon,
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

.icons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 80%;
  margin-left: 10%;
  margin-top: 20px;
}

.icons .ion {
  flex-basis: 20%;
  margin: 0;
  padding: 0;
  fill: #0f5595;
  text-align: center;
}

.columns {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.column {
  text-align: center;
  flex-basis: calc(33% - 20px);
  margin: 0 10px;
}
</style>
