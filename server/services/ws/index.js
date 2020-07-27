const WebSocket = require('ws');
const evs = require('./events');
const { devices } = require('../../model');

const { config, logger } = global;
const mqttClient = require('../mqtt');

const wss = new WebSocket.Server({ port: config.ws.port });

const handlers = [{
  ev: evs.DEVICE_GET,
  handler: (message, client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ ev: evs.DEVICE_UPDATE, data: devices.getAll() }));
    }
  },
},
{
  ev: evs.DEVICE_SCAN,
  handler: () => {
    devices.scan();
  },
},
{
  ev: evs.DEVICE_CMD,
  handler: (message) => {
    console.dir(message);
    mqttClient.publish('');
  },
}];

// devices.onChange((d) => {
//   exports.broadcast(evs.DEVICE_UPDATE, d);
// });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const { ev, data } = JSON.parse(message);
    const hndlr = handlers.find((h) => h.ev === ev);

    if (hndlr === undefined) {
      logger.e(`No handler registered for ws event ${ev}`);
      return;
    }

    hndlr.handler(data, ws);
  });
});

exports.broadcast = (ev, data) => {
  const msg = JSON.stringify({ ev, data });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
};

exports.end = () => {
  logger.i('Closing websocket connections');
  wss.close();
};
