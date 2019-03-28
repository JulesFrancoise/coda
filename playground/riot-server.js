const osc = require('osc');
const WebSocket = require('ws');
const http = require('http');
const express = require('express');

const app = express();
const port = process.env.PORT || 9090;
const WebSocketServer = WebSocket.Server;

app.get('/', (_, res) => {
  res.send('Hello CO/DA!');
});

console.log('Waiting for RIOT Data...');

const server = http.createServer(app);
server.listen(port);

const wss = new WebSocketServer({ server });
const clients = {};

// Create an osc.js UDP Port listening on port 8888.
const udpPort = new osc.UDPPort({
  localAddress: '0.0.0.0',
  localPort: 8888,
  metadata: true,
});

const message = {
  acc: [0, 0, 0],
  gyro: [0, 0, 0],
  magneto: [0, 0, 0],
  quat: [0, 0, 0, 0],
  euler: [0, 0, 0],
};

let streaming = false;

udpPort.on('message', (oscMsg) => {
  const riotId = oscMsg.address.split('/')[1];
  if (!streaming) {
    console.log('RIOT', riotId, 'started streaming');
    streaming = true;
  }
  message.id = riotId;
  message.acc[0] = oscMsg.args[0].value;
  message.acc[1] = oscMsg.args[1].value;
  message.acc[2] = oscMsg.args[2].value;
  message.gyro[0] = oscMsg.args[3].value;
  message.gyro[1] = oscMsg.args[4].value;
  message.gyro[2] = oscMsg.args[5].value;
  message.magneto[0] = oscMsg.args[6].value;
  message.magneto[1] = oscMsg.args[7].value;
  message.magneto[2] = oscMsg.args[8].value;
  message.quat[0] = oscMsg.args[14].value;
  message.quat[1] = oscMsg.args[15].value;
  message.quat[2] = oscMsg.args[16].value;
  message.quat[3] = oscMsg.args[17].value;
  message.euler[0] = oscMsg.args[18].value;
  message.euler[1] = oscMsg.args[19].value;
  message.euler[2] = oscMsg.args[20].value;
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
});

// Open the socket.
udpPort.open();
