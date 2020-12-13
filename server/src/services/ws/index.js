const WebSocket = require('ws');
const { inspect } = require('util');
const config = require('../../../config');
const logger = require('../logger');
const evs = require('./events');
const busEvents = require('../../events');
const eventBus = require('../../eventBus');

const wss = new WebSocket.Server({ port: config.wsPort });

function send(client = null, data) {
  if (client !== null) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    } else {
      logger.e('Unable to send data, socket not open', 'WS');
    }
  } else {
    const msg = JSON.stringify(data);
    wss.clients.forEach((cl) => {
      if (cl.readyState === WebSocket.OPEN) {
        cl.send(msg);
      }
    });
  }
}

const handlers = [
  {
    ev: evs.GROUPS_LIST,
    handler: (msg, client) => {
      logger.d('Requested groups list: ', 'WS');
      eventBus.emit(busEvents.GROUPS.LIST, client);
    },
  },
  {
    ev: evs.SENSORS_LIST,
    handler: (msg, client) => {
      logger.d('Requested sensor list: ', 'WS');
      eventBus.emit(busEvents.SENSORS.LIST, client);
    },
  },
  {
    ev: evs.DEVICES_LIST,
    handler: (message, client) => {
      logger.d('Requested devices list: ', 'WS');
      eventBus.emit(busEvents.DEVICES.LIST, client);
    },
  },
  {
    ev: evs.DEVICES_SCAN,
    handler: () => {
      logger.d('Requested devices SCAN: ', 'WS');
      eventBus.emit(busEvents.DEVICES.SCAN);
    },
  },
  {
    ev: evs.DEVICES_CMD,
    handler: (msg) => {
      logger.d(`Requested to send devices CMD: ${inspect(msg)}`, 'WS');
      eventBus.emit(busEvents.DEVICES.CMD, msg);
    },
  },
];

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const { ev, msg } = JSON.parse(message);
    const hndlr = handlers.find((h) => h.ev === ev);
    if (hndlr === undefined) {
      logger.e(`No handler registered for ws event ${ev}`, 'WS');
      return;
    }

    hndlr.handler(msg, ws);
  });
});

eventBus.on(busEvents.DEVICES.UPDATE, ({ client, data }) => {
  logger.d('Sending devices update data', 'WS');
  send(client, { ev: evs.DEVICES_UPDATE, data });
});

eventBus.on(busEvents.GROUPS.UPDATE, ({ client, data }) => {
  logger.d('Sending groups update data', 'WS');
  send(client, { ev: evs.GROUPS_UPDATE, data });
});

exports.end = () => {
  logger.d('Closing websocket connections', 'WS');
  wss.close();
};
