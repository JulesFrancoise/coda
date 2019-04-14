<template>
  <base-component
    type="nodes"
    class="nodes"
    :title="legend"
    height="200"
    @pause="paused => this.paused = paused"
    @close="$emit('close')"
  >
    <div slot="toolbar" class="toolbar">
      <div class="button" @click="record">
        <icon :name="recording ? 'stop' : 'circle'" scale="0.5" style="color: red"></icon>
      </div>
      <div class="button" @click="addnode()">
        <icon name="plus" scale="0.5"></icon>
      </div>
      <div class="nodes_buttons">
        <span style="margin-right: 2px;">nodes:</span>
        <div
          v-for="(node, idx) in nodes"
          class="button"
          :key="`node_but_idx_${idx}`"
          :class="(parseInt(idx, 10) === nodeIndex) && 'active'"
          @click="nodeIndex = parseInt(idx, 10)"
        >{{ idx }}</div>
      </div>
      <div class="nodeinfo">
        <span style="margin-right: 2px;">node #{{ nodeIndex }} => label:</span>
        <input v-model="nodes[nodeIndex].label" @change="setLabel">
        <div class="button" @click="removenode">
          <icon name="trash" scale="0.5"></icon>
        </div>
      </div>
    </div>
    <div class="nodes_">
      <div class="nodes__">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          :viewBox="`0, 0, 1, 1`"
          preserveAspectRatio="none"
          style="width: 300px; height: 300px;"
          ref="nodesSvg"
          @mousedown.prevent="svgClick"
          @touchstart.prevent="svgClickTouch"
          @mousemove.prevent="drag"
          @mouseup="drop"
          @touchmove.prevent="dragTouch"
          @touchend="drop"
        >
          <g
            v-for="(node, idx) in nodes"
            :key="`node-g-${idx}`"
          >
            <circle
              class="svg_node"
              :class="(parseInt(idx, 10) === nodeIndex) && 'active'"
              @click="nodeIndex = parseInt(idx, 10)"
              :cx="node.x"
              :cy="node.y"
              :r="node.r"
              @mousedown="select(parseInt(idx, 10))"
              @touchstart="select(parseInt(idx, 10))"
            >{{ idx }}</circle>
            <text
              class="svg_node_label"
              :class="(parseInt(idx, 10) === nodeIndex) && 'active'"
              :x="node.x"
              :y="node.y + node.r/2"
              text-anchor="middle"
              pointer-events="none"
              fill="white"
              font-size="0.05"
            >{{ idx }}</text>

          </g>
        </svg>
      </div>
    </div>
  </base-component>
</template>

<script>
import 'vue-awesome/icons/circle';
import 'vue-awesome/icons/stop';
import 'vue-awesome/icons/plus';
import 'vue-awesome/icons/trash';
import Icon from 'vue-awesome/components/Icon.vue';
import BaseComponent from './BaseComponent.vue';

let nondesUiId = 0;
let nextNode = 2;

