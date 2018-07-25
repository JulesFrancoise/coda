<template>
  <div
    class="component"
    :class="`${type} ${paused ? 'paused' : ''}`"
    v-if="!closed"
  >
    <div class="header" :class="paused && 'paused'">
      <slot name="toolbar"></slot>
      <div class="title">
        {{ title }}
        <div class="common_tools">
          <div class="button" :class="paused ? 'green' : 'yellow'" @click="pause">
            <icon :name="paused ? 'plus' : 'minus'" scale="0.4"></icon>
          </div>
          <div class="button" @click="close">
            <icon name="times" scale="0.5"></icon>
          </div>
        </div>
      </div>
    </div>
    <div class="mainUI" v-show="!paused">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import 'vue-awesome/icons/times';
import 'vue-awesome/icons/plus';
import 'vue-awesome/icons/minus';
import Icon from 'vue-awesome/components/Icon.vue';

let componentId = 0;

export default {
  components: { Icon },
  props: {
    type: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    componentId += 1;
    return {
      componentId,
      legend: '',
      paused: false,
      closed: false,
    };
  },
  methods: {
    pause() {
      this.paused = !this.paused;
      this.$emit('pause', this.paused);
    },
    close() {
      this.closed = true;
      this.$emit('close', this.closed);
    },
  },
};
</script>

<style scoped>
.component {
  position: relative;
  display: block;
  width: calc(100% - 10px);
  margin: 5px;
  color: white;
  border: 1px solid #828282;
  border-radius: 8px;
  overflow: hidden;
  min-height: 116px;
}
.component.paused {
  min-height: 0;
}
.header {
  font-size: 9px;
  width: calc(100% - 4px);
  margin: 0;
  height: 16px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  background-color: #393939;
  border-bottom: 1px solid #828282;
  padding-left: 2px;
  padding-right: 2px;
}
.header.paused {
  border-bottom: none;
}
.toolbar, .common_tools {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  align-content: center;
}
.title {
  margin-right: 4px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  align-content: center;
}
.button {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  margin: 2px 1px;
  border: 1px solid #696969;
  text-align: center;
  color: white;
  padding: 2px 4px;
  font-size: 9px;
  height: 8px;
  cursor: pointer;
  border-radius: 8px;
  transition: color linear 0.3s, background-color linear 0.3s;
}
.button:hover {
  background-color: #8c8c8c;
  transition: color linear 0.3s, background-color linear 0.3s;
}
.button.active {
  background-color: #409be6;
}
.button.active:hover {
  background-color: #6ba8da;
}
.common_tools {
  margin-left: 6px;
}
.common_tools .button {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  margin: 2px 1px;
  border-color: #e64141;
  color: #e64141;
  text-align: center;
  padding: 2px 2px;
  font-size: 8px;
  cursor: pointer;
  width: 6px;
  height: 6px;
  border-radius: 6px;
}
.common_tools .button:hover {
  background-color: #e26767;
  color: white;
}
.common_tools .button.yellow {
  border-color: #c1b127;
  color: #c1b127;
}
.common_tools .button.yellow:hover {
  background-color: #d6ca5e;
  color: white;
}
.common_tools .button.green {
  border-color: #58e498;
  color: #58e498;
}
.common_tools .button.green:hover {
  background-color: #22c26b;
  color: white;
}
input {
  background-color: inherit;
  font-size: 9px;
  /* background-color: #a29f9f; */
  border: 1px solid #999;
  border-radius: 0;
  color: white;
  transition: color 0.3s linear;
  height: 12px;
}
input:focus {
  border: 1px solid #22c26b;
  transition: color 0.3s linear;
}
</style>
