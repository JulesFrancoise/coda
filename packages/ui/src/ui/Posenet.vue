<template>
  <base-component
    type="posenet"
    title="Posenet"
    @pause="paused => this.paused = paused"
    @close="$emit('close')"
  >
    <div id='main'>
      <p v-if="loading">Loading Posenet...</p>
      <video id="video" playsinline style=" -moz-transform: scaleX(-1);
      -o-transform: scaleX(-1);
      -webkit-transform: scaleX(-1);
      transform: scaleX(-1);
      display: none;
      ">
      </video>
      <canvas id="output" />
    </div>
  </base-component>
</template>

<script>
/* global posenet */
import BaseComponent from './BaseComponent.vue';
import {
  drawBoundingBox,
  drawKeypoints,
  drawSkeleton,
  isMobile,
} from './demo_util';

const videoWidth = 400;
const videoHeight = 300;

/**
 * Loads a the camera to be used in the demo
 *
 */
async function setupCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
  }

  const video = document.getElementById('video');
  video.width = videoWidth;
  video.height = videoHeight;

  const mobile = isMobile();
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: 'user',
      width: mobile ? undefined : videoWidth,
      height: mobile ? undefined : videoHeight,
    },
  });
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

async function loadVideo() {
  const video = await setupCamera();
  video.play();

  return video;
}

export default {
  components: { BaseComponent },
  data() {
    navigator.getUserMedia = navigator.getUserMedia
      || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    return {
      net: null,
      video: null,
      loading: true,
    };
  },
  async mounted() {
    this.net = await posenet.load({
      architecture: 'ResNet50',
      outputStride: 32,
      inputResolution: { width: 257, height: 200 },
      quantBytes: 2,
    });
    this.video = await loadVideo();
    this.loading = false;
    this.detectPoseInRealTime();
  },
  methods: {
    detectPoseInRealTime() {
      this.canvas = document.getElementById('output');
      this.ctx = this.canvas.getContext('2d');

      this.canvas.width = videoWidth;
      this.canvas.height = videoHeight;
      this.poseDetectionFrame();
    },
    async poseDetectionFrame() {
      const poses = await this.net.estimatePoses(this.video, {
        flipHorizontal: true,
        decodingMethod: 'single-person',
      });
      this.ctx.clearRect(0, 0, videoWidth, videoHeight);

      this.ctx.save();
      this.ctx.scale(-1, 1);
      this.ctx.translate(-videoWidth, 0);
      this.ctx.drawImage(this.video, 0, 0, videoWidth, videoHeight);
      this.ctx.restore();

      poses.forEach(({ score, keypoints }) => {
        const minPoseConfidence = 0.1;
        const minPartConfidence = 0.5;
        this.$emit('keypoints', keypoints);
        if (score >= minPoseConfidence) {
          drawKeypoints(keypoints, minPartConfidence, this.ctx);
          drawSkeleton(keypoints, minPartConfidence, this.ctx);
          drawBoundingBox(keypoints, this.ctx);
        }
      });
      requestAnimationFrame(this.poseDetectionFrame.bind(this));
    },
  },
};
</script>

<style scoped>
</style>