export default {
  components: { BaseComponent, Icon },
  data() {
    nondesUiId += 1;
    return {
      nondesUiId,
      legend: '',
      recording: false,
      closed: false,
      channels: 1,
      nodeIndex: 1,
      currentLabel: 'a',
      nodes: {
        1: {
          x: 0.5,
          y: 0.5,
          r: 0.04,
          label: 'a',
        },
      },
      mouse: {
        prevClick: 0,
        selected: false,
        down: false,
        dragging: false,
      },
    };
  },
  methods: {
    setBufferData() {},
    record() {
      this.recording = !this.recording;
      this.$emit(
        'record',
        this.recording,
        {
          index: this.nodeIndex,
          coords: [this.nodes[this.nodeIndex].x, this.nodes[this.nodeIndex].y],
          label: this.nodes[this.nodeIndex].label,
        },
      );
    },
    addnode(x = 0.5, y = 0.5) {
      if (this.recording) this.record();
      this.$set(this.nodes, nextNode, {
        x,
        y,
        r: 0.04,
        label: this.currentLabel,
      });
      this.nodeIndex = nextNode;
      nextNode += 1;
    },
    removenode() {
      this.$emit('remove', this.nodeIndex);
      if (Object.keys(this.nodes).length > 1) {
        delete this.nodes[this.nodeIndex];
      } else {
        this.nodes = {
          1: {
            x: 0.5,
            y: 0.5,
            r: 0.04,
            label: '1',
          },
        };
        nextNode = 2;
      }
      this.nodeIndex = parseInt(Object.keys(this.nodes)[0], 10);
    },
    movenode(nodeIndex, x, y) {
      this.nodes[nodeIndex].x = x;
      this.nodes[nodeIndex].y = y;
    },
    close() {
      this.closed = true;
    },
    setLabel(e) {
      const label = e.target.value;
      this.nodes[this.nodeIndex].label = label;
      this.currentLabel = label;
      this.$emit('label', this.nodeIndex, label);
    },
    select(circleId) {
      if (this.isDblClick()) {
        this.removenode(circleId);
        this.mouse.selected = false;
        this.justRemoved = true;
        this.mouse.prevClick = 0;
      } else {
        this.mouse.selected = circleId;
      }
      this.mouse.down = true;
    },
    isDblClick() {
      const thisTime = (new Date()).getTime();
      const isDbl = (thisTime - this.mouse.prevClick < 300);
      this.mouse.prevClick = isDbl ? 0 : thisTime;
      return isDbl;
    },
    insideCircle(x, y, circle) {
      return ((x - circle.x) ** 2) + ((y - circle.y) ** 2) < (circle.r) ** 2;
    },
    insideAnyCircle(x, y) {
      return Object.values(this.nodes).filter(c => this.insideCircle(x, y, c)).length > 0;
    },
    toSvgCoords({ x, y }) {
      const svgRect = this.$refs.nodesSvg.getBoundingClientRect();
      return {
        x: (x - svgRect.left) / svgRect.width,
        y: (y - svgRect.top) / svgRect.height,
      };
    },
    svgClickTouch(e) {
      if (e.touches && e.touches.length === 1) {
        this.svgClick({
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY,
        });
      }
    },
    svgClick(e) {
      const coords = this.toSvgCoords({ x: e.clientX, y: e.clientY });
      if (this.insideAnyCircle(coords.x, coords.y)) return;
      if (this.drawPaths) {
        // if (this.mouse.selected === false && !this.justRemoved) {
        //   this.addNode({
        //     x: coords.x,
        //     y: coords.y,
        //   });
        //   this.mouse.selected = this.nodes.length - 1;
        //   this.sendToMax({
        //     channel: this.channel,
        //     msg: [
        //       'select',
        //       this.nodes.length,
        //       this.nodes[this.nodes.length - 1].x,
        //       1 - this.nodes[this.nodes.length - 1].y,
        //     ],
        //   });
        // }
      } else if (this.isDblClick() && !this.justRemoved) {
        this.addnode(coords.x, coords.y);
        this.mouse.selected = this.nodes.length - 1;
      } else {
        this.mouse.selected = false;
      }
      this.mouse.down = true;
      this.justRemoved = false;
    },
    dragTouch(e) {
      if (e.touches && e.touches.length === 1) {
        this.drag({
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY,
        });
      }
    },
    drag(e) {
      if (this.mouse.selected === false || !this.mouse.down) return;
      const { x, y } = this.toSvgCoords({ x: e.clientX, y: e.clientY });
      // if (this.drawPaths && !this.mouse.dragging) {
      //   this.nodes[this.mouse.selected].path = [];
      // }
      this.movenode(this.mouse.selected, x, y);
      this.mouse.dragging = true;
    },
    drop() {
      this.mouse.down = false;
      if (this.mouse.dragging) {
        this.mouse.selected = false;
        this.mouse.dragging = false;
      }
      this.$emit('move', {
        index: this.nodeIndex,
        coords: [this.nodes[this.nodeIndex].x, this.nodes[this.nodeIndex].y],
        label: this.nodes[this.nodeIndex].label,
      });
    },
  },
};
</script>

<style scoped>
.nodes {
  min-height: 316px;
}
.nodes_buttons, .nodeinfo {
  margin: 0 4px;
  padding: 0 4px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  align-content: center;
  height: 16px;
}
.nodes_buttons {
  border-left: 2px solid #409be6;
  border-right: 2px solid #409be6;
}
.nodeinfo {
  border-left: 2px solid #22c26b;
  border-right: 2px solid #22c26b;
}
.nodes_buttons .button.active {
  background-color: #22c26b;
}
.nodes__ {
  display: flex;
  flex-direction: column;
}
.nodes__ svg {
  border-right: 1px solid #0C1021;
}
.svg_node {
  fill: #409be6;
}
.svg_node.active {
  fill: #22c26b;
}
</style>
