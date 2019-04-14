<template>
  <div class="container">
    <div class="title"><span style="color: #e43056;">}-{o</span> coda.js</div>
    <div class="subtitle">live-coding the moving body</div>
    <section class="headline">
      <b>coda.js</b> is a Javascript library and live-coding environment for designing
      movement-based interactions in the browser.
    </section>
    <section class="icons">
      <svg width="45px" height="45px" viewBox="0 0 512 512">
        <!-- eslint-disable-next-line max-len -->
        <path d="M288 112c22.223 0 39.997-17.776 39.997-40 0-22.225-17.774-40-39.997-40s-40.003 17.775-40.003 40c0 22.224 17.78 40 40.003 40zm0 120h104v-40h-72l-44.802-69.333c-7.698-11.667-18.136-18.136-30.933-18.136-3.198 0-8.828.531-12.799 1.747L120 144v112h40v-80l40.531-16L120 480h40l56.698-164.271L267 384v96h38V352l-57.031-96 19.745-61.864L288 232z"/>
      </svg>
      <svg width="45px" height="45px" viewBox="0 0 512 512">
        <path d="M160 128.4L192.3 96 352 256 192.3 416 160 383.6 287.3 256z"/>
      </svg>
      <svg width="45px" height="45px" viewBox="0 0 512 512">
        <!-- eslint-disable-next-line max-len -->
        <path d="M256 32C141.174 32 46.544 118.404 33.54 229.739A226.3 226.3 0 0 0 32 256c0 1.783.026 3.561.067 5.333C34.901 382.581 134.071 480 256 480c105.255 0 193.537-72.602 217.542-170.454a222.832 222.832 0 0 0 3.404-16.579A225.536 225.536 0 0 0 480 256c0-123.712-100.288-224-224-224zm206.585 248.352c-7.265-7.807-13.064-16.09-15.702-20.429-.871-1.47-21.682-35.994-52.828-35.994-27.937 0-42.269 26.269-51.751 43.65-1.415 2.593-2.75 5.041-3.978 7.118-11.566 19.587-27.693 30.608-43.105 29.541-13.586-.959-25.174-11.403-32.628-29.41-9.331-22.54-29.551-46.812-53.689-50.229-11.428-1.619-28.553.866-45.325 21.876-3.293 4.124-6.964 9.612-11.215 15.967-10.572 15.804-26.549 39.686-38.653 41.663-21.02 3.438-35.021-12.596-35.583-13.249l-.487-.58-.587-.479c-.208-.17-15.041-12.417-29.047-33.334 0-.155-.006-.31-.006-.464 0-28.087 5.497-55.325 16.339-80.958 10.476-24.767 25.476-47.013 44.583-66.12s41.354-34.107 66.12-44.583C200.675 53.497 227.913 48 256 48s55.325 5.497 80.958 16.339c24.767 10.476 47.013 25.476 66.12 44.583s34.107 41.354 44.583 66.12C458.503 200.675 464 227.913 464 256c0 8.197-.482 16.318-1.415 24.352z"/>
      </svg>
      <svg width="45px" height="45px" viewBox="0 0 512 512">
        <path d="M160 128.4L192.3 96 352 256 192.3 416 160 383.6 287.3 256z"/>
      </svg>
      <svg width="45px" height="45px" viewBox="0 0 512 512">
        <!-- eslint-disable-next-line max-len -->
        <path d="M391.016 382.994l-.15-.124L323.7 272H188.554l-66.549 110.855-.166.042-.177.302c-5.461 8.334-8.319 18.773-8.319 24.717 0 12.945 4.481 16.848 5.954 18.088 4.46 3.76 12.667 5.996 23.731 5.996H368.96c10.278 0 18.232-2.521 23.007-6.85 4.205-3.814 6.454-9.956 6.683-17.795.172-5.904-2.093-15.968-7.476-24.18l-.158-.181z"/>
        <!-- eslint-disable-next-line max-len -->
        <path d="M436.912 370.441L320 175V48h16V32H176v16h16v127L76.125 370.441c-8.41 15.827-12.509 31.373-12.097 45.559 1.061 36.511 28.701 64 65.065 64h255.888c36.292 0 62.132-27.598 62.993-64 .338-14.244-2.607-29.651-11.062-45.559zM208 64h48v16h-48V64zm0 48h32v16h-32v-16zm0 48h48v16h-48v-16zm-16.739 48H240v16h-58.179l9.44-16zM414.64 408.041C413.934 432.289 398.763 448 368.96 448H143.027c-29.862 0-45.682-12.25-45.682-39.834 0-9.455 4.029-23.008 10.937-33.55L179.49 256h153.228l71.836 118.717c6.943 10.595 10.362 23.836 10.086 33.324z"/>
      </svg>
    </section>
    <section class="columns">
      <div class="column">
        <h4>Sense</h4>
        <p>
          <b>coda.js</b> integrates bindings to some common sensing devices (such as the
          Myo armband) and bridges with other platforms (for example, Max).
        </p>
      </div>
      <div class="column">
        <h4>Analyze</h4>
        <p>
          <b>coda.js</b> comes with a collection of low-level signal processing
          operators, and a number of movement analysis, recognition, and interaction
          design tools.
        </p>
      </div>
      <div class="column">
        <h4>Generate</h4>
        <p>
          <b>coda.js</b> integrates sound synthesis engines and digital audioi
          effects to facilitate conntinuous movement sonification
        </p>
      </div>
    </section>
    <center>
      <nuxt-link to="/guide/">
        <el-button type="success">Get Started →</el-button>
      </nuxt-link>
    </center>
    <section>
      <h3>Example</h3>
      <p>
        In this example, we map the position and velocity of the mouse to control
        sound textures of a thunderstorm.
      </p>
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
import CodeExample from '../components/CodeExample';

export default {
  components: {
    CodeExample,
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
  margin-top: 30px;
  margin-bottom: 0;
}

.icons svg {
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
