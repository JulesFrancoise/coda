<template>
  <div class="device">
    <h1>Stream device data to coda</h1>
    <input type="text" name="devname" v-model="id" placeholder="enter id">
    <button type="button" name="connect" @click="connect">connect</button>
    <div>
      {{connected ? 'Connected!' : ''}}
    </div>
    <div class="error" v-if="idError">
      Error: this id is already used...
    </div>
    <div class="error" v-if="socketError">
      Socket error: cannot connect to server...
    </div>
  </div>
</template>

<script>
import MotionInput from '@ircam/motion-input';

export default {
  data() {
    const isIP = (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(window.location.hostname));
    const host = isIP
      ? `ws://${window.location.hostname}:9090`
      : 'wss://codaws.glitch.me/';
    const socket = new WebSocket(host);
    socket.onmessage = this.onMsg;
    socket.onopen = () => {
      this.socketError = false;
    };
    socket.onclose = () => {
      this.socketError = true;
    };
    return {
      id: '',
      socketError: true,
      idError: false,
      host: window.location.hostname,
      socket,
      msg: '',
      connected: false,
    };
  },
  methods: {
    connect() {
      this.socket.send(JSON.stringify({ type: 'connect', id: this.id }));
    },
    onMsg(json) {
      const m = JSON.parse(json.data);
      if (m.type === 'id') {
        this.id = m.id;
      } else if (m.type === 'success') {
        this.connected = true;
        this.idError = false;
        this.stream();
      } else if (m.type === 'error') {
        this.connected = false;
        this.idError = true;
      }
    },
    stream() {
      MotionInput
        .init([
          'accelerationIncludingGravity',
          'acceleration',
          'rotationRate',
        ])
        .then(([
          accelerationIncludingGravity,
          acceleration,
          rotationRate,
        ]) => {
          if (accelerationIncludingGravity.isProvided && accelerationIncludingGravity.isValid) {
            accelerationIncludingGravity.addListener((val) => {
              this.socket.send(JSON.stringify({
                type: 'data',
                id: this.id,
                accelerationIncludingGravity: val,
              }));
            });
          }
          if (acceleration.isProvided && acceleration.isValid) {
            acceleration.addListener((val) => {
              this.socket.send(JSON.stringify({
                type: 'data',
                id: this.id,
                acceleration: val,
              }));
            });
          }
          if (rotationRate.isProvided && rotationRate.isValid) {
            rotationRate.addListener((val) => {
              this.socket.send(JSON.stringify({
                type: 'data',
                id: this.id,
                rotationRate: val,
              }));
            });
          }
        })
        .catch((err) => {
          console.error(err.stack); // eslint-disable-line no-console
        });
    },
  },
};
</script>

<style scoped>
.device {
  font-size: 18px;
  width: 400px;
  max-width: calc(100% - 20px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-content: center;
}

input {
  height: 30px;
  font-size: 18px;
  margin-bottom: 10px;
}

button {
  height: 30px;
  font-size: 18px;
  margin-bottom: 10px;
}

.error {
  border: 1px solid red;
  color: red;
  padding: 10px;
}
</style>
