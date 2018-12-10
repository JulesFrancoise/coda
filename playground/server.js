const WebSocket = require('ws');
const http = require('http');
const express = require('express');

const app = express();
const port = process.env.PORT || 9090;
const WebSocketServer = WebSocket.Server;

app.get('/', (req, res) => {
  res.send('Hello CO/DA!');
});

const server = http.createServer(app);
server.listen(port);

const wss = new WebSocketServer({ server });
const clients = {};

wss.on('connection', (ws) => {
  const thisSocket = ws;
  let thisId = null;
  thisSocket.isOperator = false;
  ws.on('message', (message) => {
    // console.log('onmessage', message);
    const m = JSON.parse(message);
    if (m.type === 'connect') {
      try {
        if (thisId) delete clients[thisId];
        if (Object.keys(clients).includes(m.id)) {
          // console.log('client id conflict:', m.id);
          ws.send(JSON.stringify({ type: 'error' }));
        } else {
          clients[m.id] = ws;
          thisId = m.id;
          // eslint-disable-next-line no-console
          console.log(`Client ${thisId} joined.`);
          ws.send(JSON.stringify({ type: 'success' }));
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('Error on connect', e.stack());
      }
    } else if (m.type === 'operator') {
      thisSocket.isOperator = true;
    } else if (m.type === 'data') {
      wss.clients.forEach((client) => {
        if (client.isOperator && client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  });
  ws.on('close', () => {
    delete clients[thisId];
    // eslint-disable-next-line no-console
    console.log(`Client ${thisId} left.`);
  });
});
