const { inspect } = require('util');

module.exports = (ws_evs, bus, logger) => ({
  ws: [{
    ev: ws_evs.WIDGETS_LIST,
    handler: (_msg, _replyTo, client) => {
      logger.d('Requested widgets list: ');
      bus.emit(bus.evs.WIDGETS.LIST, client);
    }
  },
  {
    ev: ws_evs.DEVICES_SCAN,
    handler: () => {
      logger.d('Requested devices SCAN: ');
      bus.emit(bus.evs.DEVICES.SCAN);
    },
  },
  {
    ev: ws_evs.WIDGETS_CMD,
    handler: (msg) => {
      logger.d(`Requested to send CMD: ${inspect(msg)}`);
      bus.emit(bus.evs.WIDGETS.CMD, msg);
    },
  },
  {
    ev: ws_evs.SHECUDLER_LIST,
    handler: (msg, replyTo, client) => {
      logger.d(`Requested scheduler rules list: ${inspect(msg)}`);
      bus.emit(bus.evs.SCHEDULER.LIST, msg, replyTo, client);
    },
  }],
  bus: [{
    ev: ws_evs.SHECUDLER_LIST,
    handler: (msg, replyTo, client) => {
      logger.d(`Requested scheduler rules list: ${inspect(msg)}`);
      bus.emit(bus.evs.SCHEDULER.LIST, msg, replyTo, client);
    },
  }]
});

// this.#bus.on(this.#bus.evs.WIDGETS.UPDATE, ({ client, data }) => {
//   logger.d('Sending widget update data');
//   send(client, { ev: WS_EVS.WIDGETS_UPDATE, data });
// });

// this.#bus.on(this.#bus.evs.SEND_SCHEDULER_LIST)