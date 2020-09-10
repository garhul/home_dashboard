const WebSocket = require('ws');
const evs = require('./events');
const { devices, sensors } = require('../../models');

const config = require('../../../config');
const logger = require('../logger');
const mqttClient = require('../mqtt');

const wss = new WebSocket.Server({ port: config.wsPort });

function send(client, data) {
  if (client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(data));
  } else {
    logger.e('Unable to send data, socket not open');
  }
}

const handlers = [
  {
    ev: evs.SENSORS_LIST,
    handler: (msg, client) => {
      logger.i('Requested sensor list');
      console.dir(sensors.getList());
      send(client, { ev: evs.SENSORS_LIST, data: sensors.getList() });
    },
  },
  {
    ev: evs.DEVICE_GET,
    handler: (message, client) => {
      send(client, { ev: evs.DEVICE_UPDATE, data: devices.getAll() });
    },
  },
  {
    ev: evs.SENSOR_UPDATE,
    handler: () => {
      logger.i('Rquested sensor update');
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
      logger.i(message);
      mqttClient.publish('');
    },
  },
];

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

  ws.send(JSON.stringify({ ev: evs.DEVICE_UPDATE, data: devices.getAll() }));
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

exports.evs = evs;
