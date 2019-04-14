<template>
  <div class="container">
    <examples-sidebar></examples-sidebar>
    <div class="right">
      <div class="example" id="basic">
        <h1>Examples (more to come...)</h1>
        <h3>Basic</h3>
        <p>
          Generate a 100Hz random signal, and apply two different biquad filters: a lowpass
          biquad filter of 1 Hz cutoff frequency, and a bandpass filter with 2 Hz cutoff
          frequency.
        </p>
        <script async src="//jsfiddle.net/trtfohdw/2/embed/js,html,result/"></script>
      </div>
    </div>
  </div>
</template>

<script>
import ExamplesSidebar from '../components/ExamplesSidebar';

export default {
  components: { ExamplesSidebar },
};
</script>

<style>
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
