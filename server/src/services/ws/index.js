const WebSocket = require('ws');
const { inspect } = require('util');
const config = require('../../../config');
const logger = require('../logger')('WS');
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
    ev: evs.WIDGETS_LIST,
    handler: (msg, client) => {
      logger.d('Requested widgets list: ');
      eventBus.emit(busEvents.WIDGETS.LIST, client);
    },
  },
  {
    ev: evs.DEVICES_SCAN,
    handler: () => {
      logger.d('Requested devices SCAN: ');
      eventBus.emit(busEvents.DEVICES.SCAN);
    },
  },
  {
    ev: evs.WIDGETS_CMD,
    handler: (msg) => {
      logger.d(`Requested to send CMD: ${inspect(msg)}`);
      eventBus.emit(busEvents.WIDGETS_CMD, msg);
    },
  },
];

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const { ev, msg } = JSON.parse(message);
    const hndlr = handlers.find((h) => h.ev === ev);
    if (hndlr === undefined) {
      logger.e(`No handler registered for ws event ${ev}`);
      return;
    }

    hndlr.handler(msg, ws);
  });
});

eventBus.on(busEvents.WIDGETS.UPDATE, ({ client, data }) => {
  logger.d('Sending widget update data');
  send(client, { ev: evs.WIDGETS_UPDATE, data });
});

exports.end = () => {
  logger.d('Closing websocket connections');
  wss.close();
};
